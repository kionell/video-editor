import styled from 'styled-components';
import { Text } from '../Text';
import { FlexContainer } from '../Containers/FlexContainer';
import { LARGE_FONT_SIZE } from '../../constants';

const StyledTimelineTrackpadPlaceholderContainer = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const StyledTimelineTrackpadPlaceholder = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.darker};
  text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.6);
`;

const TimelineTrackpadPlaceholder: React.FC = () => {
  return (
    <StyledTimelineTrackpadPlaceholderContainer>
      <StyledTimelineTrackpadPlaceholder
        text='Add files to timeline to start'
        size={LARGE_FONT_SIZE}
      />
    </StyledTimelineTrackpadPlaceholderContainer>
  );
};

export { TimelineTrackpadPlaceholder };
