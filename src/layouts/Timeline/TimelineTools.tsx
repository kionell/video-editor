import styled from 'styled-components';
import { useRef } from 'react';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentZoom, setSnapMode } from '../../store/Reducers/timelineSlice';
import { TimelineTime } from './TimelineTime';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';

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

  label {
    display: none;
  }
`;

const TimelineTools: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();

  const snapButtonRef = useRef(null);

  const onZoomOutClick = () => {
    const zoomLevel = timeline.getPreviousZoomLevel();

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onZoomInClick = () => {
    const zoomLevel = timeline.getNextZoomLevel();

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onZoomFitClick = () => {
    const zoomLevel = timeline.getPreviousZoomLevel();

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onSnapClick = () => {
    dispatch(setSnapMode(!timeline.snapMode));
  };

  return (
    <StyledTimelineTools>
      <ButtonGroup gap={6}>
        <StyledTimelineToolButton iconType='Undo' />
        <StyledTimelineToolButton iconType='Redo' />
        <StyledTimelineToolButton iconType='Split' />
        <StyledTimelineToolButton iconType='BringForward' />
        <StyledTimelineToolButton iconType='SendBackward' />
        <StyledTimelineToolButton iconType='Delete' />
      </ButtonGroup>

      <TimelineTime />

      <ButtonGroup gap={6}>
        <StyledTimelineToolButton
          iconType='Snap'
          ref={snapButtonRef}
          onClick={onSnapClick}
          toggled={timeline.snapMode}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Minus'
          onClick={onZoomOutClick}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Plus'
          onClick={onZoomInClick}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Fit'
          onClick={onZoomFitClick}
          disabled={!timeline.totalTracks}
        />
      </ButtonGroup>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
