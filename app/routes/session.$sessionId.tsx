import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession } from "~/models/sessions.server";
import { useLoaderData } from "@remix-run/react";
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

  return (
    <div>
      <h1 className="text-2xl text-black">
        {format(new Date(session.date), "do MMMM")}
      </h1>
      <div className="flex flex-wrap justify-center">
        {session.flights.map((flight, idx) => (
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
