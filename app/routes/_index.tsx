import type { MetaFunction } from "react-router";
import { getLatestSession } from "~/models/sessions.server";
import { Link, useLoaderData } from "react-router";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { generateRandomDive } from "~/data/formations";
import type { Route } from './+types/_index'

export const meta: MetaFunction = () => [
  { title: "Chocolate Chip Cookies Video Library" },
];

export const loader = async ({request}: Route.LoaderArgs) => {
  const latestSession = await getLatestSession();
  const isLocal = isLocalRequest(request)
  const seed = parseInt(format(new Date(), 'yyyyMMdd'));
  const diveOfTheDay = generateRandomDive(seed)
  return { latestSession, isLocal, diveOfTheDay };
};

export default function Index() {
  const { latestSession, isLocal, diveOfTheDay } = useLoaderData<typeof loader>()

  if (!latestSession) {
    return null
  }

  const diveLinks = diveOfTheDay.map((formation, idx) =>
    <Link key={idx} to={`/formation/${formation}`} className="pr-2 underline">{formation}</Link>)

  return (
    <>
      <div className="text-black text-3xl mb-3">Dive of the day - {diveLinks}</div>
      <h2 className="text-black text-3xl">Latest session - {format(new Date(latestSession.date), 'do MMMM')}</h2>
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
