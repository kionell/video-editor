import styled from 'styled-components';
import { Text } from '../../components/Text';
import { TimelineElement } from './TimelineElement';

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
  return (
    <StyledTimelineTrackArea>
      {/* <StyledTimelineTrackAreaPlaceholder
        className='placeholder'
        text='Add files to timeline to start' 
        size={30}
        useColor={false}
      /> */}
      <TimelineElement
        
      />
    </StyledTimelineTrackArea>
  );
};

export { TimelineTrackArea };
