import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRef } from 'react';
import { TimelineTools } from './TimelineTools';
import { TimelineRuler } from './TimelineRuler';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { TimelineTrackArea } from './TimelineTrackArea';
import { ScrollableContainer } from '../../components/Containers/ScrollableContainer';
import { setCurrentScroll } from '../../store/Reducers/timelineSlice';

const StyledTimeline = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => props.theme.other.primary};
`;

const StyledTimelinableContainer = styled(ScrollableContainer)`
  width: 100%;
  height: 100%;
  gap: 0;
  padding: 0;
`;

const Timeline: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();
  const scrollbarRef = useRef<Scrollbars>(null);
  
  const onScroll = () => {
    if (!scrollbarRef.current) return;

    const currentScroll = scrollbarRef.current.getScrollLeft();

    dispatch(setCurrentScroll(currentScroll));
  };

  return (
    <StyledTimeline>
      <TimelineTools />
        <TimelineRuler 
          zoom={timeline.currentZoom} 
          scrollPos={timeline.currentScroll}
        />
        <StyledTimelinableContainer onScroll={onScroll} ref={scrollbarRef}>
          <TimelineTrackArea />
        </StyledTimelinableContainer>
    </StyledTimeline>
  );
};

export { Timeline };
