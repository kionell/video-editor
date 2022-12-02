import styled from 'styled-components';
import { useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useResizable } from '../../hooks/useResizable';
import { ResizerLine } from '../Containers/Resizer';
import { TimelineTools } from './TimelineTools';
import { TimelineTrackpad } from './TimelineTrackpad';
import { TimelineTrackpadPlaceholder } from './TimelineTrackpadPlaceholder';
import { selectTotalTracks } from '../../store';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  min-height: 50px;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  background: ${(props) => props.theme.primary.surface};
`;

const Timeline: React.FC = () => {
  const totalTracks = useAppSelector(selectTotalTracks);
  const timelineRef = useRef();

  useResizable(timelineRef);

  return (
    <StyledTimeline ref={timelineRef}>
      <ResizerLine direction='top'/>
      <TimelineTools />
      {
        totalTracks > 0
          ? <TimelineTrackpad />
          : <TimelineTrackpadPlaceholder />
      }
    </StyledTimeline>
  );
};

export { Timeline };
