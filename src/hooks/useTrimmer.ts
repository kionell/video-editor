import { Ref, useEffect } from 'react';
import Sister, { SisterEventListener } from 'sister';
import { createPositionTracker, IPositionTrackerState } from '../core/Utils/Position';
import { selectCurrentZoom } from '../store/Selectors';
import { clamp } from '../core/Utils/Math';
import { unitsToTimeMs } from '../core/Utils/Timeline';
import { useAppSelector } from './useAppSelector';

type TrimmableEventType = 'start-trim' | 'end-trim';

export interface TrimmableState {
  type: TrimmableEventType;
  target: HTMLElement;
  startTrimMs: number;
  endTrimMs: number;
}

export type TrimmableCallback = (state: TrimmableState) => void;

export interface TrimmableProps {
  startTrimCallback?: TrimmableCallback;
  endTrimCallback?: TrimmableCallback;
}

export function useTrimmer(ref: Ref<HTMLElement>, props?: TrimmableProps): void {
  const currentZoom = useAppSelector(selectCurrentZoom);

  const makeTrimmable = (element: HTMLElement, props?: TrimmableProps) => {
    const emitter = new Sister();
    const tracker = createPositionTracker();

    const initialStyle = window.getComputedStyle(element);
    const initialWidth = parseFloat(initialStyle.width);

    let targetElement: HTMLElement;
    let position: IPositionTrackerState;
    let startingWidth: number;
    let startingLeft: number;

    let startTrimMs = 0;
    let endTrimMs = 0;

    let isLeftTrimmer = false;
    let isRightTrimmer = false;

    const startTrimming = (event: MouseEvent) => {
      targetElement = event.target as HTMLElement;

      isLeftTrimmer = targetElement.className.includes('trimmer-left');
      isRightTrimmer = targetElement.className.includes('trimmer-right');

      if (!isLeftTrimmer && !isRightTrimmer) return;

      event.preventDefault();
      event.stopPropagation();

      const startingStyle = window.getComputedStyle(element);

      startingLeft = parseFloat(startingStyle.left);
      startingWidth = parseFloat(startingStyle.width);
      position = tracker.start(event);

      document.addEventListener('mousemove', trimElement);
      document.addEventListener('mouseup', stopTrimming);
    };

    const trimElement = (event: MouseEvent) => {
      position = tracker.update(event);

      if (isLeftTrimmer) {
        const currentLeft = startingLeft + position.relativeX;
        const currentWidth = startingWidth - position.relativeX;

        const clampedWidth = clamp(currentWidth, 0, initialWidth);
        const clampedLeft = currentLeft - (currentWidth - initialWidth);

        element.style.left = clampedLeft + 'px';
        element.style.width = clampedWidth + 'px';

        const trimUnits = Math.max(0, initialWidth - currentWidth);

        startTrimMs = unitsToTimeMs(trimUnits, currentZoom.zoom);

        emitter.trigger<TrimmableEventType, TrimmableState>('start-trim', {
          type: 'start-trim',
          target: element,
          startTrimMs,
          endTrimMs,
        });
      }

      if (isRightTrimmer) {
        const currentWidth = startingWidth + position.relativeX;
        const clampedWidth = clamp(currentWidth, 0, initialWidth);

        element.style.width = clampedWidth + 'px';

        const trimUnits = initialWidth - clampedWidth;

        endTrimMs = unitsToTimeMs(trimUnits, currentZoom.zoom);

        emitter.trigger<TrimmableEventType, TrimmableState>('end-trim', {
          type: 'end-trim',
          target: element,
          startTrimMs,
          endTrimMs,
        });
      }
    };

    const stopTrimming = (event: MouseEvent) => {
      position = tracker.update(event);

      document.removeEventListener('mousemove', trimElement);
      document.removeEventListener('mouseup', stopTrimming);

      isLeftTrimmer = false;
      isRightTrimmer = false;
    };

    element.addEventListener('mousedown', startTrimming);

    let startTrimCallbackListener: SisterEventListener | null = null;
    let endTrimCallbackListener: SisterEventListener | null = null;

    if (props?.startTrimCallback) {
      startTrimCallbackListener = emitter.on('start-trim', props.startTrimCallback);
    }

    if (props?.endTrimCallback) {
      endTrimCallbackListener = emitter.on('end-trim', props.endTrimCallback);
    }

    // Callback for removing event listener when component is unmounted.
    return () => {
      element.removeEventListener('mousedown', startTrimming);

      if (startTrimCallbackListener) {
        emitter.off(startTrimCallbackListener);
      }

      if (endTrimCallbackListener) {
        emitter.off(endTrimCallbackListener);
      }
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeTrimmable(ref.current, props);
  }, []);
}
