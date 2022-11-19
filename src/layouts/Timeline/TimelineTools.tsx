import styled from 'styled-components';
import { useRef, MouseEvent } from 'react';
import { SecondaryButton } from '../../components/Buttons/SecondaryButton';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { TimelineTimecode } from './TimelineTimecode';
import { ButtonGroup } from '../../components/Buttons/ButtonGroup';
import { FlexContainer } from '../../components/Containers/FlexContainer';

import {
  getNextZoomLevel,
  getPreviousZoomLevel,
  getFitZoomLevel,
} from '../../core/Utils/Timeline';

import {
  setSnapMode,
  setCurrentZoom,
  bringForward,
  sendBackward,
  removeFocusedElements,
} from '../../store/Reducers/TimelineSlice';

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

const StyledTimelineTimecodeWrapper = styled(FlexContainer)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  padding: 0px;
  gap: 0px;
`;

const TimelineTools: React.FC = () => {
  const timeline = useAppSelector((state) => state.timeline);
  const dispatch = useAppDispatch();
  const snapButtonRef = useRef(null);

  const focusedTracks = timeline.focusedTracks;
  const firstFocusedTrack = focusedTracks.at(0) ?? null;
  const lastFocusedTrack = focusedTracks.at(-1) ?? null;

  const allowBringForward = !focusedTracks.length
    || timeline.totalTracks < 2
    || !firstFocusedTrack
    || firstFocusedTrack.index <= 0;

  const allowSendBackward = !focusedTracks.length
    || timeline.totalTracks < 2
    || !lastFocusedTrack
    || lastFocusedTrack.index >= timeline.totalTracks - 1;

  const onUndoClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const onRedoClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const onSplitClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const onBringForwardClick = (event: MouseEvent) => {
    event.stopPropagation();

    dispatch(bringForward());
  };

  const onSendBackwardClick = (event: MouseEvent) => {
    event.stopPropagation();

    dispatch(sendBackward());
  };

  const onDeleteClick = (event: MouseEvent) => {
    event.stopPropagation();

    dispatch(removeFocusedElements());
  };

  const onZoomOutClick = (event: MouseEvent) => {
    event.stopPropagation();

    const zoomLevel = getPreviousZoomLevel(timeline);

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onZoomInClick = (event: MouseEvent) => {
    event.stopPropagation();

    const zoomLevel = getNextZoomLevel(timeline);

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onZoomFitClick = (event: MouseEvent) => {
    event.stopPropagation();

    const zoomLevel = getFitZoomLevel(timeline);

    dispatch(setCurrentZoom(zoomLevel));
  };

  const onSnapClick = (event: MouseEvent) => {
    event.stopPropagation();

    dispatch(setSnapMode(!timeline.snapMode));
  };

  return (
    <StyledTimelineTools>
      <ButtonGroup gap={6}>
        <StyledTimelineToolButton
          iconType='Undo'
          onClick={onUndoClick}
        />
        <StyledTimelineToolButton
          iconType='Redo'
          onClick={onRedoClick}
        />
        <StyledTimelineToolButton
          iconType='Split'
          onClick={onSplitClick}
          disabled={!focusedTracks.length}
        />
        <StyledTimelineToolButton
          iconType='BringForward'
          onClick={onBringForwardClick}
          disabled={allowBringForward}
        />
        <StyledTimelineToolButton
          iconType='SendBackward'
          onClick={onSendBackwardClick}
          disabled={allowSendBackward}
        />
        <StyledTimelineToolButton
          iconType='Delete'
          onClick={onDeleteClick}
          disabled={!timeline.focusedTracks.length}
        />
      </ButtonGroup>

      <StyledTimelineTimecodeWrapper>
        <TimelineTimecode />
      </StyledTimelineTimecodeWrapper>

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
