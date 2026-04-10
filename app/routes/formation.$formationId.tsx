import { type ChangeEvent, useCallback, useState } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import invariant from 'tiny-invariant';
import FlightCard from '~/components/flight-card';
import { ViewSwitcher } from '~/components/view-switcher';
import {
    A_BLOCKS,
    AA_BLOCKS,
    FORMATIONS,
    getDisplayName,
    RANDOMS,
} from '~/data/formations';
import { useSwipe } from '~/hooks/useSwipe';
import { getByFormationId } from '~/models/flights.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { getFormationImageUrl } from '~/utils/utils';
import type { Route } from './+types/formation.$formationId';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    invariant(params.formationId, 'formation not found');
    const isLocal = isLocalRequest(request);
    const formation = FORMATIONS[params.formationId];
    const flights = await getByFormationId(params.formationId);
    if (!flights) {
        throw new Response('Not Found', { status: 404 });
    }

    return { flights, formation, isLocal };
};

const orderedFormations = [...RANDOMS, ...A_BLOCKS, ...AA_BLOCKS];

export default function SessionDetailsPage() {
    const { flights, formation, isLocal } = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const activeView = searchParams.get('view') || 'diagram';
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const onSelect = (
        event: ChangeEvent<HTMLInputElement>,
        flightId: string,
    ) => {
        if (event.currentTarget.checked) {
            setSelectedCards((prevState) => [...prevState, flightId]);
        } else {
            setSelectedCards((prevState) =>
                prevState.filter((id) => id !== flightId),
            );
        }
    };
    const navigate = useNavigate();

    const compare = () => {
        navigate(
            `/flights/compare?flight1Id=${selectedCards[0]}&flight2Id=${selectedCards[1]}`,
        );
    };

    const currentIndex = orderedFormations.findIndex(
        (f) => f.id === formation.id,
    );
    const prevFormation =
        currentIndex > 0 ? orderedFormations[currentIndex - 1] : null;
    const nextFormation =
        currentIndex < orderedFormations.length - 1
            ? orderedFormations[currentIndex + 1]
            : null;

    const onSwipeLeft = useCallback(() => {
        if (nextFormation) navigate(`/formation/${nextFormation.id}`);
    }, [nextFormation, navigate]);

    const onSwipeRight = useCallback(() => {
        if (prevFormation) navigate(`/formation/${prevFormation.id}`);
    }, [prevFormation, navigate]);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight);

    return (
        <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <h1 className="text-2xl">
                {formation.id} - {getDisplayName(formation)}
            </h1>
            <ViewSwitcher
                views={[
                    { view: 'diagram', name: 'Diagram' },
                    { view: 'videos', name: 'Videos' },
                ]}
                activeView={activeView}
            />
            {activeView === 'diagram' ? (
                <div>
                    <img
                        src={getFormationImageUrl(formation)}
                        alt={`${formation.id}`}
                        className="h-fit max-h-[80vh] mx-auto mt-2"
                    />
                </div>
            ) : (
                <div className="flex flex-wrap justify-center">
                    {flights.map((flight) => (
                        <FlightCard
                            key={flight.id}
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
            )}
            {selectedCards.length > 1 ? (
                <div className="sticky bottom-0 flex justify-center bg-gray-500/75 -mx-4">
                    <button className="btn m-4" onClick={compare} type="button">
                        Compare
                    </button>
                </div>
            ) : null}
        </div>
    );
}
