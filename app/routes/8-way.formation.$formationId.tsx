import type React from 'react';
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

const ROLE_TOOLTIPS: Record<string, string> = {
    P: 'Point',
    T: 'Tail',
    OF: 'Outside Front',
    IC: 'Inside Centre',
    OC: 'Outside Centre',
    IF: 'Inside Front',
    IR: 'Inside Rear',
    OR: 'Outside Rear',
};

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
    const [tooltip, setTooltip] = useState<string>();

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

    const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!(e.target instanceof SVGPathElement)) {
            setTooltip(undefined);
            return;
        }

        const className = e.target.getAttribute('class')?.trim();
        const role = className
            ?.split(/\s+/)
            .find((token) => token in ROLE_TOOLTIPS);

        setTooltip(role ? ROLE_TOOLTIPS[role] : undefined);
    };

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
            <div className="h-1">{tooltip}</div>
            <div onClick={(e) => showTooltip(e)}>
                <FormationImage
                    formation={formation}
                    className="max-h-[100vh] mx-auto mt-8 pb-50"
                />
            </div>
        </div>
    );
}
