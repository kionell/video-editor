import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineRow } from './TimelineRow';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { TIMELINE_OFFSET_X } from '../../constants';

interface TimelineScrollableProps {
  onScroll?: React.UIEventHandler<any>;
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
`;

const TimelineTrackArea = forwardRef<Scrollbars, TimelineScrollableProps>((
  props: TimelineScrollableProps,
  ref: ForwardedRef<Scrollbars>,
) => {
  const timeline = useAppSelector((state) => state.timeline);

  const trackAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackAreaRef?.current) return;

    trackAreaRef.current.style.width = timeline.width + 'px';
  }, [timeline.width]);

  return (
    <StyledTimelineTrackArea onScroll={props.onScroll} ref={ref} innerRef={trackAreaRef}>
      <StyledTimelineTrackControlBackground />
      <StyledTimelineTrackWrapper>
        {
          timeline.tracks.map((track) => {
            return <TimelineRow track={track} key={track.index}/>;
          })
        }
      </StyledTimelineTrackWrapper>
    </StyledTimelineTrackArea>
  );
});

TimelineTrackArea.displayName = 'Timeline Track Area';

export { TimelineTrackArea };
