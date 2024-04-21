import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession } from "~/models/sessions.server";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";
import { ViewSwitcher } from "~/components/view-switcher";
import { isLocalRequest } from "~/utils/localGuardUtils";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.sessionId, "session not found");
  const isLocal = isLocalRequest(request)

  const session = await getSession(params.sessionId);
  if (!session) {
    throw new Response("Not Found", { status: 404 });
  }
  const hasTopView = session.flights.some(flight => flight.view === 'TOP')
  const hasSideView = session.flights.some(flight => flight.view === 'SIDE')

  return json({ session, hasTopView, hasSideView, isLocal });
};

export default function SessionDetailsPage() {
  const { session, hasTopView, hasSideView, isLocal } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'TOP'

  return (
    <div>
      <h1 className="text-2xl text-black">
        {format(new Date(session.date), "do MMMM")}
      </h1>
      <ViewSwitcher hasTopView={hasTopView} hasSideView={hasSideView} activeView={activeView} />
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
