import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getByFormationId } from "~/models/flights.server";
import { getFormationImageUrl } from "~/utils";
import { FORMATIONS, getDisplayName } from "~/data/formations";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.formationId, "formation not found");
  const formation = FORMATIONS[params.formationId]
  const flights = await getByFormationId(params.formationId);
  if (!flights) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ flights, formation });
};

export default function SessionDetailsPage() {
  const { flights, formation } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl">
        {formation.id} - {getDisplayName(formation)}
      </h1>
      <div className="flex flex-wrap justify-center">
        <div className="card card-compact m-4">
          <figure>
            <img src={getFormationImageUrl(formation)}
                 alt={`${formation.id}`}
                 className="h-fit"
            />
          </figure>
        </div>
        {flights.map((flight, idx) => (
          <FlightCard
            key={idx}
            flight={flight}
            session={flight.session}
            showDate={true}
          />
        ))}
      </div>
    </div>
  );
}
