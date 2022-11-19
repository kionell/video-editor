import styled from 'styled-components';
import { HTMLAttributes, createRef, RefObject, useState, useRef, DragEvent } from 'react';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TimelineTrack } from '../../core/Timeline/TimelineTrack';
import { TimelineElement } from './TimelineElement';
import { TimelineElementDropZone } from './TimelineElementDropZone';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createPositionTracker, IPositionTrackerState } from '../../core/Utils/Position';
import { getWidthFromDraggable } from '../../core/Utils/Timeline';
import { TIMELINE_OFFSET_X } from '../../constants';
import { focusElement, unfocusElement } from '../../store/Reducers/TimelineSlice';
import { BaseElement } from '../../core/Elements/BaseElement';

interface TimelineRowProps extends HTMLAttributes<HTMLDivElement> {
  track: TimelineTrack;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineRowTrack = styled(FlexContainer)`
  flex: 1 1 0%;
  height: 50px;
  padding: 0px;
  gap: 0px;
  background: ${(props) => props.theme.secondary.surface + '80'};
`;

const TimelineRowTrack: React.FC<TimelineRowProps> = ((props: TimelineRowProps) => {
  const dispatch = useAppDispatch();
  const timeline = useAppSelector((state) => state.timeline);
  const files = useAppSelector((state) => state.files);

  const [isDragging, setDragging] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { seekerRef, track } = props;

  const tracker = useRef(createPositionTracker());
  const elementLeft = useRef(0);
  const elementWidth = useRef(0);

  let position: IPositionTrackerState;

  const onDragEnter = (event: DragEvent<HTMLElement>) => {
    if (!dropZoneRef.current || !seekerRef?.current) return;

    const draggable = document.querySelector('.dragging') as HTMLElement;

    position = tracker.current.start(event.nativeEvent);

    elementLeft.current = parseFloat(draggable.style.left) - TIMELINE_OFFSET_X;
    elementWidth.current = getWidthFromDraggable(draggable, timeline, files);

    seekerRef.current.style.pointerEvents = 'none';
  };

  const onDragOver = (event: DragEvent<HTMLElement>) => {
    if (!dropZoneRef.current) return;

    position = tracker.current.update(event.nativeEvent);

    const dropZoneLeft = elementLeft.current + position.relativeX;
    const scrollLeft = timeline.currentScroll.left;

    dropZoneRef.current.style.left = dropZoneLeft + scrollLeft + 'px';
    dropZoneRef.current.style.width = elementWidth.current + 'px';
    dropZoneRef.current.style.translate = '0%';

    if (!isDragging) {
      setDragging(true);
    }
  };

  const onDragLeave = () => {
    if (!dropZoneRef.current) return;

    dropZoneRef.current.style.translate = '-100%';
    dropZoneRef.current.style.left = '';
    dropZoneRef.current.style.width = '';

    setDragging(false);
  };

  const onDragEnd = () => {
    if (!seekerRef?.current) return;

    seekerRef.current.style.pointerEvents = '';

    onDragLeave();
  }

  const focusCallback = (element: BaseElement) => {
    dispatch(focusElement({ element }));
  };

  const blurCallback = (element: BaseElement) => {
    dispatch(unfocusElement({ element }));
  };

  return (
    <StyledTimelineRowTrack
      className='timeline-row-track'
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDragEnd}
    >
      {
        track.elements.map((element) => (
          <TimelineElement
            element={element}
            key={element.uniqueId}
            ref={createRef()}
            focusCallback={() => focusCallback(element)}
            blurCallback={() => blurCallback(element)}
          />
        ))
      }
      <TimelineElementDropZone
        visible={isDragging && elementWidth.current > 0}
        ref={dropZoneRef}
      />
    </StyledTimelineRowTrack>
  );
});

TimelineRowTrack.displayName = 'Timeline Row Track';

export { TimelineRowTrack };
