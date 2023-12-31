import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getFormation } from "~/models/formations.server";
import { getByFormationLetter } from "~/models/flights.server";
import { getFormationImageUrl } from "~/utils";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.formationLetter, "formation not found");

  const flights = await getByFormationLetter(params.formationLetter);
  const formation = await getFormation(params.formationLetter);
  if (!flights || !formation) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ flights, formation });
};

export default function SessionDetailsPage() {
  const { flights, formation } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl">
        {formation.letter} - {formation.name}
      </h1>
      <div className="flex flex-wrap justify-center">
        <div className="card card-compact m-4">
          <figure>
            <img src={getFormationImageUrl(formation)}
                 alt={`${formation.name}`}
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
