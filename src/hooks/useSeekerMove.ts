import { useEffect, Ref } from 'react';
import Sister, { SisterEventListener } from 'sister';
import {
  createPositionTracker,
  IPositionTrackerState,
  PositionEvent,
} from '../core/Utils/Position';

export interface SeekerMoveState {
  target: HTMLElement;
  seekerX: number;
}

export type SeekerMoveCallback = (state: SeekerMoveState) => void;

export function useSeekerMove(ref: Ref<HTMLElement>, cb?: SeekerMoveCallback): void {
  const makeMovableX = (element: HTMLElement, cb?: SeekerMoveCallback) => {
    const emitter = new Sister();
    const tracker = createPositionTracker();

    let position: IPositionTrackerState;
    let startOffsetX = 0;

    const startMoving = (event: PositionEvent) => {
      position = tracker.start(event);

      startOffsetX = element.offsetLeft - position.pageX;

      document.addEventListener('touchmove', moveElement);
      document.addEventListener('touchend', stopMoving);
      document.addEventListener('mousemove', moveElement);
      document.addEventListener('mouseup', stopMoving);
    };

    const moveElement = (event: PositionEvent) => {
      position = tracker.update(event);

      emitter.trigger<'seeker-move', SeekerMoveState>('seeker-move', {
        target: element,
        seekerX: position.pageX + startOffsetX,
      });
    };

    const stopMoving = () => {
      document.removeEventListener('touchmove', moveElement);
      document.removeEventListener('touchend', stopMoving);
      document.removeEventListener('mousemove', moveElement);
      document.removeEventListener('mouseup', stopMoving);
    };

    element.addEventListener('touchstart', startMoving);
    element.addEventListener('mousedown', startMoving);

    let seekerMoveListener: SisterEventListener | null = null;

    if (cb) seekerMoveListener = emitter.on('seeker-move', cb);

    return () => {
      element.removeEventListener('touchstart', startMoving);
      element.removeEventListener('mousedown', startMoving);

      if (seekerMoveListener) emitter.off(seekerMoveListener);

      stopMoving();
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeMovableX(ref.current, cb);
  }, []);
}
