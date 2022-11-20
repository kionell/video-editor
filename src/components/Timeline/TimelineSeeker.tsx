import React, { ForwardedRef, HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useMovableX } from '../../hooks/useMovableX';
import { Icon } from '../Icon';
import { TIMELINE_OFFSET_X } from '../../constants';

interface SeekerProps extends HTMLAttributes<HTMLDivElement> {
  onMove?: MouseEventHandler;
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
  translate: calc(-50% + ${TIMELINE_OFFSET_X}px);
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

const TimelineSeeker = React.forwardRef<HTMLDivElement, SeekerProps>((
  props: SeekerProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const { onMove, ...rest } = props;

  useMovableX(ref);

  const stopSeekerMovement = () => {
    if (onMove) {
      document.removeEventListener('mousemove', onMove as any);
    }

    document.removeEventListener('mouseup', stopSeekerMovement);
  };

  const startSeekerMovement = (event: MouseEvent) => {
    event.stopPropagation();

    if (onMove) {
      document.addEventListener('mousemove', onMove as any);
    }

    document.addEventListener('mouseup', stopSeekerMovement);
  }

  return (
    <StyledTimelineSeekerWrapper
      {...rest}
      className='timeline-seeker'
      ref={ref}
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
});

TimelineSeeker.displayName = 'Timeline Seeker';

export { TimelineSeeker };
