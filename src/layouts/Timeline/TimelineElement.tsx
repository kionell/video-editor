import { forwardRef, ForwardedRef, useEffect, MouseEvent } from 'react';
import styled, { css } from 'styled-components';
import { withDraggable, withFocusable, withStretchableX } from '../../hoc';
import { Icon } from '../../components/Icon';
import { BaseElement } from '../../models/Elements/BaseElement';
import { useAppSelector } from '../../hooks/useAppSelector';

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
  cursor: pointer;

  .edges {
    background: transparent;
  }

  ${(props) => {
    const isFocused = props.className?.includes('focused');
    const accentColor = props.theme.primary.accent;
    const hoverColor = props.theme.primary.hover;

    return css`
      .preview {
        border: ${isFocused ? `2px solid ${accentColor}` : 'none'};
      }
      
      .edges {
        visibility: ${isFocused ? 'visible' : 'hidden'};
      }

      &:hover:not(.focused) {
        .preview {
          border: 2px solid ${hoverColor};
        }
        
        .edges {
          display: ${isFocused ? 'visible' : 'hidden'};
        }
      }
    `;
  }};
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
  border-radius: 8px;
  background-color: ${(props) => props.theme.text.lighter};
  background-image: linear-gradient(to top, #202020bb 5%, #40404060 50%, transparent 100%);
  background-repeat: no-repeat;
  pointer-events: none;
`;

const BaseTimelineElement = forwardRef<HTMLDivElement, ElementProps>((
  props: ElementProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const timeline = useAppSelector((state) => state.timeline);

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    const durationMs = props.element.durationMs;
    const units = timeline.timeMsToUnits(durationMs);

    ref.current.style.width = units + 'px';
  }, [timeline.currentZoom]);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <StyledTimelineElementWrapper ref={ref} {...props} onClick={handleClick}>
      <StyledTimelineElementEdge className='edges edge-left'>
        <Icon variant='Edge' size={25} className='edge-lines' />
      </StyledTimelineElementEdge>

      <StyledTimelineElementPreview className='preview'>

      </StyledTimelineElementPreview>

      <StyledTimelineElementEdge className='edges edge-right'>
        <Icon variant='Edge' size={25} className='edge-lines' />
      </StyledTimelineElementEdge>
    </StyledTimelineElementWrapper>
  );
});

BaseTimelineElement.displayName = 'Timeline Element';

export const TimelineElement = (
  withDraggable(withFocusable(withStretchableX(BaseTimelineElement)))
);
