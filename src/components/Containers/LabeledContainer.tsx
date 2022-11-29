import { ForwardedRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Text } from '../Text';
import { FlexContainer, FlexProps } from './FlexContainer';

export interface LabeledFlexProps extends FlexProps {
  showLabel?: boolean;
  label?: string;
}

const StyledLabeledContainerWrapper = styled.div<LabeledFlexProps>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.padding}px;
  gap: 12px;

  ${(props) => {
    if (!props.coverArea) return;

    return css`
      width: 100%;
      height: 100%;
    `;
  }}
`;

const StyledLabeledContainer = styled(FlexContainer)`
  padding: 0px;
`;

const StyledContainerLabel = styled(Text)`
  color: ${(props) => props.theme.text.normal};
`;

const LabeledContainer = forwardRef<HTMLDivElement, LabeledFlexProps>((
  props: LabeledFlexProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <StyledLabeledContainerWrapper {...props}>
      <StyledContainerLabel
        visible={props.showLabel}
        text={props.label}
        weight='Medium'
      />
      <StyledLabeledContainer
        {...props}
        ref={ref}
      />
    </StyledLabeledContainerWrapper>
  );
});

LabeledContainer.displayName = 'Flex Container';

LabeledContainer.defaultProps = {
  showLabel: true,
};

export { LabeledContainer };
