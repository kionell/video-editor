import styled from 'styled-components';
import { ForwardedRef, forwardRef, RefObject } from 'react';
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars-2';
import { FlexProps, FlexContainer } from './FlexContainer';

type ScrollableProps = FlexProps & ScrollbarProps & {
  innerRef?: RefObject<HTMLDivElement>;
};

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
  const { onScroll, innerRef, ...rest } = props;

  return (
    <StyledScrollbars
      hideTracksWhenNotNeeded
      autoHide
      onScroll={onScroll}
      ref={ref}
    >
      <FlexContainer {...rest } ref={innerRef} />
    </StyledScrollbars>
  );
});

ScrollableContainer.displayName = 'Scrollable Container';

export { ScrollableContainer };
