import styled from 'styled-components';
import { TimelineTools } from './TimelineTools';
import { TimelineRuler } from './TimelineRuler';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrackArea } from './TimelineTrackArea';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.other.primary};
`;

const StyledTimelinableContainer = styled(ScrollableContainer)`
  width: 100%;
  height: 100%;
  gap: 0;
  padding: 0;
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  return (
    <StyledTimeline>
      <TimelineTools />
        <TimelineRuler 
          zoom={timeline.currentZoom} 
          scrollPos={timeline.currentScroll}
        />
        <StyledTimelinableContainer>
          <TimelineTrackArea />
        </StyledTimelinableContainer>
    </StyledTimeline>
  );
};

export { Timeline };
