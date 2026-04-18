import type { MouseEvent, TouchEvent } from 'react';
import { useCallback, useRef } from 'react';

interface SwipeHandlers {
    onTouchStart: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
}

export function useSwipe(
    onSwipeLeft: () => void,
    onSwipeRight: () => void,
    minSwipeDistance = 50,
): SwipeHandlers {
    const touchStartX = useRef<number | null>(null);

    const triggerSwipe = useCallback(
        (clientX: number) => {
            if (touchStartX.current === null) return;
            const deltaX = clientX - touchStartX.current;
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

    const onTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    }, []);

    const onTouchEnd = (e: TouchEvent) => {
        triggerSwipe(e.changedTouches[0].clientX);
    };

    const onMouseDown = useCallback((e: MouseEvent) => {
        touchStartX.current = e.clientX;
    }, []);

    const onMouseUp = (e: MouseEvent) => {
        triggerSwipe(e.clientX);
    };

    return { onTouchStart, onTouchEnd, onMouseDown, onMouseUp };
}
