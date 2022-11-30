import { forwardRef, ForwardedRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../Icon';
import { BaseElement } from '../../core/Elements/BaseElement';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useDraggable } from '../../hooks/useDraggable';
import { useFocusable } from '../../hooks/useFocusable';
import { useTrimmer } from '../../hooks/useTrimmer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  focusElement,
  unfocusElement,
} from '../../store/Reducers/TimelineSlice';
import { selectCurrentZoom } from '../../store';
import { timeMsToUnits } from '../../core/Utils/Timeline';

interface ElementProps {
  element: BaseElement;
}

const StyledTimelineElementWrapper = styled.div<ElementProps>`
  position: absolute;
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
    transition: border 150ms;
    border: 2px solid;
    border-color: ${(props) => props.theme.primary.press};
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
      border-color: transparent;
    }
  }

  &:hover:not(.focused) {
    .timeline-element__preview {
      border-color: ${(props) => props.theme.primary.hover};
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

const TimelineElement = forwardRef<HTMLDivElement, ElementProps>((
  props: ElementProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const dispatch = useAppDispatch();
  const currentZoom = useAppSelector(selectCurrentZoom);
  const element = props.element;

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    const startTimeMs = props.element.startTimeMs;
    const durationMs = props.element.durationMs;

    const left = timeMsToUnits(startTimeMs, currentZoom);
    const width = timeMsToUnits(durationMs, currentZoom);

    ref.current.style.left = left + 'px';
    ref.current.style.width = width + 'px';
  }, [currentZoom]);

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    const units = timeMsToUnits(element.startTimeMs, currentZoom);

    ref.current.style.left = units + 'px';
  }, [element.startTimeMs]);

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    if (element.isFocused && !ref.current.classList.contains('focused')) {
      ref.current.classList.add('focused');
    }

    if (!element.isFocused && ref.current.classList.contains('focused')) {
      ref.current.classList.remove('focused');
    }
  }, [element.isFocused]);

  useFocusable(ref, {
    focusCallback: () => dispatch(focusElement({ element })),
    blurCallback: () => dispatch(unfocusElement({ element })),
    unfocusClasses: [
      'timeline-trackpad',
      'timeline-ruler',
      'timeline-row-track',
      'timeline-track-area',
      'timeline-scrollable-area',
      'timeline-element',
    ],
    shiftClasses: [
      'timeline-element',
    ],
  });

  useTrimmer(ref);
  useDraggable(ref);

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

TimelineElement.displayName = 'Timeline Element';

export { TimelineElement };
