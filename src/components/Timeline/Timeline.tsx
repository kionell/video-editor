import { useRef } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useResizable } from '../../hooks/useResizable';
import { ResizerLine } from '../Containers/Resizer';
import { TimelineTools } from './TimelineTools';
import { TimelineTrackpad } from './TimelineTrackpad';
import { TimelineTrackpadPlaceholder } from './TimelineTrackpadPlaceholder';

const StyledTimeline = styled.div`
  width: 100%;
  height: 350px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  background: ${(props) => props.theme.primary.surface};
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const timelineRef = useRef();

  useResizable(timelineRef);

  return (
    <StyledTimeline ref={timelineRef}>
      <ResizerLine direction='top'/>
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
