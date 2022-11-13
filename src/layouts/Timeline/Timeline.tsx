import styled from 'styled-components';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTools } from './TimelineTools';
import { TimelineTrackpad } from './TimelineTrackpad';
import { TimelineTrackpadPlaceholder } from './TimelineTrackpadPlaceholder';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.primary.surface};
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);

  return (
    <StyledTimeline>
      <TimelineTools />
      {
        timeline.tracks.length > 0
          ? <TimelineTrackpad />
          : <TimelineTrackpadPlaceholder />
      }
    </StyledTimeline>
  );
};

export { Timeline };
