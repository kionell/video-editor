import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { MouseEvent, useEffect, useRef } from 'react';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll, setCurrentTimeMs } from '../../store/Reducers/TimelineSlice';
import { TimelineSeeker } from './TimelineSeeker';
import { TimelineRuler } from './TimelineRuler';
import { TimelineTrackArea } from './TimelineTrackArea';
import { TIMELINE_OFFSET_X } from '../../constants';

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
  }

  const setSeekerPosition = (event: MouseEvent<HTMLElement>) => {
    if (!seekerRef.current || !scrollbarRef.current) return;

    const clientX = event.clientX - TIMELINE_OFFSET_X;
    const scrollX = scrollbarRef.current.getScrollLeft();

    const timeMs = timeline.unitsToTimeMs(clientX + scrollX);

    updatePosByTime(timeMs);

    dispatch(setCurrentTimeMs(timeMs));
  };

  const setCurrentTime = () => {
    if (!scrollbarRef.current || !seekerRef.current) return;

    const clientX = parseFloat(seekerRef.current.style.left);
    const scrollX = scrollbarRef.current.getScrollLeft();

    const timeMs = timeline.unitsToTimeMs(clientX + scrollX);

    if (timeMs >= timeline.durationMs) {
      updatePosByTime(timeMs);
    }

    dispatch(setCurrentTimeMs(timeMs));
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLElement;

    const isRuler = targetElement.classList.contains('timeline-ruler');
    const isTrackArea = targetElement.classList.contains('timeline-track-area');
    const isTrack = targetElement.classList.contains('timeline-row-track');

    // This is the protection against "fake" seeks. 
    if (!isRuler && !isTrackArea && !isTrack) return;

    setSeekerPosition(event);
  }

  const handleScroll = () => {
    if (!scrollbarRef.current) return;

    const scrollState = {
      left: scrollbarRef.current.getScrollLeft(),
      top: scrollbarRef.current.getScrollTop(),
    };

    updatePosByTime();

    dispatch(setCurrentScroll(scrollState));
  };

  useEffect(updatePosByTime, [timeline.currentZoom]);

  return (
    <StyledTimelineTrackpadContainer
      onMouseDown={handleMouseDown}
      onDoubleClick={setSeekerPosition}
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
        onScroll={handleScroll}
      />
    </StyledTimelineTrackpadContainer>
  );
};

export { TimelineTrackpad };
