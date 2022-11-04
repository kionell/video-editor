import styled from 'styled-components';
import { TimelineTools } from './TimelineTools';
import { TimelineRuler } from './TimelineRuler';
import { Text } from '../../components/Text';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrackPanel } from './TimelineTrackPanel';
import { LARGER_FONT_SIZE } from '../../constants';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.other.primary};
`;

const StyledTimelineArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledTimelinePlaceholderArea = styled(StyledTimelineArea)`
  justify-content: center;
  align-content: center;
`;

const StyledTimelinePlaceholder = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.darker};
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  return (
    <StyledTimeline>
      <TimelineTools />
      {
        timeline.tracks.length > 0
        ?
        <StyledTimelineArea>
          <TimelineRuler
            zoom={timeline.currentZoom} 
            scrollPos={timeline.currentScroll}
          />
          <TimelineTrackPanel />
        </StyledTimelineArea>
        :
        <StyledTimelinePlaceholderArea>
          <StyledTimelinePlaceholder
            text='Add files to timeline to start' 
            size={LARGER_FONT_SIZE}
            useColor={false}
          />
        </StyledTimelinePlaceholderArea>
      }
    </StyledTimeline>
  );
};

export { Timeline };
