import styled from 'styled-components';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { Text } from '../../components/Text';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentZoom, setSnapMode } from '../../store/Reducers/timelineSlice';
import { formatTimeMs } from '../../utils/format';

const StyledTimelineTools = styled.div`
  height: 45px;
  display: flex;
  position: relative;
  padding: 6px 12px;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  background: ${(props) => props.theme.primary.surface};
`;

const StyledTimelineToolButton = styled(SecondaryButton)`
  width: 40px;
  height: 35px;
`;

const TimelineTools: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();
  
  const snapButtonRef = useRef(null);
  const currentTimeRef = useRef<HTMLLabelElement>(null);
  const durationRef = useRef<HTMLLabelElement>(null);

  const onZoomOutClick = () => {
    const zoomLevel = timeline.getPreviousZoomLevel();

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onZoomInClick = () => {
    const zoomLevel = timeline.getNextZoomLevel();

    dispatch(setCurrentZoom(zoomLevel));
  };

  // const onZoomFitClick = () => {
  //   dispatch(setCurrentZoom(2));
  // };

  const onSnapClick = () => {
    dispatch(setSnapMode(!timeline.snapMode));
  };

  useEffect(() => {
    if (!currentTimeRef.current) return;

    currentTimeRef.current.innerText = formatTimeMs(timeline.currentTimeMs);
  }, [timeline.currentTimeMs]);

  useEffect(() => {
    if (!durationRef.current) return;

    durationRef.current.innerText = formatTimeMs(timeline.totalLengthMs);
  }, [timeline.totalLengthMs]);

  return (
    <StyledTimelineTools>
      <FlexContainer gap={6} padding={0}>
        <StyledTimelineToolButton showLabel={false} iconType='Undo' />
        <StyledTimelineToolButton showLabel={false} iconType='Redo' />
        <StyledTimelineToolButton showLabel={false} iconType='Split' />
        <StyledTimelineToolButton showLabel={false} iconType='BringForward' />
        <StyledTimelineToolButton showLabel={false} iconType='SendBackward' />
        <StyledTimelineToolButton showLabel={false} iconType='Delete' />
      </FlexContainer>

      <FlexContainer gap={5} padding={0} className='timeline-time'>
        <Text
          className='timeline-time-current'
          text='00:00:00.00'
          useColor={false}
          ref={currentTimeRef}
        />
        <Text
          className='timeline-time-delimiter'
          text='/'
          useColor={false}
        />
        <Text
          className='timeline-time-duration'
          text='00:00:00.00'
          useColor={false}
          ref={durationRef}
        />
      </FlexContainer>

      <FlexContainer gap={6} padding={0}>
        <ButtonGroup>
          <StyledTimelineToolButton 
            showLabel={false} 
            iconType='Snap' 
            ref={snapButtonRef} 
            onClick={onSnapClick}
          />
        </ButtonGroup>
        <StyledTimelineToolButton showLabel={false} iconType='Minus' onClick={onZoomOutClick} />
        <StyledTimelineToolButton showLabel={false} iconType='Plus' onClick={onZoomInClick} />
        <StyledTimelineToolButton showLabel={false} iconType='Fit' />
      </FlexContainer>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
