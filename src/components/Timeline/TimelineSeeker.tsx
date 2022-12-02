import React, { MouseEvent, RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useMovableX } from '../../hooks/useMovableX';
import { Icon } from '../Icon';
import { TIMELINE_OFFSET_X } from '../../constants';
import { useAppSelector } from '../../hooks/useAppSelector';
import { timeMsToUnits } from '../../core/Utils/Timeline';
import {
  selectScrollLeft,
  selectCurrentTimeMs,
  selectCurrentZoom,
} from '../../store';

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

  const scrollX = useAppSelector(selectScrollLeft);
  const currentZoom = useAppSelector(selectCurrentZoom);
  const currentTimeMs = useAppSelector(selectCurrentTimeMs);

  const updatePosByTime = () => {
    if (!seekerRef.current) return;

    const seekerX = timeMsToUnits(currentTimeMs, currentZoom.zoom);

    seekerRef.current.style.left = seekerX - scrollX + 'px';
  };

  useMovableX(seekerRef, {
    moveCallback: updatePosByTime,
  });

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
