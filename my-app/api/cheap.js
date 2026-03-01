import clientPromise from "../src/lib/mongodb.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { origin, maxPrice, days, from } = req.query;

        // ✅ Allowed origins
        const allowedOrigins = ["CRL", "BRU"];
        const departureAirport =
            allowedOrigins.includes(origin) ? origin : "CRL";

        const priceLimit = maxPrice ? Number(maxPrice) : 120;
        const durationDays = days ? Number(days) : 2;

        // 🔁 Optional: Cache in MongoDB for 6 hours
        const client = await clientPromise;
        const db = client.db("flightDB");

        // 📅 Dynamic 7 month window
        const today = from ? new Date(from) : new Date();
        const formatDate = (d) => d.toISOString().split("T")[0];

        const cacheKey = `${departureAirport}_${priceLimit}_${durationDays}_${formatDate(today)}_7months`;

        const cached = await db.collection("cheap_cache").findOne({ key: cacheKey });
        const now = new Date();

        if (cached && now - new Date(cached.createdAt) < 6 * 60 * 60 * 1000) {
            return res.status(200).json({
                filters: { origin: departureAirport, maxPrice: priceLimit, days: durationDays },
                trips: cached.data
            });
        }

        // fallback als invalid date
        if (isNaN(today.getTime())) {
            return res.status(400).json({
                error: "Invalid 'from' date format. Use YYYY-MM-DD",
                filters: {},
                trips: []
            });
        }
        const sevenMonthsLater = new Date();
        sevenMonthsLater.setMonth(today.getMonth() + 7);


        const baseParams = {
            departureAirportIataCode: departureAirport,
            outboundDepartureDateFrom: formatDate(today),
            outboundDepartureDateTo: formatDate(sevenMonthsLater),
            inboundDepartureDateFrom: formatDate(new Date(today.getTime() + 86400000)),
            inboundDepartureDateTo: formatDate(new Date(sevenMonthsLater.getTime() + 86400000)),
            durationFrom: 1,
            durationTo: durationDays,
            outboundDepartureDaysOfWeek:
                "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY",
            outboundDepartureTimeFrom: "00:00",
            outboundDepartureTimeTo: "11:00",
            inboundDepartureTimeFrom: "14:00",
            inboundDepartureTimeTo: "23:59",
            priceValueTo: priceLimit,
            currency: "EUR",
            market: "en-gb",
            adultPaxCount: 1
        };

        let allFares = [];
        let page = 0;

        while (true) {
            const query = new URLSearchParams({
                ...baseParams,
                pageNumber: page
            });

            const response = await fetch(
                `https://www.ryanair.com/api/farfnd/v4/roundTripFares?${query}`,
                {
                    headers: {
                        "Accept": "application/json, text/plain, */*",
                        "User-Agent": "Mozilla/5.0",
                        "client-version": "0.0.22-alpha.2",
                        "client": "desktop"
                    }
                }
            );

            if (!response.ok) break;

            const data = await response.json();

            allFares.push(...(data.fares || []));

            if (data.nextPage == null) break;
            page = data.nextPage;
        }

        const parsed = allFares.map(fare => {
            const outbound = new Date(fare.outbound.departureDate);
            const inbound = new Date(fare.inbound.departureDate);

            const weekend =
                outbound.getDay() === 6 ||
                outbound.getDay() === 0 ||
                inbound.getDay() === 6 ||
                inbound.getDay() === 0;

            return {
                destination: fare.outbound.arrivalAirport.city.name,
                country: fare.outbound.arrivalAirport.countryName,
                outbound,
                inbound,
                price: fare.summary.price.value,
                currency: fare.summary.price.currencyCode,
                weekend
            };
        });

        parsed.sort(
            (a, b) =>
                a.price - b.price ||
                (a.weekend === b.weekend ? 0 : a.weekend ? -1 : 1) ||
                a.outbound - b.outbound
        );

        // Save to cache
        await db.collection("cheap_cache").updateOne(
            { key: cacheKey },
            { $set: { key: cacheKey, data: parsed, createdAt: new Date() } },
            { upsert: true }
        );

        res.status(200).json({
            filters: { origin: departureAirport, maxPrice: priceLimit, days: durationDays },
            trips: parsed
        });

    } catch (err) {
        console.error("Cheap API error:", err);
        res.status(500).json({ error: "Failed to fetch fares", filters: {}, trips: [] });
    }
}