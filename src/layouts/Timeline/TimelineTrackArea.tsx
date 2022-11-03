import styled from 'styled-components';
import { Text } from '../../components/Text';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';

const StyledTimelineTrackArea = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${(props) => props.theme.other.primary};
`;

const StyledTimelineTrackAreaPlaceholder = styled(Text)`
  color: ${(props) => props.theme.text.darker};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const TimelineTrackArea: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  
  return (
    <StyledTimelineTrackArea>
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
    </StyledTimelineTrackArea>
  );
};

export { TimelineTrackArea };
