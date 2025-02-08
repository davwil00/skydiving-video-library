import invariant from "tiny-invariant";
import { getSession } from "~/models/sessions.server";
import { useLoaderData, useSearchParams } from "react-router";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";
import { ViewSwitcher } from "~/components/view-switcher";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { capitalise } from "~/utils/utils";
import type { Route } from './+types/session.$sessionId';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  invariant(params.sessionId, "session not found");
  const isLocal = isLocalRequest(request)

  const session = await getSession(params.sessionId);
  if (!session) {
    throw new Response("Not Found", { status: 404 });
  }
  const views = ["TOP", "SIDE"].flatMap(view =>
    session.flights.some(flight => flight.view === view) ? { view: view, name: `${capitalise(view)} View` } : []);

  return { session, views, isLocal };
};

export default function SessionDetailsPage() {
  const { session, views, isLocal } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'TOP'

  return (
    <div>
      <h1 className="text-2xl text-black">
        {session.name ?? format(new Date(session.date), "do MMMM")}
      </h1>
      <ViewSwitcher views={views} activeView={activeView} />
      <div className="flex flex-wrap justify-center">
        {session.flights
          .filter(session => session.view === activeView)
          .map((flight, idx) => (
          <FlightCard
            key={idx}
            flight={flight}
            session={session}
            showDate={false}
            isLocal={isLocal}
          />
        ))}
      </div>
    </div>
  );
}
