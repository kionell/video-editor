import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { RefObject, useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineRow } from './TimelineRow';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TIMELINE_OFFSET_X } from '../../constants';
import { TimelineRowAddButton } from './TimelineRowAddButton';

interface TimelineScrollableProps {
  onScroll?: React.UIEventHandler<any>;
  scrollbarRef?: RefObject<Scrollbars>;
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineTrackArea = styled(ScrollableContainer)`
  min-width: 100%;
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
  const timeline = useAppSelector((state) => state.timeline);

  const trackAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackAreaRef?.current) return;

    trackAreaRef.current.style.width = timeline.width + 'px';
  }, [timeline.width]);

  return (
    <StyledTimelineTrackArea
      onScroll={props.onScroll}
      ref={props.scrollbarRef}
      innerRef={trackAreaRef}
    >
      <StyledTimelineTrackControlBackground />
      <StyledTimelineTrackWrapper className='timeline-track-area'>
        {
          timeline.tracks.map((track) => {
            // Combination of track index and unique ID should do the trick.
            const uniqueKey = `${track.index}_${track.uniqueId}`;

            return (
              <TimelineRow
                track={track}
                key={uniqueKey}
                scrollbarRef={props.scrollbarRef}
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
