import { useCallback, useState } from 'react';
import { redirect, useLoaderData } from 'react-router';
import FormationImage from '~/components/formations/formation-images';
import {
    EIGHT_WAY_FORMATIONS,
    type Formation,
    getDisplayName,
} from '~/data/formations';
import { useSwipe } from '~/hooks/useSwipe';
import type { Route } from '../../.react-router/types/app/routes/+types/formation.$formationId';

export const loader = async ({ request }: Route.LoaderArgs) => {
    const url = new URL(request.url);
    const diveParam = url.searchParams.get('dive');

    if (!diveParam) {
        return redirect('/8-way/dive-builder');
    }
    const formations = diveParam
        ? diveParam
              .split(',')
              .map((id) => EIGHT_WAY_FORMATIONS[id.toUpperCase()])
        : [];

    return { formations };
};

export default function EightWayDive() {
    const { formations } = useLoaderData<typeof loader>();
    const [currentFormation, setCurrentFormation] = useState<
        Formation | undefined
    >(undefined);

    const onSwipeLeft = useCallback(() => {
        setCurrentFormation((prev) => {
            if (!prev) {
                return formations[0];
            }
            const nextIdx = formations.indexOf(prev) + 1;
            if (nextIdx >= formations.length) {
                return undefined;
            }
            return formations[nextIdx];
        });
    }, [formations]);

    const onSwipeRight = useCallback(() => {
        setCurrentFormation((prev) => {
            if (!prev) {
                return formations.at(-1);
            }
            const nextIdx = formations.indexOf(prev) - 1;
            if (nextIdx < 0) {
                return undefined;
            }
            return formations[nextIdx];
        });
    }, [formations]);

    const { onTouchStart, onTouchEnd, onMouseDown, onMouseUp } = useSwipe(
        onSwipeLeft,
        onSwipeRight,
    );

    return (
        <div
            className=""
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            <div className="mx-auto w-full">
                {!currentFormation ? (
                    <img
                        src="/images/8-way/starting-1.png"
                        alt="Starting Position 1"
                        className="h-fit max-h-[80vh] mx-auto mt-2 pointer-events-none"
                    />
                ) : (
                    <>
                        <h1 className="text-2xl">
                            {currentFormation.id} -{' '}
                            {getDisplayName(currentFormation)}
                        </h1>
                        <FormationImage
                            formation={currentFormation}
                            className="max-h-[80vh] mx-auto mt-8 pb-50"
                            showTooltip={true}
                        />
                    </>
                )}
                <p className="fixed bottom-0 p-4">
                    Swipe to scroll through the formations, click a person to
                    see the position
                </p>
            </div>
        </div>
    );
}
