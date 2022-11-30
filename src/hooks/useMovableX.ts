import { useEffect, Ref } from 'react';
import Sister, { SisterEventListener } from 'sister';
import {
  createPositionTracker,
  IPositionTrackerState,
  PositionEvent,
} from '../core/Utils/Position';

type MovableXEventType = 'start' | 'move' | 'end';

export interface MovableXState {
  type: MovableXEventType;
  target: HTMLElement;
  position: IPositionTrackerState,
}

export type MovableXCallback = (state: MovableXState) => void;

export interface MovableXProps {
  startMoveCallback?: MovableXCallback;
  moveCallback?: MovableXCallback;
  stopMoveCallback?: MovableXCallback;
}

export function useMovableX(ref: Ref<HTMLElement>, props?: MovableXProps): void {
  const makeMovableX = (element: HTMLElement, props?: MovableXProps) => {
    const tracker = createPositionTracker();
    const emitter = new Sister();

    let position: IPositionTrackerState;
    let startOffsetX = 0;

    const startMoving = (event: PositionEvent) => {
      position = tracker.start(event);

      startOffsetX = element.offsetLeft - position.pageX;

      element.style.position = 'absolute';

      document.addEventListener('touchmove', moveElement);
      document.addEventListener('touchend', stopMoving);
      document.addEventListener('mousemove', moveElement);
      document.addEventListener('mouseup', stopMoving);

      emitter.trigger('startmove', {
        type: 'startmove',
        target: element,
        position,
      });
    };

    const moveElement = (event: PositionEvent) => {
      position = tracker.update(event);

      element.style.left = position.pageX + startOffsetX + 'px';

      emitter.trigger('move', {
        type: 'move',
        target: element,
        position,
      });
    };

    const stopMoving = () => {
      document.removeEventListener('touchmove', moveElement);
      document.removeEventListener('touchend', stopMoving);
      document.removeEventListener('mousemove', moveElement);
      document.removeEventListener('mouseup', stopMoving);

      emitter.trigger('stopmove', {
        type: 'stopmove',
        target: element,
        position,
      });
    };

    let startCallbackListener: SisterEventListener | null = null;
    let moveCallbackListener: SisterEventListener | null = null;
    let stopCallbackListener: SisterEventListener | null = null;

    if (props?.startMoveCallback) {
      startCallbackListener = emitter.on('start', props.startMoveCallback);
    }

    if (props?.moveCallback) {
      moveCallbackListener = emitter.on('move', props.moveCallback);
    }

    if (props?.stopMoveCallback) {
      stopCallbackListener = emitter.on('end', props.stopMoveCallback);
    }

    element.addEventListener('touchstart', startMoving);
    element.addEventListener('mousedown', startMoving);

    return () => {
      if (startCallbackListener) {
        emitter.off(startCallbackListener);
      }

      if (moveCallbackListener) {
        emitter.off(moveCallbackListener);
      }

      if (stopCallbackListener) {
        emitter.off(stopCallbackListener);
      }

      element.removeEventListener('touchstart', startMoving);
      element.removeEventListener('mousedown', startMoving);

      stopMoving();
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeMovableX(ref.current, props);
  }, []);
}
