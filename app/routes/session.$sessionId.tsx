import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession } from "~/models/sessions.server";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import FlightCard from "~/components/flight-card";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.sessionId, "session not found");

  const session = await getSession(params.sessionId);
  if (!session) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ session });
};

export default function SessionDetailsPage() {
  const { session } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'TOP'

  return (
    <div>
      <h1 className="text-2xl text-black">
        {format(new Date(session.date), "do MMMM")}
      </h1>
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <a role="tab" className={`tab ${activeView === 'top' ? 'tab-active' : ''}`} href="?view=TOP">Top Down</a>
        <a role="tab" className={`tab ${activeView === 'side' ? 'tab-active' : ''}`} href="?view=SIDE">Side View</a>
      </div>
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
