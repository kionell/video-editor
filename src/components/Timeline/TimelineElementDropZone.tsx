import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';

interface ElementDropZoneProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
}

const StyledTimelineElementDropZoneWrapper = styled.div<ElementDropZoneProps>`
  display: ${(props) => props.visible ? 'flex' : 'none'};
  position: absolute;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border: 2px solid ${(props) => props.theme.primary.accent};
  border-radius: 6px;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
  transform: translateX(-100%);
  background-color: ${(props) => props.theme.primary.accent + '30'};
`;

const TimelineElementDropZone = forwardRef<HTMLDivElement, ElementDropZoneProps>((
  props: ElementDropZoneProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return <StyledTimelineElementDropZoneWrapper {...props} ref={ref} />;
});

TimelineElementDropZone.displayName = 'Timeline Element Drop Zone';

TimelineElementDropZone.defaultProps = {
  visible: false,
};

export { TimelineElementDropZone };
