import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLatestSession } from "~/models/sessions.server";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";

export const meta: MetaFunction = () => [
  { title: "Chocolate Chip Rookies Video Library" },
];

export const loader = async () => {
  const latestSession = await getLatestSession();
  return json({ latestSession });
};

export default function Index() {
  const { latestSession } = useLoaderData<typeof loader>()

  if (!latestSession) {
    return null
  }

  return (
    <>
      <h1>Latest session - {format(new Date(latestSession.date), 'do MMMM')}</h1>
      <div className="flex flex-wrap justify-center">
        {latestSession.flights.map((flight, idx) => (
          <FlightCard
            key={idx}
            flight={flight}
            session={latestSession}
            showDate={false}
          />
        ))}
      </div>
    </>
  );
}
