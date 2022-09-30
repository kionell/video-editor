import React from 'react';
import styled from 'styled-components';
import { withFocusable, withMovableX } from '../../hoc';
import { Icon } from '../../components/Icon';

const StyledTimelineSeekerLine = styled.div`
  width: 2px;
  height: 100%;
  min-height: 300px;
  margin-top: -3px;
`;

const StyledTimelineSeekerWrapper = styled.div`
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
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
        ? props.theme.primary.accentHover
        : props.theme.text.lighter;
    }};
  }

  & > * > svg {
    fill: ${(props) => {
      return props.className?.includes('focused')
        ? props.theme.primary.accentHover
        : props.theme.text.lighter;
    }};
  }
`;

const BaseTimelineSeeker = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <StyledTimelineSeekerWrapper ref={ref} {...props}>
      <Icon 
        size={25} 
        useColor={false} 
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
