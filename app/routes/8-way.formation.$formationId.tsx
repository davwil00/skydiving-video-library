import { useCallback, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import invariant from 'tiny-invariant';
import FormationImage from '~/components/formations/formation-images';
import {
    EIGHT_WAY_BLOCKS,
    EIGHT_WAY_FORMATIONS,
    EIGHT_WAY_RANDOMS,
    getDisplayName,
} from '~/data/formations';
import { useSwipe } from '~/hooks/useSwipe';
import { isLocalRequest } from '~/utils/localGuardUtils';
import type { Route } from './+types/formation.$formationId';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
    invariant(params.formationId, 'formation not found');
    const isLocal = isLocalRequest(request);
    const formation = EIGHT_WAY_FORMATIONS[params.formationId];

    return { formation, isLocal };
};

const orderedFormations = [...EIGHT_WAY_RANDOMS, ...EIGHT_WAY_BLOCKS];

export default function EightWayFormation() {
    const { formation } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [altColours, setAltColours] = useState<boolean>(false);

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
            className={`relative ${altColours ? 'alt' : ''}`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="flex gap-4 items-center justify-between">
                <h1 className="text-2xl">
                    {formation.id} - {getDisplayName(formation)}
                </h1>
                <button
                    type="button"
                    className="btn btn-neutral"
                    onClick={() => setAltColours((prev) => !prev)}
                >
                    Toggle colours
                </button>
            </div>
            <FormationImage
                formation={formation}
                className="max-h-[100vh] mx-auto mt-8 pb-50"
            />
        </div>
    );
}
