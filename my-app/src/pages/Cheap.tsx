import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["cheapTrips"],
    queryFn: async () => {
      const res = await fetch("/api/cheap");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6">Loading cheap trips...</div>;
  if (error) return <div className="p-6">Error loading trips</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Cheap Weekend Trips ✈️</h1>

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
