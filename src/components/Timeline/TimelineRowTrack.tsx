import styled from 'styled-components';
import { HTMLAttributes, createRef, RefObject, useState, useRef } from 'react';
import { FlexContainer } from '../Containers/FlexContainer';
import { TimelineTrack } from '../../core/Timeline/TimelineTrack';
import { TimelineElement } from './TimelineElement';
import { TimelineElementDropZone } from './TimelineElementDropZone';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createPositionTracker, IPositionTrackerState, PositionEvent } from '../../core/Utils/Position';
import { getElementFromDraggable, getWidthFromDraggable, unitsToTimeMs } from '../../core/Utils/Timeline';
import { TIMELINE_OFFSET_X } from '../../constants';
import { addElement, moveElement } from '../../store/Reducers/TimelineSlice';
import { selectCurrentScroll, selectCurrentZoom, selectFiles, selectFocusedTracks } from '../../store';

interface TimelineRowProps extends HTMLAttributes<HTMLDivElement> {
  track: TimelineTrack;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineRowTrack = styled(FlexContainer)`
  flex: 1 1 0%;
  height: 50px;
  padding: 0px;
  gap: 0px;
  background: ${(props) => props.theme.secondary.surface + '60'};
`;

const TimelineRowTrack: React.FC<TimelineRowProps> = ((props: TimelineRowProps) => {
  const dispatch = useAppDispatch();
  const currentScroll = useAppSelector(selectCurrentScroll);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const focusedTracks = useAppSelector(selectFocusedTracks);
  const files = useAppSelector(selectFiles);

  const [isDragging, setDragging] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const seekerRef = props.seekerRef;
  const currentTrack = props.track;

  const tracker = useRef(createPositionTracker());
  const elementLeft = useRef(0);
  const elementWidth = useRef(0);

  let position: IPositionTrackerState;

  const onDragEnter = (event: PositionEvent) => {
    if (!dropZoneRef.current || !seekerRef?.current) return;

    const draggable = document.querySelector('.dragging') as HTMLElement;

    position = tracker.current.start(event);

    elementLeft.current = parseFloat(draggable.style.left) - TIMELINE_OFFSET_X;
    elementWidth.current = getWidthFromDraggable(draggable, files, currentZoom.zoom);

    seekerRef.current.style.pointerEvents = 'none';
  };

  const onDragOver = (event: PositionEvent) => {
    if (!dropZoneRef.current) return;

    position = tracker.current.update(event);

    const dropZoneLeft = elementLeft.current + position.relativeX;
    const scrollLeft = currentScroll.left;

    dropZoneRef.current.style.left = dropZoneLeft + scrollLeft + 'px';
    dropZoneRef.current.style.width = elementWidth.current + 'px';

    if (!isDragging) {
      setDragging(true);
    }
  };

  const onDragLeave = () => {
    if (!dropZoneRef.current) return;

    dropZoneRef.current.style.left = '';
    dropZoneRef.current.style.width = '';

    setDragging(false);
  };

  const onDragEnd = () => {
    if (!seekerRef?.current) return;

    seekerRef.current.style.pointerEvents = '';

    onDragLeave();
  };

  const onDrop = () => {
    if (!dropZoneRef.current) return;

    const newElementLeft = parseFloat(dropZoneRef.current.style.left);
    const newTimeMs = unitsToTimeMs(newElementLeft, currentZoom.zoom);

    if (focusedTracks.length > 0) {
      focusedTracks.forEach((focusedTrack) => {
        focusedTrack.focusedElements.forEach((focusedElement) => {
          const moveAction = moveElement({
            fromIndex: focusedTrack.index,
            fromMs: focusedElement.offsetMs,
            toIndex: currentTrack.index,
            toMs: newTimeMs,
          });

          dispatch(moveAction);
        });
      });
    }
    else {
      const draggable = document.querySelector('.dragging') as HTMLElement;
      const element = getElementFromDraggable(draggable, files);

      if (element) {
        element.offsetMs = newTimeMs;

        dispatch(addElement({
          trackIndex: currentTrack.index,
          element,
        }));
      }
    }

    onDragEnd();
  };

  return (
    <StyledTimelineRowTrack
      className='timeline-row-track'
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      {
        currentTrack.elements.map((element) => (
          <TimelineElement
            element={element}
            key={element.uniqueId}
            ref={createRef()}
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
