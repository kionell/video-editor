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
  height: 50px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border-left: none;
  border-right: none;
  border-radius: 6px;
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
  height: 100%;
  visibility: hidden;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ew-resize;
`;

const StyledTimelineElementEdgeIcon = styled(Icon)`
  width: 15px;
  height: 25px;
  fill: ${(props) => props.theme.primary.accent};
`;

const StyledTimelineElementPreview = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 6px;
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
  }, [timeline.currentZoom, timeline.totalLengthMs, timeline.totalTracks]);

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <StyledTimelineElementWrapper ref={ref} {...props} onClick={handleClick}>
      <StyledTimelineElementEdge className='edges'>
        <StyledTimelineElementEdgeIcon variant='Edge' />
      </StyledTimelineElementEdge>

      <StyledTimelineElementPreview className='preview'>

      </StyledTimelineElementPreview>

      <StyledTimelineElementEdge className='edges'>
        <StyledTimelineElementEdgeIcon variant='Edge' />
      </StyledTimelineElementEdge>
    </StyledTimelineElementWrapper>
  );
});

BaseTimelineElement.displayName = 'Timeline Element';

export const TimelineElement = (
  withDraggable(withFocusable(withStretchableX(BaseTimelineElement)))
);
