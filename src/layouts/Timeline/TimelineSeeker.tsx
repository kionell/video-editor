import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { withFocusable, withMovableX } from '../../hoc';
import { Icon } from '../../components/Icon';

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

const BaseTimelineSeeker = React.forwardRef<HTMLDivElement>((props, ref) => {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };
  
  return (
    <StyledTimelineSeekerWrapper {...props} ref={ref} onClick={handleClick}>
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
