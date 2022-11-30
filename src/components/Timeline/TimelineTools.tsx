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

import {
  selectAllowBringForward,
  selectAllowSendBackward,
  selectCurrentScroll,
  selectCurrentZoom,
  selectFocusedTotalTracks,
  selectSnapMode,
  selectTotalLengthMs,
  selectTotalTracks,
} from '../../store';

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
  width: 42px;
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
  const snapMode = useAppSelector(selectSnapMode);

  const currentScroll = useAppSelector(selectCurrentScroll);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const totalTracks = useAppSelector(selectTotalTracks);
  const totalLengthMs = useAppSelector(selectTotalLengthMs);
  const focusedTotalTracks = useAppSelector(selectFocusedTotalTracks);
  const allowBringForward = useAppSelector(selectAllowBringForward);
  const allowSendBackward = useAppSelector(selectAllowSendBackward);

  const dispatch = useAppDispatch();
  const snapButtonRef = useRef(null);

  // const onUndoClick = () => {};
  // const onRedoClick = () => {};
  // const onSplitClick = () => {};
  const onBringForwardClick = () => dispatch(bringForward());
  const onSendBackwardClick = () => dispatch(sendBackward());
  const onSnapClick = () => dispatch(switchSnapMode());
  const onDeleteClick = () => dispatch(removeFocusedElements());

  const onZoomOutClick = () => {
    const previousZoom = getPreviousZoomLevel(currentZoom);

    dispatch(setCurrentZoom(previousZoom));
  };

  const onZoomInClick = () => {
    const nextZoom = getNextZoomLevel(currentZoom);

    dispatch(setCurrentZoom(nextZoom));
  };

  const onZoomFitClick = () => {
    const fitZoom = getFitZoomLevel(totalLengthMs, currentScroll, currentZoom);

    dispatch(setCurrentZoom(fitZoom));
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
          disabled={!focusedTotalTracks}
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
          disabled={!focusedTotalTracks}
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
          toggled={snapMode}
          disabled={!totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Minus'
          onClick={onZoomOutClick}
          onMouseDown={stopPropagation}
          disabled={!totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Plus'
          onClick={onZoomInClick}
          onMouseDown={stopPropagation}
          disabled={!totalTracks}
        />
        <StyledTimelineToolButton
          iconType='Fit'
          onClick={onZoomFitClick}
          onMouseDown={stopPropagation}
          disabled={!totalTracks}
        />
      </ButtonGroup>
    </StyledTimelineTools>
  );
};

export { TimelineTools };
