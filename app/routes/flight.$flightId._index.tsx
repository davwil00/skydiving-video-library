import { isLocalRequest } from "~/utils/localGuardUtils";
import { getFlight } from "~/models/flights.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "react-router";
import FlightCard from "~/components/flight-card";
import type { Route } from './+types/flight.$flightId._index'

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  invariant(params.flightId, "flight not found");
  const isLocal = isLocalRequest(request)
  const flight = await getFlight(params.flightId);
  return { flight, isLocal };
};

export default function EditFlight() {
  const { flight, isLocal } = useLoaderData<typeof loader>();

  return (
    <FlightCard flight={flight!} session={flight!.session} showDate={true} isLocal={isLocal} />
  );
}
