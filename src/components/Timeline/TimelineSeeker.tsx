import React, { MouseEvent, RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SeekerMoveState, useSeekerMove } from '../../hooks/useSeekerMove';
import { Icon } from '../Icon';
import { TIMELINE_OFFSET_X } from '../../constants';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { timeMsToUnits, unitsToTimeMs } from '../../core/Utils/Timeline';
import { clamp } from '../../core/Utils/Math';
import { setLastSeekTimeMs } from '../../store/Reducers/TimelineSlice';
import {
  selectScrollLeft,
  selectCurrentTimeMs,
  selectCurrentZoom,
  selectTotalLengthMs,
} from '../../store/Selectors';

interface SeekerProps {
  seekerRef?: RefObject<HTMLDivElement>;
}

const StyledTimelineSeekerHead = styled(Icon)`
  position: relative;
`;

const StyledTimelineSeekerLine = styled.div`
  width: 2px;
  height: 100%;
  margin-top: -3px;
`;

const StyledTimelineSeekerWrapper = styled.div<SeekerProps>`
  height: 100%;
  transform: translateX(calc(-50% + ${TIMELINE_OFFSET_X}px));
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: none;
  outline: none;
  user-select: none;
  z-index: 999;
  cursor: ew-resize;
  pointer-events: painted;

  & > * {
    pointer-events: none;
  }

  & > ${StyledTimelineSeekerLine} {
    background: ${(props) => props.theme.text.lighter};
  }

  & > * > svg {
    fill: ${(props) => props.theme.text.lighter};
  }
`;

const TimelineSeeker: React.FC<SeekerProps> = (props: SeekerProps) => {
  const seekerRef = props.seekerRef ?? useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const scrollX = useAppSelector(selectScrollLeft);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const currentTimeMs = useAppSelector(selectCurrentTimeMs);
  const totalLengthMs = useAppSelector(selectTotalLengthMs);

  console.log('Seeker render');

  const updatePosByTime = () => {
    if (!seekerRef.current) return;

    const seekerX = timeMsToUnits(currentTimeMs, currentZoom.zoom);

    seekerRef.current.style.left = seekerX - scrollX + 'px';
  };

  const onSeekerMove = (state: SeekerMoveState) => {
    const seekerX = state.seekerX;
    const timeMs = unitsToTimeMs(seekerX, currentZoom.zoom);
    const clampedTimeMs = clamp(timeMs, 0, totalLengthMs);

    dispatch(setLastSeekTimeMs(clampedTimeMs));
  };

  useSeekerMove(seekerRef, onSeekerMove);

  /**
   * 1) Updates seeker position relatively to the current zoom.
   * 2) Updates seeker position on current time change.
   * 3) Updates seeker position on scroll.
   */
  useEffect(updatePosByTime, [ currentZoom, currentTimeMs, scrollX ]);

  const startSeekerMovement = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <StyledTimelineSeekerWrapper
      className='timeline-seeker'
      ref={seekerRef}
      onMouseDown={startSeekerMovement}
    >
      <StyledTimelineSeekerHead
        size={20}
        variant='Seeker'
        className='timeline-seeker-icon'
      />
      <StyledTimelineSeekerLine
        className='timeline-seeker-line'
      />
    </StyledTimelineSeekerWrapper>
  );
};

export { TimelineSeeker };
