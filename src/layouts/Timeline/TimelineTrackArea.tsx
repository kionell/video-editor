import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { ForwardedRef, forwardRef, MouseEvent, useEffect, useRef } from 'react';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TimelineTrack } from './TimelineTrack';
import { TimelineTrackControl } from './TimelineTrackControl';

interface TimelineScrollableProps {
  onScroll?: React.UIEventHandler<any>;
}

const StyledTimelineTrackArea = styled(ScrollableContainer)`
  height: 100%;
  flex-wrap: nowrap;
  gap: 0px;
  padding: 0px;
`;

const StyledTimelineTrackContainer = styled(FlexContainer)`
  flex-direction: column;
  padding: 6px 0px;
`;

const StyledTrackControlContainer = styled(StyledTimelineTrackContainer)`
  position: relative;
  width: 40px;
  left: 0px;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.secondary.surface};
`;

const StyledTrackContainer = styled(StyledTimelineTrackContainer)``;

const TimelineTrackArea = forwardRef<Scrollbars, TimelineScrollableProps>((
  props: TimelineScrollableProps,
  ref: ForwardedRef<Scrollbars>,
) => {
  const timeline = useAppSelector((state) => state.timeline);

  const trackAreaRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (!trackAreaRef.current) return;

    trackAreaRef.current.style.width = `calc(100% + ${timeline.width}px)`;
  }, [timeline.width]);

  return (
    <StyledTimelineTrackArea onScroll={props.onScroll} ref={ref}>
      <StyledTrackControlContainer onClick={handleClick}>
        {
          timeline.tracks.map((track, i) => {
            return <TimelineTrackControl track={track} key={i} />;
          })
        }
      </StyledTrackControlContainer>

      <StyledTrackContainer ref={trackAreaRef}>
        {
          timeline.tracks.map((track) => {
            return <TimelineTrack track={track} key={track.index}/>;
          })
        }
      </StyledTrackContainer>
    </StyledTimelineTrackArea>
  );
});

TimelineTrackArea.displayName = 'Timeline Track Area';

export { TimelineTrackArea };
