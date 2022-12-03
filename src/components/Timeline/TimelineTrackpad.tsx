import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { MouseEvent, useEffect, useRef } from 'react';
import { FlexContainer } from '../Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { TimelineSeeker } from './TimelineSeeker';
import { TimelineRuler } from './TimelineRuler';
import { TimelineTrackArea } from './TimelineTrackArea';
import { TIMELINE_OFFSET_X } from '../../constants';
import { unitsToTimeMs } from '../../core/Utils/Timeline';
import { clamp } from '../../core/Utils/Math';
import {
  setCurrentScroll,
  setLastSeekTimeMs,
} from '../../store/Reducers/TimelineSlice';

import {
  selectCurrentZoom,
  selectTotalLengthMs,
} from '../../store';

const StyledTimelineTrackpadContainer = styled(FlexContainer)`
  height: 100%;
  flex-direction: column;
  gap: 0px;
  padding: 0px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const TimelineTrackpad: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentZoom = useAppSelector(selectCurrentZoom);
  const totalLengthMs = useAppSelector(selectTotalLengthMs);
  const lastClampedTimeMs = useRef(0);

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  console.log('Trackpad render');

  const updateCurrentTime = (timeMs?: number) => {
    timeMs ??= lastClampedTimeMs.current;

    const clampedTimeMs = clamp(timeMs, 0, totalLengthMs);

    lastClampedTimeMs.current = clampedTimeMs;

    dispatch(setLastSeekTimeMs(clampedTimeMs));
  };

  const setCurrentTime = (event: MouseEvent<HTMLElement>) => {
    if (!scrollbarRef.current || !seekerRef.current) return;

    const clientX = event.clientX - TIMELINE_OFFSET_X;
    const scrollX = scrollbarRef.current.getScrollLeft();

    const timeMs = unitsToTimeMs(clientX + scrollX, currentZoom.zoom);

    updateCurrentTime(timeMs);
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLElement;

    const isElement = targetElement.classList.contains('timeline-element');
    const isRowControl = targetElement.classList.contains('timeline-row-control');
    const isRowAdd = targetElement.classList.contains('timeline-row-add');

    // This is the protection against "fake" seeks. 
    if (isElement || isRowControl || isRowAdd) return;

    setCurrentTime(event);
  };

  const updateScroll = () => {
    if (!scrollbarRef.current) return;

    const scrollState = {
      left: scrollbarRef.current.getScrollLeft(),
      top: scrollbarRef.current.getScrollTop(),
    };

    dispatch(setCurrentScroll(scrollState));
  };

  /**
   * Updates and clamps time and seeker position on total length change.
   */
  useEffect(updateCurrentTime, [totalLengthMs]);

  return (
    <StyledTimelineTrackpadContainer
      className='timeline-trackpad'
      onMouseDown={handleMouseDown}
      onDoubleClick={setCurrentTime}
    >
      <TimelineRuler
        ref={rulerRef}
        unit={currentZoom.unit}
        segments={currentZoom.segments}
        zoom={currentZoom.zoom}
      />

      <TimelineSeeker seekerRef={seekerRef} />

      <TimelineTrackArea
        scrollbarRef={scrollbarRef}
        seekerRef={seekerRef}
        onScroll={updateScroll}
      />
    </StyledTimelineTrackpadContainer>
  );
};

export { TimelineTrackpad };
