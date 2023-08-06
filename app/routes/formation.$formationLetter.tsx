import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getFormation } from "~/models/formations.server";
import { getByFormationLetter } from "~/models/flights.server";

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
