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
import { clamp } from '../../core/Utils/Math';
import {
  setCurrentScroll,
  setCurrentTimeMs,
  setLastSeekTimeMs,
} from '../../store/Reducers/TimelineSlice';

const StyledTimelineTrackpadContainer = styled(FlexContainer)`
  height: 100%;
  flex-direction: column;
  gap: 0px;
  padding: 0px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const TimelineTrackpad: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const updatePosByTime = (timeMs?: number) => {
    if (!seekerRef.current || !scrollbarRef.current) return;

    const scrollX = scrollbarRef.current.getScrollLeft();
    const clientX = timeline.timeMsToUnits(timeMs);

    seekerRef.current.style.left = clientX - scrollX + 'px';
  };

  const updatePosAndTime = (timeMs?: number) => {
    timeMs ??= timeline.currentTimeMs;

    const clampedTimeMs = clamp(timeMs, 0, timeline.totalLengthMs);

    updatePosByTime(clampedTimeMs);

    dispatch(setCurrentTimeMs(clampedTimeMs));
    dispatch(setLastSeekTimeMs(clampedTimeMs));
  };

  const setCurrentTime = (event: MouseEvent<HTMLElement>) => {
    if (!scrollbarRef.current || !seekerRef.current) return;

    const clientX = event.clientX - TIMELINE_OFFSET_X;
    const scrollX = scrollbarRef.current.getScrollLeft();

    const timeMs = timeline.unitsToTimeMs(clientX + scrollX);

    updatePosAndTime(timeMs);
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
   * 1) Updates seeker position relatively to the current zoom.
   * 2) Updates seeker position on scroll.
   * 3) Updates seeker position on current time change.
   */
  useEffect(updatePosByTime, [
    timeline.currentZoom,
    timeline.currentScroll,
    timeline.currentTimeMs,
  ]);

  /**
   * Updates and clamps time and seeker position on total length change.
   */
  useEffect(updatePosAndTime, [timeline.totalLengthMs]);

  return (
    <StyledTimelineTrackpadContainer
      className='timeline-trackpad'
      onMouseDown={handleMouseDown}
      onDoubleClick={setCurrentTime}
    >
      <TimelineRuler
        ref={rulerRef}
        unit={timeline.currentZoom.unit}
        segments={timeline.currentZoom.segments}
        zoom={timeline.currentZoom.zoom}
        scrollPos={timeline.currentScroll.left}
      />

      <TimelineSeeker
        ref={seekerRef}
        onMove={setCurrentTime}
      />

      <TimelineTrackArea
        scrollbarRef={scrollbarRef}
        seekerRef={seekerRef}
        onScroll={updateScroll}
      />
    </StyledTimelineTrackpadContainer>
  );
};

export { TimelineTrackpad };
