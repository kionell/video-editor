import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { MouseEvent, useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll } from '../../store/Reducers/timelineSlice';
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
  flex: 1;
  flex-wrap: nowrap;
  gap: 0px;
  padding: 0px;
`;

const StyledTimelineRulerContainer = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  background-color: ${(props) => props.theme.other.secondary};
`;

const StyledTimelineTrackContainer = styled(FlexContainer)`
  flex-direction: column;
  padding: 0;
`;

const StyledTrackControlContainer = styled(StyledTimelineTrackContainer)`
  position: relative;
  width: 40px;
  left: 0px;
  float: left;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.other.secondary};
`;

const StyledTrackContainer = styled(StyledTimelineTrackContainer)``;

const TimelineTrackPanel: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => onScroll(), []);

  const onScroll = () => {
    if (!scrollbarRef.current) return;
    
    const scrollLeft = scrollbarRef.current.getScrollLeft();

    if (seekerRef.current) {
      seekerRef.current.style.translate = `calc(-50% + 40px - ${scrollLeft}px)`;
    }

    dispatch(setCurrentScroll(scrollLeft));
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <StyledTimelineContainer>
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
