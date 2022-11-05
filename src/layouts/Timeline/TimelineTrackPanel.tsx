import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll } from '../../store/Reducers/timelineSlice';
import { TimelineTrackControl } from './TimelineTrackControl';
import { TimelineSeeker } from './TimelineSeeker';
import { TimelineRuler } from './TimelineRuler';

const StyledTimelineArea = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
`;

const StyledTrackControlContainer = styled.div`
  width: 30px;
  height: 100%;
  position: relative;
  left: 0px;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: column;
  z-index: 1;
  padding-top: 30px;
  background-color: ${(props) => props.theme.other.secondary};
`;

const StyledTrackControlArea = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  overflow: hidden;
`;

const StyledTrackPanelContainer = styled.div`
  width: 0px;
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledTrackArea = styled(ScrollableContainer)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
`;

const TimelineTrackPanel: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef(null);
  
  useEffect(() => onScroll(), []);

  const onScroll = () => {
    if (!scrollbarRef.current) return;

    const scrollLeft = scrollbarRef.current.getScrollLeft();
    const scrollTop = scrollbarRef.current.getScrollTop();
    const container = scrollbarRef.current.container;
    const scrollArea = container.children.item(0) as HTMLDivElement;
    const trackArea = scrollArea.children.item(0) as HTMLDivElement;

    // Infinity scroll.
    trackArea.style.width = `calc(100% + 100px + ${scrollLeft}px`;
    trackArea.style.height = `calc(100% + 25px + ${scrollTop}px`;
    
    dispatch(setCurrentScroll(scrollLeft));
  };

  return (
    <StyledTimelineArea>
      <TimelineSeeker ref={seekerRef} />

      <StyledTrackControlContainer>
        {
          timeline.tracks.map((track, i) => {
            return <TimelineTrackControl track={track} key={i} />;
          })
        }
      </StyledTrackControlContainer>

      <StyledTrackPanelContainer>
        <TimelineRuler
          zoom={timeline.currentZoom} 
          scrollPos={timeline.currentScroll}
        />

        <StyledTrackArea onScroll={onScroll} ref={scrollbarRef}>
          {
            timeline.tracks.map((track) => {
              return <TimelineTrack track={track} key={track.index}/>;
            })
          }
        </StyledTrackArea>
      </StyledTrackPanelContainer>
    </StyledTimelineArea>
  );
};

export { TimelineTrackPanel };
