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

const StyledTrackContainer = styled(StyledTimelineTrackContainer)`
  min-width: 100%;
`;

const TimelineTrackPanel: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!scrollbarRef.current) return;

    const scrollLeft = scrollbarRef.current.getScrollLeft();
    // const container = scrollbarRef.current.container;

    // container.style.width = `calc(${timeline.width})`;

    setSeekerPosition();

    dispatch(setCurrentScroll(scrollLeft));
  };

  const setCurrentTime = (event: MouseEvent<HTMLDivElement>) => {
    if (!scrollbarRef.current) return;

    const clientX = event.clientX - 40;
    const scrollX = scrollbarRef.current.getScrollLeft();

    const timeMs = timeline.unitsToTimeMs(clientX + scrollX);

    dispatch(setCurrentTimeMs(timeMs));
  };

  const setSeekerPosition = () => {
    if (!seekerRef.current || !scrollbarRef.current) return;

    const units = timeline.timeMsToUnits();
    const scrollX = scrollbarRef.current.getScrollLeft();
    const offsetX = units - scrollX;

    seekerRef.current.style.left = offsetX + 'px';
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(setSeekerPosition, [timeline.currentTimeMs, timeline.currentZoom]);
  useEffect(onScroll, []);

  return (
    <StyledTimelineContainer onClick={setCurrentTime}>
      <StyledTimelineRulerContainer ref={rulerRef}>
        <TimelineRuler
          unit={timeline.currentZoom.unit}
          segments={timeline.currentZoom.segments}
          zoom={timeline.currentZoom.zoom}
          scrollPos={timeline.currentScroll}
        />
      </StyledTimelineRulerContainer>

      <TimelineSeeker ref={seekerRef} />

      <StyledTrackPanelContainer onScroll={onScroll} ref={scrollbarRef}>
        <StyledTrackControlContainer onClick={handleClick}>
          {
            timeline.tracks.map((track, i) => {
              return <TimelineTrackControl track={track} key={i} />;
            })
          }
        </StyledTrackControlContainer>

        <StyledTrackContainer>
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
