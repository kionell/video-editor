import styled from 'styled-components';
import { ForwardedRef, forwardRef } from 'react';
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars-2';
import { FlexProps, FlexContainer } from './FlexContainer';

type ScrollableProps = FlexProps | ScrollbarProps;

const StyledScrollbars = styled(Scrollbars)`
  width: 100%;
  height: 100%;

  & > *::-webkit-scrollbar {
    display: none;
  }

  & > * {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    margin: 0 !important; /* Overwrites negative margin from scrollbar lib */
  }
`;

const ScrollableContainer = forwardRef<Scrollbars, ScrollableProps>((
  props: ScrollableProps,
  ref: ForwardedRef<Scrollbars>,
) => {
  return (
    <StyledScrollbars
      hideTracksWhenNotNeeded
      autoHide
      onScroll={props.onScroll}
      ref={ref}
    >
      <FlexContainer {...props as FlexProps} />
    </StyledScrollbars>
  );
});

ScrollableContainer.displayName = 'Scrollable Container';

export { ScrollableContainer };
