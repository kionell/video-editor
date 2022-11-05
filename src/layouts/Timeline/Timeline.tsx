import styled from 'styled-components';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTools } from './TimelineTools';
import { TimelineTrackPanel } from './TimelineTrackPanel';
import { TimelineTrackPanelPlaceholder } from './TimelineTrackPanelPlaceholder';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.other.primary};
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  return (
    <StyledTimeline>
      <TimelineTools />
      {
        timeline.tracks.length > 0
          ? <TimelineTrackPanel />
          : <TimelineTrackPanelPlaceholder />
      }
    </StyledTimeline>
  );
};

export { Timeline };
