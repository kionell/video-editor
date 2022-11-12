import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { MouseEvent, useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll, setCurrentTimeMs } from '../../store/Reducers/timelineSlice';
import { TimelineTrackControl } from './TimelineTrackControl';
import { TimelineSeeker } from './TimelineSeeker';
import { TimelineRuler } from './TimelineRuler';

const StyledTimelineContainer = styled(FlexContainer)`
  height: 100%;
  flex-direction: column;
  gap: 0px;
  padding: 0px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const StyledTrackPanelContainer = styled(ScrollableContainer)`
  height: 100%;
  flex-wrap: nowrap;
  gap: 0px;
  padding: 0px;
`;

const StyledTimelineRulerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  background-color: ${(props) => props.theme.secondary.surface};
`;

const StyledTimelineTrackContainer = styled(FlexContainer)`
  flex-direction: column;
  padding: 6px 0px;
`;

const StyledTrackControlContainer = styled(StyledTimelineTrackContainer)`
  position: relative;
  width: 40px;
  left: 0px;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.secondary.surface};
`;

const StyledTrackContainer = styled(StyledTimelineTrackContainer)``;

const TimelineTrackPanel: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const trackAreaRef = useRef<HTMLDivElement>(null);

  const updatePosByTime = (timeMs?: number) => {
    if (!seekerRef.current || !scrollbarRef.current) return;

    const scrollX = scrollbarRef.current.getScrollLeft();
    const clientX = timeline.timeMsToUnits(timeMs);

    seekerRef.current.style.left = clientX - scrollX + 'px';
  }

  const setSeekerPosition = (event: MouseEvent<HTMLDivElement>) => {
    if (!seekerRef.current || !scrollbarRef.current) return;

    const clientX = event.clientX - 40;
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

  const handleScroll = () => {
    if (!scrollbarRef.current) return;

    const scrollLeft = scrollbarRef.current.getScrollLeft();

    updatePosByTime();

    dispatch(setCurrentScroll(scrollLeft));
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(updatePosByTime, [timeline.currentZoom]);

  useEffect(() => {
    if (!trackAreaRef.current) return;

    trackAreaRef.current.style.width = `calc(100% + ${timeline.width}px)`;
  }, [timeline.width]);

  return (
    <StyledTimelineContainer onClick={setSeekerPosition}>
      <StyledTimelineRulerContainer ref={rulerRef}>
        <TimelineRuler
          unit={timeline.currentZoom.unit}
          segments={timeline.currentZoom.segments}
          zoom={timeline.currentZoom.zoom}
          scrollPos={timeline.currentScroll}
        />
      </StyledTimelineRulerContainer>

      <TimelineSeeker ref={seekerRef} movementCallback={setCurrentTime} />

      <StyledTrackPanelContainer onScroll={handleScroll} ref={scrollbarRef}>
        <StyledTrackControlContainer onClick={handleClick}>
          {
            timeline.tracks.map((track, i) => {
              return <TimelineTrackControl track={track} key={i} />;
            })
          }
        </StyledTrackControlContainer>

        <StyledTrackContainer ref={trackAreaRef}>
          {
            timeline.tracks.map((track) => {
              return <TimelineTrack track={track} key={track.index}/>;
            })
          }
        </StyledTrackContainer>
      </StyledTrackPanelContainer>
    </StyledTimelineContainer>
  );
};

export { TimelineTrackPanel };
