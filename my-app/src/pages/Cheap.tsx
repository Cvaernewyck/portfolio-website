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

  const { data, isLoading, error } = useQuery({
    queryKey: ["cheapTrips", origin, maxPrice, days],
    queryFn: async () => {
      const res = await fetch(
        `/api/cheap?origin=${origin}&maxPrice=${maxPrice}&days=${days}`,
      );
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6">Loading cheap trips...</div>;
  if (error) return <div className="p-6">Error loading trips</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Cheap Trips ✈️</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        {/* Origin */}
        <div>
          <label className="font-medium">Vertrek luchthaven</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border rounded p-2 ml-2"
          >
            <option value="CRL">Charleroi (CRL)</option>
            <option value="BRU">Brussel (BRU)</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="font-medium">Aantal dagen</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border rounded p-2 ml-2"
          >
            <option value={1}>1 dag</option>
            <option value={2}>2 dagen</option>
            <option value={3}>3 dagen</option>
          </select>
        </div>

        {/* Max Price Slider */}
        <div>
          <label className="font-medium">Max prijs: €{maxPrice}</label>
          <input
            type="range"
            min="20"
            max="300"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {data.map((trip: Trip, i: number) => (
        <div
          key={i}
          className="p-6 border rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {trip.destination}, {trip.country}
              </h2>
              {trip.weekend && (
                <span className="text-sm text-green-600 font-medium">
                  🌞 Weekend Trip
                </span>
              )}
            </div>

            <div className="text-2xl font-bold">€{trip.price}</div>
          </div>

          <div className="mt-3 text-gray-600 text-sm">
            Outbound:{" "}
            {format(new Date(trip.outbound), "yyyy-MM-dd (EEEE) HH:mm")}
            <br />
            Inbound: {format(new Date(trip.inbound), "yyyy-MM-dd (EEEE) HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
}
