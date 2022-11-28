import styled from 'styled-components';
import { useRef, MouseEvent } from 'react';
import { ButtonGroup } from '../Buttons/ButtonGroup';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { TimelineTimecode } from './TimelineTimecode';

import {
  getNextZoomLevel,
  getPreviousZoomLevel,
  getFitZoomLevel,
} from '../../core/Utils/Timeline';

import {
  switchSnapMode,
  setCurrentZoom,
  bringForward,
  sendBackward,
  removeFocusedElements,
} from '../../store/Reducers/TimelineSlice';

const StyledTimelineTools = styled.div`
  height: 50px;
  display: flex;
  position: relative;
  padding: 8px 12px;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.primary.surface};
`;

const StyledTimelineToolButton = styled(SecondaryButton)`
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

  // const onUndoClick = () => {};
  // const onRedoClick = () => {};
  // const onSplitClick = () => {};
  const onBringForwardClick = () => dispatch(bringForward());
  const onSendBackwardClick = () => dispatch(sendBackward());
  const onSnapClick = () => dispatch(switchSnapMode());
  const onDeleteClick = () => dispatch(removeFocusedElements());

  const onZoomOutClick = () => {
    dispatch(setCurrentZoom(getPreviousZoomLevel(timeline)));
  };

  const onZoomInClick = () => {
    dispatch(setCurrentZoom(getNextZoomLevel(timeline)));
  };

  const onZoomFitClick = () => {
    dispatch(setCurrentZoom(getFitZoomLevel(timeline)));
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <StyledTimelineTools>
      <ButtonGroup gap={6}>
        <StyledTimelineToolButton
          iconType='Undo'
          onMouseDown={stopPropagation}
        />
        <StyledTimelineToolButton
          iconType='Redo'
          onMouseDown={stopPropagation}
        />
        <StyledTimelineToolButton
          iconType='Split'
          onMouseDown={stopPropagation}
          disabled={!focusedTracks.length}
        />
        <StyledTimelineToolButton
          iconType='BringForward'
          onClick={onBringForwardClick}
          onMouseDown={stopPropagation}
          disabled={allowBringForward}
        />
        <StyledTimelineToolButton
          iconType='SendBackward'
          onClick={onSendBackwardClick}
          onMouseDown={stopPropagation}
          disabled={allowSendBackward}
        />
        <StyledTimelineToolButton
          iconType='Delete'
          onClick={onDeleteClick}
          onMouseDown={stopPropagation}
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
          onMouseDown={stopPropagation}
          toggled={timeline.snapMode}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Minus'
          onClick={onZoomOutClick}
          onMouseDown={stopPropagation}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Plus'
          onClick={onZoomInClick}
          onMouseDown={stopPropagation}
          disabled={!timeline.totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Fit'
          onClick={onZoomFitClick}
          onMouseDown={stopPropagation}
          disabled={!timeline.totalTracks}
        />
      </ButtonGroup>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
