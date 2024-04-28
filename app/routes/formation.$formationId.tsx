import { json, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getByFormationId } from "~/models/flights.server";
import { getFormationImageUrl } from "~/utils/utils";
import { FORMATIONS, getDisplayName } from "~/data/formations";
import { ViewSwitcher } from "~/components/view-switcher";
import { isLocalRequest } from "~/utils/localGuardUtils";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.formationId, "formation not found")
  const isLocal = isLocalRequest(request)
  const formation = FORMATIONS[params.formationId]
  const flights = await getByFormationId(params.formationId);
  const hasTopView = flights.some(flight => flight.view === 'TOP')
  const hasSideView = flights.some(flight => flight.view === 'SIDE')
  if (!flights) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ flights, formation, hasTopView, hasSideView, isLocal });
};

export default function SessionDetailsPage() {
  const { flights, formation, hasTopView, hasSideView, isLocal } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'TOP'

  return (
    <div>
      <h1 className="text-2xl">
        {formation.id} - {getDisplayName(formation)}
      </h1>
      <ViewSwitcher hasTopView={hasTopView} hasSideView={hasSideView} activeView={activeView} />
      <div className="flex">
            <img src={getFormationImageUrl(formation)}
                 alt={`${formation.id}`}
                 className="h-fit max-h-[80vh]"
            />
        <div className="flex flex-wrap justify-center">
          {flights
            .filter(flight => flight.view === activeView)
            .map((flight, idx) => (
            <FlightCard
              key={idx}
              flight={flight}
              session={flight.session}
              showDate={true}
              isLocal={isLocal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
