import { useEffect, Ref } from 'react';
import {
  createPositionTracker,
  IPositionTrackerState,
  PositionEvent,
} from '../core/Utils/Position';
import { unitsToTimeMs } from '../core/Utils/Timeline';
import { selectCurrentZoom } from '../store/Selectors';
import { setCurrentTimeMs } from '../store/Reducers/TimelineSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export function useSeekerMove(ref: Ref<HTMLElement>): void {
  const dispatch = useAppDispatch();
  const currentZoom = useAppSelector(selectCurrentZoom);

  const makeMovableX = (element: HTMLElement) => {
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

      const seekerX = position.pageX + startOffsetX;
      const timeMs = unitsToTimeMs(seekerX, currentZoom.zoom);

      dispatch(setCurrentTimeMs(timeMs));
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
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeMovableX(ref.current);
  }, []);
}
