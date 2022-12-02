import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { RefObject, useEffect, useRef } from 'react';
import { FlexContainer } from '../Containers/FlexContainer';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineRow } from './TimelineRow';
import { TIMELINE_OFFSET_X } from '../../constants';
import { TimelineRowAddButton } from './TimelineRowAddButton';
import { selectCurrentZoom, selectTotalLengthMs, selectTracks } from '../../store';
import { calculateTimelineWidth } from '../../core/Utils/Timeline';

interface TimelineScrollableProps {
  onScroll?: React.UIEventHandler<any>;
  scrollbarRef?: RefObject<Scrollbars>;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineTrackArea = styled(ScrollableContainer)`
  min-width: 100%;
  min-height: 100%;
  padding: 0px;
  gap: 0px;
  user-select: none;
`;

const StyledTimelineTrackControlBackground = styled.div`
  position: absolute;
  width: ${TIMELINE_OFFSET_X}px;
  height: 100%;
  background-color: ${(props) => props.theme.secondary.surface};
`;

const StyledTimelineTrackWrapper = styled(FlexContainer)`
  min-width: 100%;
  flex-wrap: nowrap;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0px;

  .grabbing:hover {
    cursor: grabbing;
  }
`;

const TimelineTrackArea: React.FC<TimelineScrollableProps> = ((props: TimelineScrollableProps) => {
  const totalLengthMs = useAppSelector(selectTotalLengthMs);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const tracks = useAppSelector(selectTracks);

  const trackAreaRef = useRef<HTMLDivElement>(null);

  const timelineWidth = calculateTimelineWidth(totalLengthMs, currentZoom.zoom);

  useEffect(() => {
    if (!trackAreaRef?.current) return;

    trackAreaRef.current.style.width = timelineWidth + + TIMELINE_OFFSET_X + 'px';
  }, [timelineWidth]);

  return (
    <StyledTimelineTrackArea
      className='timeline-scrollable-area'
      onScroll={props.onScroll}
      ref={props.scrollbarRef}
      innerRef={trackAreaRef}
    >
      <StyledTimelineTrackControlBackground />
      <StyledTimelineTrackWrapper className='timeline-track-area'>
        {
          tracks.map((track) => {
            // Combination of track index and unique ID should do the trick.
            const uniqueKey = `${track.index}_${track.uniqueId}`;

            return (
              <TimelineRow
                track={track}
                key={uniqueKey}
                seekerRef={props.seekerRef}
              />
            );
          })
        }
        <TimelineRowAddButton />
      </StyledTimelineTrackWrapper>
    </StyledTimelineTrackArea>
  );
});

TimelineTrackArea.displayName = 'Timeline Track Area';

export { TimelineTrackArea };
