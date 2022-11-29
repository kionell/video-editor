import { Ref, useEffect } from 'react';
import Sister, { SisterEventListener } from 'sister';
import { createPositionTracker, IPositionTrackerState } from '../core/Utils/Position';

type ResizableEventType = 'resize' | 'stop-resize';

export interface ResizableState {
  type: ResizableEventType;
  target: HTMLElement;
  position: IPositionTrackerState;
}

export type ResizableCallback = (state: ResizableState) => void;

export interface ResizableProps {
  resizeCallback?: ResizableCallback;
  stopResizeCallback?: ResizableCallback;
}

export function useAbsoluteResizable(ref: Ref<HTMLElement>, props?: ResizableProps): void {
  const makeResizable = (element: HTMLElement, props?: ResizableProps) => {
    const emitter = new Sister();
    const tracker = createPositionTracker();

    let targetElement: HTMLElement;
    let position: IPositionTrackerState;
    let initialStyle: CSSStyleDeclaration;
    let initialWidth: number;
    let initialHeight: number;
    let initialTop: number;
    let initialLeft: number;

    element.style.position = 'absolute';

    const startResizing = (event: MouseEvent) => {
      targetElement = event.target as HTMLElement;

      if (!targetElement.className.includes('resizer')) return;

      event.preventDefault();
      event.stopPropagation();

      position = tracker.start(event);
      initialStyle = window.getComputedStyle(element);
      initialWidth = parseFloat(initialStyle.width);
      initialHeight = parseFloat(initialStyle.height);
      initialTop = parseFloat(initialStyle.top);
      initialLeft = parseFloat(initialStyle.left);

      document.addEventListener('mousemove', resizeElement);
      document.addEventListener('mouseup', stopResizing);
    };

    const resizeElement = (event: MouseEvent) => {
      position = tracker.update(event);

      if (targetElement.classList.contains('resizer-left')) {
        element.style.left = initialLeft + position.relativeX + 'px';
        element.style.width = initialWidth - position.relativeX + 'px';
      }

      if (targetElement.classList.contains('resizer-top')) {
        element.style.top = initialTop + position.relativeY + 'px';
        element.style.height = initialHeight - position.relativeY + 'px';
      }

      if (targetElement.classList.contains('resizer-right')) {
        element.style.width = initialWidth + position.relativeX + 'px';
      }

      if (targetElement.classList.contains('resizer-bottom')) {
        element.style.height = initialHeight + position.relativeY + 'px';
      }

      emitter.trigger<ResizableEventType, ResizableState>('resize', {
        type: 'resize',
        target: element,
        position,
      });
    };

    const stopResizing = (event: MouseEvent) => {
      position = tracker.update(event);

      document.removeEventListener('mousemove', resizeElement);
      document.removeEventListener('mouseup', stopResizing);

      emitter.trigger<ResizableEventType, ResizableState>('stop-resize', {
        type: 'stop-resize',
        target: element,
        position,
      });
    };

    element.addEventListener('mousedown', startResizing);

    let resizeCallbackListener: SisterEventListener | null = null;
    let stopResizeCallbackListener: SisterEventListener | null = null;

    if (props?.resizeCallback) {
      resizeCallbackListener = emitter.on('resize', props.resizeCallback);
    }

    if (props?.stopResizeCallback) {
      stopResizeCallbackListener = emitter.on('stop-resize', props.stopResizeCallback);
    }

    // Callback for removing event listener when component is unmounted.
    return () => {
      element.removeEventListener('mousedown', startResizing);

      if (resizeCallbackListener) {
        emitter.off(resizeCallbackListener);
      }

      if (stopResizeCallbackListener) {
        emitter.off(stopResizeCallbackListener);
      }
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeResizable(ref.current, props);
  }, []);
}
