import styled from 'styled-components';
import { TimelineTools } from './TimelineTools';
import { TimelineRuler } from './TimelineRuler';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrackArea } from './TimelineTrackArea';

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

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  return (
    <StyledTimeline>
      <TimelineTools />
      <StyledTimelineArea>
        <TimelineRuler 
          zoom={timeline.currentZoom} 
          scrollPos={timeline.currentScroll}
          />
        <TimelineTrackArea />
      </StyledTimelineArea>
    </StyledTimeline>
  );
};

export { Timeline };
