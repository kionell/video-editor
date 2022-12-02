import styled from 'styled-components';
import { useRef, MouseEvent } from 'react';
import { ButtonGroup } from '../Buttons/ButtonGroup';
import { FlexContainer } from '../Containers/FlexContainer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { TimelineTimecode } from './TimelineTimecode';
import { TimelineButton } from './TimelineButton';

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
  selectCurrentZoom,
  selectFocusedTotalTracks,
  selectScrollLeft,
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

  const scrollX = useAppSelector(selectScrollLeft);
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
    const fitZoom = getFitZoomLevel(totalLengthMs, scrollX, currentZoom.zoom);

    dispatch(setCurrentZoom(fitZoom));
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <StyledTimelineTools>
      <ButtonGroup gap={6}>
        <TimelineButton
          iconType='Undo'
          onMouseDown={stopPropagation}
        />
        <TimelineButton
          iconType='Redo'
          onMouseDown={stopPropagation}
        />
        <TimelineButton
          iconType='Split'
          onMouseDown={stopPropagation}
          disabled={!focusedTotalTracks}
        />
        <TimelineButton
          iconType='BringForward'
          onClick={onBringForwardClick}
          onMouseDown={stopPropagation}
          disabled={allowBringForward}
        />
        <TimelineButton
          iconType='SendBackward'
          onClick={onSendBackwardClick}
          onMouseDown={stopPropagation}
          disabled={allowSendBackward}
        />
        <TimelineButton
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
        <TimelineButton
          iconType='Snap'
          buttonRef={snapButtonRef}
          onClick={onSnapClick}
          onMouseDown={stopPropagation}
          toggled={snapMode}
          disabled={!totalTracks}
        />
        <TimelineButton
          iconType='Minus'
          onClick={onZoomOutClick}
          onMouseDown={stopPropagation}
          disabled={!totalTracks}
        />
        <TimelineButton
          iconType='Plus'
          onClick={onZoomInClick}
          onMouseDown={stopPropagation}
          disabled={!totalTracks}
        />
        <TimelineButton
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
