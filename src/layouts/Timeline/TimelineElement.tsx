import { forwardRef, ForwardedRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { withDraggable, withResizable, withFocusable } from '../../hoc';
import { Icon } from '../../components/Icon';
import { BaseElement } from '../../core/Elements/BaseElement';
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
  z-index: 1;

  .timeline-element__preview {
    border: 2px solid ${(props) => props.theme.primary.press};
  }
  
  .timeline-element__edges {
    background: transparent;
    visibility: visible;
  }

  &:not(.focused) {
    .timeline-element__edges {
      visibility: hidden;
    }

    .timeline-element__preview {
      border: none;
    }
  }

  &:hover:not(.focused) {
    .timeline-element__preview {
      border: 2px solid ${(props) => props.theme.primary.hover};
    }
  }
`;

const StyledTimelineElementEdge = styled.div`
  width: 10px;
  height: 100%;
  visibility: hidden;
  z-index: 1;
  display: flex;
  align-items: center;
  cursor: ew-resize;
`;

const StyledTimelineElementLeftEdge = styled(StyledTimelineElementEdge)`
  justify-content: flex-end;
`;

const StyledTimelineElementRightEdge = styled(StyledTimelineElementEdge)`
  justify-content: flex-start;
`;

const StyledTimelineElementEdgeIcon = styled(Icon)`
  width: 4px;
  height: 25px;
  fill: ${(props) => props.theme.primary.press};
`;

const StyledTimelineElementPreview = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  border-radius: 6px;
  background-repeat: no-repeat;

  ${(props) => {
    const baseColor = props.theme.secondary.accent;
    const highlightColor = props.theme.secondary.hover;

    return css`
      background-color: ${highlightColor};
      background-image: linear-gradient(to top, ${baseColor}BB 10%, ${baseColor}60 50%, ${baseColor}20 100%);
    `;
  }}
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

  return (
    <StyledTimelineElementWrapper className='timeline-element' ref={ref} {...props}>
      <StyledTimelineElementLeftEdge className='timeline-element__edges resizer-left'>
        <StyledTimelineElementEdgeIcon variant='Edge' />
      </StyledTimelineElementLeftEdge>

      <StyledTimelineElementPreview className='timeline-element__preview'>

      </StyledTimelineElementPreview>

      <StyledTimelineElementRightEdge className='timeline-element__edges resizer-right'>
        <StyledTimelineElementEdgeIcon variant='Edge' />
      </StyledTimelineElementRightEdge>
    </StyledTimelineElementWrapper>
  );
});

BaseTimelineElement.displayName = 'Timeline Element';

export const TimelineElement = withFocusable(withResizable(withDraggable(BaseTimelineElement)));
