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
    queryKey: ["cheapTrips", origin, days, fromDate, toDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        origin,
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-yellow-100">
      <div
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.9)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-10 space-y-6">
          <section className="rounded-3xl bg-white/80 backdrop-blur shadow-xl p-5 sm:p-8 border border-white/60">
            <p className="text-sm font-semibold text-orange-500">
              Goedkope tripjes vanaf België
            </p>

            <h1 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Cheap Trips ✈️
            </h1>

            <p className="mt-3 text-slate-600 max-w-2xl">
              Vind snel zonnige citytrips en weekenddeals binnen je budget.
            </p>
          </section>

          <section className="sticky top-3 z-10 bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-white/70 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Vertrek
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900"
                >
                  <option value="CRL">Charleroi</option>
                  <option value="BRU">Brussel</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Vanaf
                </label>
                <input
                  type="date"
                  value={fromDate}
                  min={today}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    if (toDate && e.target.value > toDate) setToDate("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Tot
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">
                  Dagen
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900"
                >
                  <option value={1}>1 dag</option>
                  <option value={2}>2 dagen</option>
                  <option value={3}>3 dagen</option>
                </select>
              </div>
            </div>
          </section>

          {isLoading && (
            <div className="rounded-2xl bg-white/80 p-6 text-slate-500 shadow">
              Trips zoeken...
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-red-50 p-6 text-red-600 shadow">
              Er ging iets mis bij het laden.
            </div>
          )}

          {!isLoading && !error && (
            <section className="space-y-3 pb-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {trips.length} deals gevonden
                </h2>
              </div>

              {trips.length === 0 ? (
                <div className="rounded-2xl bg-white/85 p-6 text-slate-500 shadow">
                  Geen trips gevonden. Probeer een hogere max prijs of ruimere
                  datums.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trips.map((trip, i) => (
                    <article
                      key={i}
                      className="rounded-3xl bg-white/90 backdrop-blur border border-white/70 shadow-md hover:shadow-xl transition overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {trip.destination}, {trip.country}
                            </h3>

                            {trip.weekend && (
                              <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                🌞 Weekend trip
                              </span>
                            )}
                          </div>

                          <div className="shrink-0 rounded-2xl bg-orange-500 px-4 py-2 text-xl font-black text-white shadow">
                            €{trip.price}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-semibold text-slate-500">Heen</p>
                            <p className="font-bold text-slate-800">
                              {format(
                                new Date(trip.outbound),
                                "yyyy-MM-dd HH:mm",
                              )}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="font-semibold text-slate-500">
                              Terug
                            </p>
                            <p className="font-bold text-slate-800">
                              {format(
                                new Date(trip.inbound),
                                "yyyy-MM-dd HH:mm",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
