import invariant from 'tiny-invariant';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import FlightCard from '~/components/flight-card';
import { getByFormationId } from '~/models/flights.server';
import { getFormationImageUrl } from '~/utils/utils';
import { FORMATIONS, getDisplayName } from '~/data/formations';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { ChangeEvent, useState } from 'react';
import type { Route } from './+types/formation.$formationId';
import { ViewSwitcher } from '~/components/view-switcher'

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  invariant(params.formationId, "formation not found");
  const isLocal = isLocalRequest(request);
  const formation = FORMATIONS[params.formationId];
  const flights = await getByFormationId(params.formationId);
  if (!flights) {
    throw new Response("Not Found", { status: 404 });
  }

  return { flights, formation, isLocal };
};

export default function SessionDetailsPage() {
  const { flights, formation, isLocal } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get("view") || "diagram";
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const onSelect = (event: ChangeEvent<HTMLInputElement>, flightId: string) => {
    if (event.currentTarget.checked) {
      setSelectedCards(prevState => [...prevState, flightId])
    } else {
      setSelectedCards(prevState => prevState.filter(id => id !== flightId));
    }
  }
  const navigate = useNavigate()

  const compare = () => {
    navigate(`/flights/compare?flight1Id=${selectedCards[0]}&flight2Id=${selectedCards[1]}`);
  }

  return (
    <div className="relative">
      <h1 className="text-2xl">
        {formation.id} - {getDisplayName(formation)}
      </h1>
      <ViewSwitcher views={[{ view: "diagram", name: "Diagram" }, { view: "videos", name: "Videos"}]} activeView={activeView} />
      {activeView === "diagram" ?
        <div>
          <img src={getFormationImageUrl(formation)}
               alt={`${formation.id}`}
               className="h-fit max-h-[80vh] mx-auto mt-2"
          />
        </div> :
        <div className="flex flex-wrap justify-center">
          {flights
            .map((flight, idx) => (
              <FlightCard
                key={idx}
                flight={flight}
                session={flight.session}
                showDate={true}
                isLocal={isLocal}
                allowSelection={true}
                onSelect={onSelect}
                isSelected={selectedCards.includes(flight.id)}
              />
            ))}
        </div>
      }
      {
        selectedCards.length > 1 ? (
          <div className="sticky bottom-0 flex justify-center bg-gray-500/75 -mx-4">
            <button className="btn m-4" onClick={compare}>Compare</button>
          </div>
        ): null
      }
    </div>
  );
}
