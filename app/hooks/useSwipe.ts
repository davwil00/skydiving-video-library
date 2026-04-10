import type { TouchEvent } from 'react';
import { useCallback, useRef } from 'react';

interface SwipeHandlers {
    onTouchStart: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
}

export function useSwipe(
    onSwipeLeft: () => void,
    onSwipeRight: () => void,
    minSwipeDistance = 50,
): SwipeHandlers {
    const touchStartX = useRef<number | null>(null);

    const onTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (touchStartX.current === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(deltaX) >= minSwipeDistance) {
                if (deltaX < 0) {
                    onSwipeLeft();
                } else {
                    onSwipeRight();
                }
            }
            touchStartX.current = null;
        },
        [onSwipeLeft, onSwipeRight, minSwipeDistance],
    );

    return { onTouchStart, onTouchEnd };
}
