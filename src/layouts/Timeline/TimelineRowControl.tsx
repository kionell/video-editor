import { HTMLAttributes, useEffect, useRef, RefObject } from 'react';
import styled from 'styled-components';
import { Text } from '../../components/Text';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';
import { TIMELINE_OFFSET_X } from '../../constants';
import { createPositionTracker, IPositionTracker, IPositionTrackerState } from '../../utils/position';
import { moveTrack } from '../../store/Reducers/TimelineSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

interface TimelineRowProps extends HTMLAttributes<HTMLDivElement> {
  track: TimelineTrack;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineRowControl = styled(FlexContainer)`
  width: ${TIMELINE_OFFSET_X}px;
  flex: 0 0 ${TIMELINE_OFFSET_X}px;
  height: 50px;
  justify-content: center;
  align-content: center;
  border: none;
  overflow: hidden;
  cursor: grab;
  gap: 0px;
  z-index: 2;
  background: ${(props) => props.theme.secondary.surface};
`;

const StyledRowNumber = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.normal};
`;

const TimelineRowControl: React.FC<TimelineRowProps> = ((props: TimelineRowProps) => {
  const dispatch = useAppDispatch();
  const timeline = useAppSelector((state) => state.timeline);

  const tracker = useRef(createPositionTracker()) as RefObject<IPositionTracker>;
  const controlRef = useRef<HTMLDivElement>(null);
  const { seekerRef, track } = props;

  let rowContainer: HTMLElement;
  let rowElement: HTMLElement;

  let position: IPositionTrackerState;
  let zIndex: string;
  let scrollTop: number;
  let scrollOffset = 0;

  interface DraggableState {
    index: number;
    offsetY: number;
    element: HTMLElement;
  }

  const findAfterState = (): DraggableState => {
    const otherElements = [
      ...rowContainer.querySelectorAll('.timeline-row:not(.grabbing)'),
    ] as HTMLElement[];

    const state = {
      index: -1,
      offsetY: -Infinity,
      element: rowElement,
    }

    otherElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const offsetY = position.pageY - rect.top - rect.height / 2;

      if (offsetY < 0 && offsetY > state.offsetY) {
        state.offsetY = offsetY;
        state.element = element;
        state.index = index;
      }
    });

    // Element is at the end of the sortable list.
    if (state.index === -1) {
      // This list doesn't have current grabbing element.
      state.index = otherElements.length;
      state.element = otherElements[state.index - 1];
    }

    return state;
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!tracker.current) return;

    position = tracker.current.update(event);
    scrollOffset = timeline.currentScroll.top - scrollTop;
    rowElement.style.top = position.relativeY + scrollOffset + 'px';
  };

  const onMouseUp = (event: MouseEvent) => {
    if (!tracker.current || !seekerRef?.current) return;

    position = tracker.current.update(event);

    const state = findAfterState();

    if (state.index !== track.index) {
      dispatch(moveTrack({
        fromIndex: track.index,
        toIndex: state.index,
      }));
    }

    rowElement.style.zIndex = zIndex;
    rowElement.style.top = '';
    seekerRef.current.style.pointerEvents = 'all';

    if (rowElement.classList.contains('grabbing')) {
      rowElement.classList.remove('grabbing');
    }

    rowContainer.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  const onMouseDown = (event: MouseEvent) => {
    if (!tracker.current || !seekerRef?.current) return;

    position = tracker.current.start(event);

    zIndex = rowElement.style.zIndex;
    rowElement.style.zIndex = '3';
    seekerRef.current.style.pointerEvents = 'none';
    scrollTop = timeline.currentScroll.top;

    if (!rowElement.classList.contains('grabbing')) {
      rowElement.classList.add('grabbing');
    }

    rowContainer.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (!controlRef.current) return;

    rowElement = controlRef.current.parentElement as HTMLElement;
    rowContainer = rowElement.parentElement as HTMLElement;

    if (rowElement && rowContainer) {
      controlRef.current.addEventListener('mousedown', onMouseDown);
    }

    return () => {
      controlRef.current?.removeEventListener('mousedown', onMouseDown);
    }
  }, []);

  return (
    <StyledTimelineRowControl
      className='timeline-row-control'
      ref={controlRef}
    >
      <StyledRowNumber text={`${track.index + 1}`} />
    </StyledTimelineRowControl>
  );
});

TimelineRowControl.displayName = 'Timeline Row Control';

export { TimelineRowControl };
