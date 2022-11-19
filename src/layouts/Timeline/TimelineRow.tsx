import { HTMLAttributes, RefObject } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import styled from 'styled-components';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TimelineTrack } from '../../models/Timeline/TimelineTrack';
import { TimelineRowControl } from './TimelineRowControl';
import { TimelineRowTrack } from './TimelineRowTrack';

interface TimelineRowProps extends HTMLAttributes<HTMLDivElement> {
  track: TimelineTrack;
  scrollbarRef?: RefObject<Scrollbars>;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineRow = styled(FlexContainer)<TimelineRowProps>`
  width: 100%;
  border: none;
  overflow: hidden;
  padding: 0px;
  gap: 0px;
  flex-wrap: nowrap;
  align-items: center;

  &:hover {
    .timeline-row-control {
      background: ${(props) => props.theme.secondary.hover};
    }

    .timeline-row-track {
      background: ${(props) => props.theme.secondary.surface};
    }
  }
`;

const TimelineRow: React.FC<TimelineRowProps> = ((props: TimelineRowProps) => {
  return (
    <StyledTimelineRow track={props.track} className='timeline-row'>
      <TimelineRowControl
        track={props.track}
        scrollbarRef={props.scrollbarRef}
        seekerRef={props.seekerRef}
      />
      <TimelineRowTrack
        track={props.track}
        scrollbarRef={props.scrollbarRef}
        seekerRef={props.seekerRef}
      />
    </StyledTimelineRow>
  );
});

TimelineRow.displayName = 'Timeline Row';

export { TimelineRow };
