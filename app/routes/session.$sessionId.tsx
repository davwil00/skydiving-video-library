import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession } from "~/models/sessions.server";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.sessionId, "session not found");

  const session = await getSession(params.sessionId);
  const hasTopView = session?.flights.some(flight => flight.view === 'TOP')
  const hasSideView = session?.flights.some(flight => flight.view === 'SIDE')
  if (!session) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ session, hasTopView, hasSideView });
};

export default function SessionDetailsPage() {
  const { session, hasTopView, hasSideView } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'TOP'

  return (
    <div>
      <h1 className="text-2xl text-black">
        {format(new Date(session.date), "do MMMM")}
      </h1>
      {hasTopView && hasSideView ?
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          {hasTopView ? <a role="tab" className={`tab ${activeView === 'TOP' ? 'tab-active' : ''}`} href="?view=TOP">Top Down</a> : null}
          {hasSideView ? <a role="tab" className={`tab ${activeView === 'SIDE' ? 'tab-active' : ''}`} href="?view=SIDE">Side View</a> : null}
        </div>
        : null
      }
      <div className="flex flex-wrap justify-center">
        {session.flights
          .filter(session => session.view === activeView)
          .map((flight, idx) => (
          <FlightCard
            key={idx}
            flight={flight}
            session={session}
            showDate={false}
          />
        ))}
      </div>
    </div>
  );
}
