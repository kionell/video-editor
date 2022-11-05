import React from 'react';
import styled from 'styled-components';
import { Text } from '../../components/Text';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';

interface TimelineTrackProps {
  track: TimelineTrack;
}

const StyledTimelineTrackControl = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-content: center;
  border: none;
  overflow: hidden;
  cursor: grab;
  background: ${(props) => props.theme.other.secondary};

  &:hover {
    background: ${(props) => props.theme.secondary.accentHover};
  }
`;

const StyledTrackNumber = styled(Text)`
  align-self: center;
`;

const TimelineTrackControl: React.FC<TimelineTrackProps> = (props: TimelineTrackProps) => {
  const track = props.track;

  return (
    <StyledTimelineTrackControl>
      <StyledTrackNumber text={`${track.index + 1}`} />
    </StyledTimelineTrackControl>
  );
};

export { TimelineTrackControl };