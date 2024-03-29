import { ForwardedRef, forwardRef, HTMLAttributes, MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';

type FlexDirection = 'row' | 'column';
type FlexJustifying = 'start' | 'end' | 'center' | 'space-between' | 'space-around';
type FlexAligning = 'start' | 'end' | 'center';

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  direction?: FlexDirection;
  reversed?: boolean;
  justify?: FlexJustifying;
  align?: FlexAligning;
  padding?: number;
  gap?: number;
  wrapElements?: boolean;
  hideOverflow?: boolean;
  coverArea?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}

const StyledFlexContainer = styled.div<FlexProps>`
  display: flex;
  position: relative;
  background: transparent;
  padding: ${(props) => props.padding}px;
  gap: ${(props) => props.gap}px;
  flex-wrap: ${(props) => props.wrapElements ? 'wrap' : 'nowrap'};
  overflow: ${(props) => props.hideOverflow ? 'hidden' : 'visible'};

  flex-direction: ${(props) => {
    return props.direction + (props.reversed ? '-reverse' : '');
  }};

  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};

  ${(props) => {
    if (!props.fullWidth) return;

    return css`width: 100%;`;
  }}

  ${(props) => {
    if (!props.coverArea) return;

    return css`
      width: 100%;
      height: 100%;
    `;
  }}
`;

const FlexContainer = forwardRef<HTMLDivElement, FlexProps>((
  props: FlexProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return <StyledFlexContainer ref={ref} {...props} />;
});

FlexContainer.displayName = 'Flex Container';

FlexContainer.defaultProps = {
  direction: 'row',
  reversed: false,
  wrapElements: true,
  justify: 'start',
  align: 'start',
  padding: 0,
  gap: 0,
};

export { FlexContainer };
