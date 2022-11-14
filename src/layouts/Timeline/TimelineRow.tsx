import React, { createRef, HTMLAttributes, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Text } from '../../components/Text';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TimelineTrack as TrackModel } from '../../models/Timeline/TimelineTrack';
import { TimelineElement } from './TimelineElement';
import { TIMELINE_OFFSET_X } from '../../constants';
import { createPositionTracker } from '../../utils/position';
import { moveTrack } from '../../store/Reducers/timelineSlice';
import { useAppDispatch } from '../../hooks';

interface TimelineTrackProps extends HTMLAttributes<HTMLDivElement> {
  track: TrackModel;
}

const StyledTimelineTrackControl = styled(FlexContainer)`
  width: ${TIMELINE_OFFSET_X}px;
  flex: 0 0 ${TIMELINE_OFFSET_X}px;
  height: 50px;
  justify-content: center;
  align-content: center;
  border: none;
  overflow: hidden;
  cursor: grab;
  gap: 0px;
  background: ${(props) => props.theme.secondary.surface};
`;

const StyledTrackNumber = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.normal};
`;

const StyledTimelineTrack = styled(FlexContainer)`
  flex: 1 1 0%;
  height: 50px;
  padding: 0px;
  gap: 0px;
  background: ${(props) => props.theme.secondary.surface + '80'};

  .dragging {
    cursor: grabbing;
  }
`;

const StyledTimelineRow = styled(FlexContainer)`
  width: 100%;
  border: none;
  overflow: hidden;
  padding: 0px;
  gap: 0px;
  flex-wrap: nowrap;
  align-items: center;

  &:hover {
    ${StyledTimelineTrackControl} {
      background: ${(props) => props.theme.secondary.hover};
    }

    ${StyledTimelineTrack} {
      background: ${(props) => props.theme.secondary.surface};
    }
  }
`;

const TimelineRow: React.FC<TimelineTrackProps> = (props: TimelineTrackProps) => {
  const dispatch = useAppDispatch();

  const controlRef = useRef<HTMLDivElement>(null);
  const track = props.track;

  let rowContainer: HTMLElement;
  let rowElement: HTMLElement;

  let tracker: ReturnType<typeof createPositionTracker>;
  let position: ReturnType<typeof tracker.update>;
  let zIndex: string;

  interface DraggableState {
    index: number;
    offsetY: number;
    element: HTMLElement;
  }

  const findAfterState = (): DraggableState => {
    const draggableElements = [
      ...rowContainer.querySelectorAll('.timeline-row:not(.dragging)'),
    ] as HTMLElement[];

    const state = {
      index: -1,
      offsetY: -Infinity,
      element: rowElement,
    }

    draggableElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const offsetY = position.pageY - rect.top - rect.height / 2;

      if (offsetY < 0 && offsetY > state.offsetY) {
        state.offsetY = offsetY;
        state.element = element;
        state.index = index;
      }
    });

    return state;
  }

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    position = tracker.update(event);

    rowElement.style.top = position.relativeY + 'px';
  };

  const onMouseUp = (event: MouseEvent) => {
    event.preventDefault();

    rowContainer.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (rowElement.classList.contains('dragging')) {
      rowElement.classList.remove('dragging');
    }

    rowElement.style.zIndex = zIndex;
    rowElement.style.top = '';

    position = tracker.update(event);

    const state = findAfterState();

    if (state.index === track.index) return;

    dispatch(moveTrack({
      fromIndex: track.index,
      toIndex: state.index,
    }))
  }

  const onMouseDown = (event: MouseEvent) => {
    tracker = createPositionTracker(event);

    zIndex = rowElement.style.zIndex;
    rowElement.style.zIndex = '9999';

    if (!rowElement.classList.contains('dragging')) {
      rowElement.classList.add('dragging');
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
    <StyledTimelineRow className='timeline-row'>
      <StyledTimelineTrackControl ref={controlRef} key={track.index}>
        <StyledTrackNumber text={`${track.index + 1}`} />
      </StyledTimelineTrackControl>

      <StyledTimelineTrack>
        {
          track.elements.map((element, i) => (
            <TimelineElement element={element} key={i} ref={createRef()} />
          ))
        }
      </StyledTimelineTrack>
    </StyledTimelineRow>
  );
};

export { TimelineRow };
