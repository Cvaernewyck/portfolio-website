import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { nl } from "date-fns/locale";

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
  const [days, setDays] = useState(2);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section
        className="relative bg-cover bg-center px-4 py-10 sm:px-6 lg:px-10 lg:py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.25), rgba(255,255,255,.75)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="font-semibold text-blue-700">
              Goedkope trips vanaf België
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
              Vind je volgende zonnige deal ✈️
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Kies je luchthaven, datum en duur. Wij zoeken de goedkoopste
              Ryanair trips.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/95 p-4 shadow-2xl ring-1 ring-slate-200 backdrop-blur sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto] xl:items-end">
              <Field label="Vertrek" icon="✈️">
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent text-lg font-semibold outline-none"
                >
                  <option value="CRL">Charleroi</option>
                  <option value="BRU">Brussel</option>
                </select>
              </Field>

              <Field label="Vanaf" icon="📅">
                <input
                  type="date"
                  value={fromDate}
                  min={today}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    if (toDate && e.target.value > toDate) setToDate("");
                  }}
                  className="w-full bg-transparent text-lg font-semibold outline-none"
                />
              </Field>

              <Field label="Tot" icon="📅">
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-transparent text-lg font-semibold outline-none"
                />
              </Field>

              <Field label="Dagen" icon="🕒">
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-transparent text-lg font-semibold outline-none"
                >
                  <option value={1}>1 dag</option>
                  <option value={2}>2 dagen</option>
                  <option value={3}>3 dagen</option>
                </select>
              </Field>

              <button
                onClick={() => refetch()}
                className="h-[76px] rounded-2xl bg-blue-600 px-8 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.98]"
              >
                {isFetching ? "Zoeken..." : "Zoek trips"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Goedkope trips gevonden
            </h2>
            <p className="mt-1 text-slate-500">{trips.length} resultaten</p>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-3xl bg-white p-8 shadow text-slate-500">
            Trips zoeken...
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-red-50 p-8 shadow text-red-600">
            Er ging iets mis bij het laden.
          </div>
        )}

        {!isLoading && !error && trips.length === 0 && (
          <div className="rounded-3xl bg-white p-8 shadow text-slate-500">
            Geen trips gevonden. Probeer andere datums of meer dagen.
          </div>
        )}

        <div className="space-y-5">
          {trips.map((trip, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_auto]">
                <div className="h-48 bg-gradient-to-br from-sky-200 to-orange-200 md:h-full">
                  <div className="flex h-full items-center justify-center text-6xl">
                    🏖️
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  {trip.weekend && (
                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                      ☀️ Weekend trip
                    </span>
                  )}

                  <h3 className="mt-3 text-2xl font-black">
                    {trip.destination}, {trip.country}
                  </h3>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Info label="Vertrekt" icon="🛫">
                      {format(new Date(trip.outbound), "EEE dd MMM • HH:mm", {
                        locale: nl,
                      })}
                    </Info>

                    <Info label="Terug" icon="🛬">
                      {format(new Date(trip.inbound), "EEE dd MMM • HH:mm", {
                        locale: nl,
                      })}
                    </Info>

                    <Info label="Duur" icon="📅">
                      {days} {days === 1 ? "dag" : "dagen"}
                    </Info>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t p-5 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:p-7">
                  <span className="text-sm text-slate-500">vanaf</span>
                  <strong className="text-3xl font-black">€{trip.price}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <div className="flex h-[76px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}

function Info({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-500">
        {icon} {label}
      </p>
      <p className="mt-1 font-bold text-slate-900">{children}</p>
    </div>
  );
}
