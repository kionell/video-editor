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
  border: none;
  overflow: hidden;
  margin-bottom: 6px;
  background: ${(props) => props.theme.other.secondary};
`;

const TimelineTrack: React.FC<TimelineTrackProps> = (props: TimelineTrackProps) => {
  const track = props.track;

  return (
    <StyledTimelineTrack>
      {
        track.elements.map((element, i) => {
          return (
            <TimelineElement element={element} key={i} />
          );
        })
      }
    </StyledTimelineTrack>
  );
};

export { TimelineTrack };