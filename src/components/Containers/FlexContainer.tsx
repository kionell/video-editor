import { HTMLAttributes, MouseEventHandler } from 'react';
import styled from 'styled-components';

type FlexDirection = 'row' | 'column';
type FlexJustifying = 'center' | 'space-between' | 'space-around';
type FlexAligning = 'start' | 'end' | 'center';

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  reversed?: boolean;
  justify?: FlexJustifying;
  align?: FlexAligning;
  padding?: number;
  gap?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const StyledFlexContainer = styled.div<FlexProps>`
  display: flex;
  position: relative;
  padding: ${(props) => props.padding}px;
  gap: ${(props) => props.gap}px;

  flex-direction: ${(props) => {
    return props.direction + (props.reversed ? '-reverse' : '');
  }};

  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
`;

const FlexContainer: React.FC<FlexProps> = (props: FlexProps) => {
  return <StyledFlexContainer {...props}></StyledFlexContainer>;
};

FlexContainer.defaultProps = {
  direction: 'row',
  reversed: false,
  justify: 'center',
  align: 'center',
  padding: 5,
  gap: 5,
};

export { FlexContainer };
