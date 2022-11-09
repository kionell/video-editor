import styled from 'styled-components';
import { Text } from '../../components/Text';
import { LARGER_FONT_SIZE } from '../../constants';

const StyledTimelinePlaceholderArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const StyledTimelinePlaceholder = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.darker};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const TimelineTrackPanelPlaceholder: React.FC = () => {
  return (
    <StyledTimelinePlaceholderArea>
      <StyledTimelinePlaceholder
        text='Add files to timeline to start' 
        size={LARGER_FONT_SIZE}
      />
    </StyledTimelinePlaceholderArea>
  );
};

export { TimelineTrackPanelPlaceholder };
