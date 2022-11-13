import React, { createRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Text } from '../../components/Text';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TimelineTrack as TrackModel } from '../../models/Timeline/TimelineTrack';
import { TimelineElement } from './TimelineElement';

interface TimelineTrackProps extends HTMLAttributes<HTMLDivElement> {
  track: TrackModel;
}

const StyledTimelineTrackControl = styled(FlexContainer)`
  width: 40px;
  height: 50px;
  justify-content: center;
  align-content: center;
  border: none;
  overflow: hidden;
  cursor: grab;
  /* padding: 6px 0px 0px 0px; */
  gap: 0px;
  background: ${(props) => props.theme.secondary.surface};
`;

const StyledTrackNumber = styled(Text)`
  align-self: center;
  color: ${(props) => props.theme.text.normal};
`;

const StyledTimelineTrack = styled.div`
  width: 100%;
  height: 50px;
  background: ${(props) => props.theme.secondary.surface + '50'};
`;

const StyledTimelineRow = styled(FlexContainer)`
  width: 100%;
  border: none;
  overflow: hidden;
  padding: 0px;
  gap: 0px;
  flex-wrap: nowrap;
  align-items: center;

  &:hover {
    ${StyledTimelineTrackControl} {
      background: ${(props) => props.theme.secondary.hover};
    }

    ${StyledTimelineTrack} {
      background: ${(props) => props.theme.secondary.surface};
    }
  }
`;

const TimelineTrack: React.FC<TimelineTrackProps> = (props: TimelineTrackProps) => {
  const track = props.track;

  return (
    <StyledTimelineRow>
      <StyledTimelineTrackControl key={track.index}>
        <StyledTrackNumber text={`${track.index + 1}`} />
      </StyledTimelineTrackControl>

      <StyledTimelineTrack>
        {
          track.elements.map((element, i) => (
            <TimelineElement element={element} key={i} ref={createRef()} />
          ))
        }
      </StyledTimelineTrack>
    </StyledTimelineRow>
  );
};

export { TimelineTrack };
