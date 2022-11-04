import { forwardRef, ForwardedRef } from 'react';
import styled, { css } from 'styled-components';
import { withDraggable, withFocusable, withStretchableX } from '../../hoc';
import { Icon } from '../../components/Icon';
import { BaseElement } from '../../models/Elements/BaseElement';

interface ElementProps {
  element: BaseElement;
}

const StyledTimelineElementWrapper = styled.div<ElementProps>`
  position: relative;
  min-width: 24px;
  height: 50px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border-left: none;
  border-right: none;
  border-radius: 8px;
  overflow: hidden;
  
  width: ${(props) => props.element.durationMs / 100}px;

  ${(props) => {
    const isFocused = props.className?.includes('focused');

    return isFocused && css`
      .preview {
        border-top: 2px solid ${props.theme.primary.accent};
        border-bottom: 2px solid ${props.theme.primary.accent};
      }
      
      .edges {
        visibility: visible;
        background: ${(props) => props.theme.primary.accent};
      }
    `;
  }};

  &:hover:not(.focused) {
    .preview {
      border-top: 2px solid ${(props) => props.theme.primary.accent};
      border-bottom: 2px solid ${(props) => props.theme.primary.accent};
    }
    
    .edges {
      visibility: visible;
      background: ${(props) => props.theme.primary.accent};
    }
  }
`;

const StyledTimelineElementEdge = styled.div`
  width: 12px;
  height: 100%;
  visibility: hidden;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ew-resize;
`;

const StyledTimelineElementPreview = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 10px;
  background-color: white;
  background-image: linear-gradient(to top, #202020bb 5%, #40404060 50%, transparent 100%);
  background-repeat: no-repeat;
  pointer-events: none;
`;

const BaseTimelineElement = forwardRef<HTMLDivElement, ElementProps>((
  props: ElementProps, 
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <StyledTimelineElementWrapper ref={ref} {...props}>
      <StyledTimelineElementEdge className='edges edge-left'>
        <Icon variant='Edge' size={25} className='edge-lines' />
      </StyledTimelineElementEdge>
      
      <StyledTimelineElementPreview className='preview' />
      
      <StyledTimelineElementEdge className='edges edge-right'>
        <Icon variant='Edge' size={25} className='edge-lines' />
      </StyledTimelineElementEdge>
    </StyledTimelineElementWrapper>
  );
});

BaseTimelineElement.displayName = 'Timeline Element';

export const TimelineElement = (
  withFocusable(withStretchableX(BaseTimelineElement))
);
