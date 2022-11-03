import React from 'react';
import styled from 'styled-components';
import { TimelineTrack as TrackModel } from '../../models/Timeline/TimelineTrack';
import { TimelineElement } from './TimelineElement';

interface TimelineTrackProps {
  track: TrackModel;
}

const StyledTimelineTrack = styled.div`
  width: 100%;
  height: 50px;
  left: 100px;
  display: flex;
  border: none;
  overflow: hidden;
  background: ${(props) => props.theme.other.secondary};
`;

const TimelineTrack: React.FC<TimelineTrackProps> = (props: TimelineTrackProps) => {
  const track = props.track;

  return (
    <StyledTimelineTrack>
      {
        track.elements.map((_, i) => {
          return (
            <TimelineElement key={i} />
          );
        })
      }
    </StyledTimelineTrack>
  );
};

export { TimelineTrack };