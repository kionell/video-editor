import { PropsWithChildren } from 'react';
import styled from 'styled-components';

type FlexDirection = 'row' | 'column';
type FlexJustifying = 'center' | 'space-between' | 'space-around';
type FlexAligning = 'start' | 'end' | 'center';

interface FlexProps {
  direction?: FlexDirection;
  reversed?: boolean;
  justify?: FlexJustifying;
  align?: FlexAligning;
}

const StyledFlexContainer = styled.div<FlexProps>`
  padding: 6px;
  display: flex;
  flex-direction: ${(props) => {
    return props.direction + (props.reversed ? '-reverse' : '');
  }};

  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
`;

const FlexContainer: React.FC<PropsWithChildren<FlexProps>> = (props: FlexProps) => {
  return <StyledFlexContainer {...props}></StyledFlexContainer>;
};

FlexContainer.defaultProps = {
  direction: 'row',
  reversed: false,
  justify: 'center',
  align: 'center',
};

export { FlexContainer };
