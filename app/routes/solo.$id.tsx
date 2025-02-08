import { getSoloSession } from "~/models/solo-sessions.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "react-router";
import { format } from "date-fns";
import type { Route } from './+types/solo.$id';

export const loader = async ({ params }: Route.LoaderArgs) => {
  invariant(params.id, "id not found");
  const session = await getSoloSession(params.id);
  if (!session) {
    throw new Response("Not Found", { status: 404 });
  }
  return session;
};

export default function SoloView() {
  const session = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Solo Session</h1>
      <p>Date: {format(session.date, 'dd-MM-yyyy')}</p>
      <p>Duration: {session.duration} minutes</p>
      <p>Notes: {session.notes}</p>
      <p>Skills: {session.skills}</p>

      <div className="flex flex-wrap gap-4">
        {session.flights.map((flight) => (
          <video key={flight.id} src={flight.videoUrl} controls muted className="w-1/3" />
        ))}
      </div>
    </div>


)
}
