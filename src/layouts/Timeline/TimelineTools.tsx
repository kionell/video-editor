import styled from 'styled-components';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';
import { FlexContainer } from '../../components/Containers/FlexContainer';
import { Text } from '../../components/Text';
import { useRef } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentZoom, setSnapMode } from '../../store/Reducers/timelineSlice';

const StyledTimelineTools = styled.div`
  height: 45px;
  display: flex;
  position: relative;
  padding: 6px 12px;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  background: ${(props) => props.theme.other.primary};

  .timeline-time {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    color: ${(props) => props.theme.text.lighter};
  }
`;

const StyledTimelineToolButton = styled(SecondaryButton)`
  width: 40px;
  height: 35px;
`;

const TimelineTools: React.FC = () => {
  const snapButtonRef = useRef(null);

  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const onZoomOutClick = () => {
    dispatch(setCurrentZoom(timeline.getPreviousZoom()));
  };

  const onZoomInClick = () => {
    dispatch(setCurrentZoom(timeline.getNextZoom()));
  };

  const onZoomFitClick = () => {
    dispatch(setCurrentZoom(2));
  };

  const onSnapClick = () => {
    dispatch(setSnapMode(!timeline.snapMode));
  };

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
        <Text className='timeline-time-current' text='00:00:00.00' useColor={false} />
        <Text className='timeline-time-delimiter' text='/' useColor={false} />
        <Text className='timeline-time-duration' text='00:00:00.00' useColor={false} />
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
        <StyledTimelineToolButton showLabel={false} iconType='Fit' onClick={onZoomFitClick} />
      </FlexContainer>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
