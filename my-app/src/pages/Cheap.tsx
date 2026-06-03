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
  const today = new Date().toISOString().split("T")[0];

  const [origin, setOrigin] = useState("CRL");
  const [maxPrice, setMaxPrice] = useState(120);
  const [days, setDays] = useState(2);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cheapTrips", origin, maxPrice, days, fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        origin,
        maxPrice: String(maxPrice),
        days: String(days),
        from: fromDate,
      });

      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/cheap?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const trips: Trip[] = Array.isArray(data?.trips) ? data.trips : [];

  if (isLoading)
    return (
      <div className="p-4 sm:p-6 text-gray-500">Loading cheap trips...</div>
    );

  if (error)
    return <div className="p-4 sm:p-6 text-red-500">Error loading trips</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary">
        Cheap Trips ✈️
      </h1>

      <div className="bg-card p-4 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium text-base-content">
            Vertrek luchthaven
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border border-border rounded p-2 bg-input text-base-content w-full"
          >
            <option value="CRL">Charleroi (CRL)</option>
            <option value="BRU">Brussel (BRU)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-base-content">Vanaf datum</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (toDate && e.target.value > toDate) {
                setToDate("");
              }
            }}
            min={today}
            className="border border-border rounded p-2 bg-input text-base-content w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-base-content">Tot datum</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
            className="border border-border rounded p-2 bg-input text-base-content w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-base-content">Aantal dagen</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-border rounded p-2 bg-input text-base-content w-full"
          >
            <option value={1}>1 dag</option>
            <option value={2}>2 dagen</option>
            <option value={3}>3 dagen</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-4">
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

      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="p-4 sm:p-6 text-gray-500">No trips found</div>
        ) : (
          trips.map((trip, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 border border-border rounded-2xl shadow hover:shadow-lg transition bg-card text-base-content"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
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

              <div className="mt-3 text-sm text-muted-foreground leading-6">
                Outbound:{" "}
                {format(new Date(trip.outbound), "yyyy-MM-dd (EEEE) HH:mm")}
                <br />
                Inbound:{" "}
                {format(new Date(trip.inbound), "yyyy-MM-dd (EEEE) HH:mm")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
