import { Ref, useEffect } from 'react';
import Sister, { SisterEventListener } from 'sister';
import { createPositionTracker, IPositionTrackerState } from '../core/Utils/Position';
import { useAppSelector } from './useAppSelector';
import { selectCurrentZoom } from '../store/Selectors';
import { clamp } from '../core/Utils/Math';

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
  const currentZoom = useAppSelect(selectCurrentZoom);
  
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

    element.style.position = 'absolute';

    const startTrimming = (event: MouseEvent) => {
      targetElement = event.target as HTMLElement;

      if (!targetElement.className.includes('trimmer-left')) return;
      if (!targetElement.className.includes('trimmer-right')) return;
      
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

      if (targetElement.classList.contains('trimmer-left')) {
        const currentLeft = startingLeft + position.relativeX;
        const currentWidth = startingWidth - position.relativeX;

        const clampedWidth = clamp(currentWidth, 0, initialWidth);
        const clampedLeft = currentLeft - Math.max(0, currentWidth - clampedWidth);
        
        element.style.left = startingLeft + position.relativeX + 'px';
        element.style.width = startingWidth - position.relativeX + 'px';

        const trimUnits = Math.max(0, clampedWidth - currentWidth);
        
        startTrimMs = unitsToTimeMs(trimUnits, currentZoom.zoom);

        emitter.trigger<TrimmableEventType, TrimmableState>('start-trim', {
          type: 'start-trim',
          target: element,
          startTrimMs,
          endTrimMs,
        });
      }

      if (targetElement.classList.contains('trimmer-right')) {
        const currentWidth = startingWidth + position.relativeX;
        const clampedWidth = clamp(currentWidth, 0, initialWidth);
        
        element.style.width = startingWidth + position.relativeX + 'px';
      
        const trimUnits = Math.max(0, clampedWidth - currentWidth);

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
