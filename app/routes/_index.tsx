import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from "@remix-run/node";
import { getLatestSession } from "~/models/sessions.server";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";
import { isLocalRequest } from "~/utils/localGuardUtils";

export const meta: MetaFunction = () => [
  { title: "Chocolate Chip Rookies Video Library" },
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const latestSession = await getLatestSession();
  const isLocal = isLocalRequest(request)
  return json({ latestSession, isLocal });
};

export default function Index() {
  const { latestSession, isLocal } = useLoaderData<typeof loader>()

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
            isLocal={isLocal}
          />
        ))}
      </div>
    </>
  );
}
