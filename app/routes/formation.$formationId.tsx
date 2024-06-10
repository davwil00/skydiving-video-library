import { json, type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import FlightCard from "~/components/flight-card";
import { getByFormationId } from "~/models/flights.server";
import { capitalise, getFormationImageUrl } from "~/utils/utils";
import { FORMATIONS, getDisplayName } from "~/data/formations";
import { ViewSwitcher } from "~/components/view-switcher";
import { isLocalRequest } from "~/utils/localGuardUtils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.formationId, "formation not found")
  const isLocal = isLocalRequest(request)
  const formation = FORMATIONS[params.formationId]
  const flights = await getByFormationId(params.formationId);
  const views = ["TOP", "SIDE"].flatMap(view =>
    flights.some(flight => flight.view === view) ? { view: view, name: `${capitalise(view)} View` } : []);
  if (!flights) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ flights, formation, views, isLocal });
};

export default function SessionDetailsPage() {
  const { flights, formation, views, isLocal } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get("view") || "TOP";

  return (
    <div>
      <h1 className="text-2xl">
        {formation.id} - {getDisplayName(formation)}
      </h1>
      <ViewSwitcher views={[{ view: "diagram", name: "Diagram" }, ...views]} activeView={activeView} />
      {activeView === "diagram" ?
        <div>
          <img src={getFormationImageUrl(formation)}
               alt={`${formation.id}`}
               className="h-fit max-h-[80vh] mx-auto mt-2"
          />
        </div> :
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
      }
    </div>
  );
}
