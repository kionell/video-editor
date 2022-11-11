import React, { ForwardedRef, HTMLAttributes, MouseEvent, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { withFocusable, withMovableX } from '../../hoc';
import { Icon } from '../../components/Icon';

interface SeekerProps extends HTMLAttributes<HTMLDivElement> {
  onMoveX?: MouseEventHandler;
}

const StyledTimelineSeekerHead = styled(Icon)`
  position: relative;
`;

const StyledTimelineSeekerLine = styled.div`
  width: 2px;
  height: 100%;
  margin-top: -3px;
`;

const StyledTimelineSeekerWrapper = styled.div`
  height: 100%;
  translate: calc(-50% + 40px);
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: none;
  outline: none;
  user-select: none;
  z-index: 2;
  cursor: ew-resize;

  & > * {
    pointer-events: none;
  }

  & > ${StyledTimelineSeekerLine} {
    background: ${(props) => {
      return props.className?.includes('focused')
        ? props.theme.primary.accent
        : props.theme.text.lighter;
    }};
  }

  & > * > svg {
    fill: ${(props) => {
      return props.className?.includes('focused')
        ? props.theme.primary.accent
        : props.theme.text.lighter;
    }};
  }
`;

const BaseTimelineSeeker = React.forwardRef<HTMLDivElement, SeekerProps>((
  props: SeekerProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const stopSeekerMovement = () => {
    if (props.onMoveX) {
      document.removeEventListener('mousemove', props.onMoveX as any);
    }

    document.removeEventListener('mouseup', stopSeekerMovement as any);
  };

  const startSeekerMovement = () => {
    if (props.onMoveX) {
      document.addEventListener('mousemove', props.onMoveX as any);
    }

    document.addEventListener('mouseup', stopSeekerMovement as any);
  }

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <StyledTimelineSeekerWrapper
      {...props}
      ref={ref}
      onClick={handleClick}
      onMouseDown={startSeekerMovement}
    >
      <StyledTimelineSeekerHead
        size={20}
        variant='Seeker'
        className='seeker-icon'
      />
      <StyledTimelineSeekerLine
        className='seeker-line'
      />
    </StyledTimelineSeekerWrapper>
  );
});

BaseTimelineSeeker.displayName = 'Timeline Seeker';

export const TimelineSeeker = withFocusable(withMovableX(BaseTimelineSeeker));
