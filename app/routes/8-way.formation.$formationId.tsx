import { useCallback } from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import invariant from 'tiny-invariant';
import FlightCard from '~/components/flight-card';
import FormationImage from '~/components/formations/formation-images';
import { ViewSwitcher } from '~/components/view-switcher';
import {
    EIGHT_WAY_BLOCKS,
    EIGHT_WAY_FORMATIONS,
    EIGHT_WAY_RANDOMS,
    getDisplayName,
} from '~/data/formations';
import { useSwipe } from '~/hooks/useSwipe';
import { getByFormationId } from '~/models/flights.server';
import { isLocalRequest } from '~/utils/localGuardUtils';
import { getSiteType } from '~/utils/site-utils';
import type { Route } from './+types/formation.$formationId';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    invariant(params.formationId, 'formation not found');
    const isLocal = isLocalRequest(request);
    const formation = EIGHT_WAY_FORMATIONS[params.formationId];
    const siteType = getSiteType(request);
    const flights = await getByFormationId(params.formationId, siteType);

    return { flights, formation, isLocal };
};

const orderedFormations = [...EIGHT_WAY_RANDOMS, ...EIGHT_WAY_BLOCKS];

export default function EightWayFormation() {
    const { flights, formation, isLocal } = useLoaderData<typeof loader>();
    const [searchParams] = useSearchParams();
    const activeView = searchParams.get('view') || 'diagram';
    const navigate = useNavigate();

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
        if (nextFormation) navigate(`/8-way/formation/${nextFormation.id}`);
    }, [nextFormation, navigate]);

    const onSwipeRight = useCallback(() => {
        if (prevFormation) navigate(`/8-way/formation/${prevFormation.id}`);
    }, [prevFormation, navigate]);

    const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight);

    return (
        <div
            className={`relative`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="flex gap-4 items-center justify-between">
                <h1 className="text-2xl">
                    {formation.id} - {getDisplayName(formation)}
                </h1>
            </div>
            <ViewSwitcher
                views={[
                    { view: 'diagram', name: 'Diagram' },
                    { view: 'videos', name: 'Videos' },
                ]}
                activeView={activeView}
            />
            {activeView === 'diagram' ? (
                <FormationImage
                    formation={formation}
                    className="max-h-screen mx-auto mt-8 pb-50"
                    showTooltip={true}
                />
            ) : (
                <div className="flex flex-wrap justify-center">
                    {flights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            session={flight.session}
                            showDate={true}
                            isLocal={isLocal}
                            allowSelection={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
