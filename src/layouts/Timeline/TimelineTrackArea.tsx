import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRef } from 'react';
import { Text } from '../../components/Text';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentScroll } from '../../store/Reducers/timelineSlice';

const StyledTimelinableContainer = styled(ScrollableContainer)`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 10px;
  gap: 0;
  padding: 0;
  background: ${(props) => props.theme.other.primary};
`;

const StyledTimelineTrackAreaPlaceholder = styled(Text)`
  color: ${(props) => props.theme.text.darker};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const TimelineTrackArea: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<Scrollbars>(null);
  
  const onScroll = () => {
    if (!scrollbarRef.current) return;

    const currentScroll = scrollbarRef.current.getScrollLeft();

    dispatch(setCurrentScroll(currentScroll));
  };

  return (
    <StyledTimelinableContainer onScroll={onScroll} ref={scrollbarRef}>
      {
        timeline.tracks.length > 0
        ?
        timeline.tracks.map((track) => {
          return <TimelineTrack track={track} key={track.index}/>;
        })
        :
        <StyledTimelineTrackAreaPlaceholder
          className='placeholder'
          text='Add files to timeline to start' 
          size={30}
          useColor={false}
        />
      }      
    </StyledTimelinableContainer>
  );
};

export { TimelineTrackArea };
