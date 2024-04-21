import type { LoaderFunctionArgs } from "@remix-run/router";
import { isLocalRequest } from "~/utils/localGuardUtils";
import { json } from "@remix-run/node";
import { getFlight } from "~/models/flights.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import FlightCard from "~/components/flight-card";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.flightId, "flight not found");
  const isLocal = isLocalRequest(request)
  const flight = await getFlight(params.flightId);
  return json({ flight, isLocal });
};

export default function EditFlight() {
  const { flight, isLocal } = useLoaderData<typeof loader>();

  return (
    <FlightCard flight={flight!} session={flight!.session} showDate={true} isLocal={isLocal} />
  );
}
