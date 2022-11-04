import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll } from '../../store/Reducers/timelineSlice';
import { TimelineTrackControl } from './TimelineTrackControl';
import { TimelineSeeker } from './TimelineSeeker';

const StyledTrackPanelContainer = styled(ScrollableContainer)`
  display: flex;
  position: relative;
  margin-top: 10px;
  gap: 0;
  padding: 0;
`;

const StyledTrackControlContainer = styled.div`
  width: 30px;
  height: 100%;
  position: sticky;
  left: 0px;
  display: flex;
  flex-basis: 30px;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: column;
  z-index: 1;
  background-color: ${(props) => props.theme.other.secondary};
`;

const StyledTrackAreaContainer = styled.div`
  width: 0px;
  height: 100%;
  position: relative;
  flex: 1;
`;

const TimelineTrackPanel: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  const seekerRef = useRef(null);
  
  const onScroll = () => {
    if (!scrollbarRef.current) return;

    const currentScroll = scrollbarRef.current.getScrollLeft();

    dispatch(setCurrentScroll(currentScroll));
  };

  return (
    <>
      <TimelineSeeker ref={seekerRef} />
      <StyledTrackPanelContainer onScroll={onScroll} ref={scrollbarRef}>

        <StyledTrackControlContainer>
          {
            timeline.tracks.map((track, i) => {
              return <TimelineTrackControl track={track} key={i} />;
            })
          }
        </StyledTrackControlContainer>

        <StyledTrackAreaContainer>
          {
            timeline.tracks.map((track) => {
              return <TimelineTrack track={track} key={track.index}/>;
            })
          }
        </StyledTrackAreaContainer>
      </StyledTrackPanelContainer>
    </>
  );
};

export { TimelineTrackPanel };
