import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

interface Trip {
  destination: string;
  country: string;
  outbound: string;
  inbound: string;
  price: number;
  currency: string;
  weekend: boolean;
}

export default function Cheap() {
  const [origin, setOrigin] = useState("CRL");
  const [maxPrice, setMaxPrice] = useState(120);
  const [days, setDays] = useState(2);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["cheapTrips", origin, maxPrice, days, fromDate],
    queryFn: async () => {
      const res = await fetch(
        `/api/cheap?origin=${origin}&maxPrice=${maxPrice}&days=${days}&from=${fromDate}`,
      );
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  // ✅ Safely extract trips from API response
  const trips: Trip[] = Array.isArray(data?.trips) ? data.trips : [];

  if (isLoading)
    return <div className="p-6 text-gray-500">Loading cheap trips...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading trips</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Cheap Trips ✈️</h1>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl shadow space-y-4">
        {/* Origin */}
        <div>
          <label className="font-medium text-base-content">
            Vertrek luchthaven
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border border-border rounded p-2 ml-2 bg-input text-base-content"
          >
            <option value="CRL">Charleroi (CRL)</option>
            <option value="BRU">Brussel (BRU)</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="font-medium text-base-content">Vanaf datum</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="border border-border rounded p-2 ml-2 bg-input text-base-content"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="font-medium text-base-content">Aantal dagen</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-border rounded p-2 ml-2 bg-input text-base-content"
          >
            <option value={1}>1 dag</option>
            <option value={2}>2 dagen</option>
            <option value={3}>3 dagen</option>
          </select>
        </div>

        {/* Max Price Slider */}
        <div>
          <label className="font-medium text-base-content">
            Max prijs: €{maxPrice}
          </label>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="p-6 text-gray-500">No trips found</div>
        ) : (
          trips.map((trip, i) => (
            <div
              key={i}
              className="p-6 border border-border rounded-2xl shadow hover:shadow-lg transition bg-card text-base-content"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {trip.destination}, {trip.country}
                  </h2>
                  {trip.weekend && (
                    <span className="text-sm text-accent font-medium">
                      🌞 Weekend Trip
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold text-primary">
                  €{trip.price}
                </div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">
                Outbound:{" "}
                {format(new Date(trip.outbound), "yyyy-MM-dd (EEEE) HH:mm")}
                <br />
                Inbound:{" "}
                {format(new Date(trip.inbound), "yyyy-MM-dd (EEEE) HH:mm")}
              </div>
            </div>
          ))
        )}
        {/* {data.map((trip: Trip, i: number) => (
          <div
            key={i}
            className="p-6 border border-border rounded-2xl shadow hover:shadow-lg transition bg-card text-base-content"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{trip.destination}, {trip.country}</h2>
                {trip.weekend && (
                  <span className="text-sm text-accent font-medium">
                    🌞 Weekend Trip
                  </span>
                )}
              </div>

              <div className="text-2xl font-bold text-primary">€{trip.price}</div>
            </div>

            <div className="mt-3 text-sm text-muted-foreground">
              Outbound: {format(new Date(trip.outbound), "yyyy-MM-dd (EEEE) HH:mm")}
              <br />
              Inbound: {format(new Date(trip.inbound), "yyyy-MM-dd (EEEE) HH:mm")}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
