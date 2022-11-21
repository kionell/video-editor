import { useEffect, Ref } from 'react';
import {
  createPositionTracker,
  IPositionTrackerState,
  PositionEvent,
} from '../core/Utils/Position';

export function useMovableX(ref: Ref<HTMLElement>): void {
  const makeMovableX = (element: HTMLElement) => {
    const tracker = createPositionTracker();

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
    };

    const moveElement = (event: PositionEvent) => {
      position = tracker.update(event);

      element.style.left = position.pageX + startOffsetX + 'px';
    };

    const stopMoving = () => {
      document.removeEventListener('touchmove', moveElement);
      document.removeEventListener('touchend', stopMoving);
      document.removeEventListener('mousemove', moveElement);
      document.removeEventListener('mouseup', stopMoving);
    };

    element.addEventListener('touchstart', startMoving);
    element.addEventListener('mousedown', startMoving);

    return () => {
      element.removeEventListener('touchstart', startMoving);
      element.removeEventListener('mousedown', startMoving);

      stopMoving();
    }
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeMovableX(ref.current);
  }, []);
}
