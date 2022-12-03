import { ForwardedRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Text } from '../Text';
import { FlexContainer, FlexProps } from './FlexContainer';

type LabelPosition = 'left' | 'center' | 'right';

export interface LabeledFlexProps extends FlexProps {
  label?: string;
  labelPosition?: LabelPosition;
}

const StyledLabeledContainerWrapper = styled.div<LabeledFlexProps>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.padding ?? 0}px;
  gap: 16px;

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
        align={props.labelPosition}
        text={props.label}
        weight='Medium'
      />
      <FlexContainer
        {...props}
        ref={ref}
      />
    </StyledLabeledContainerWrapper>
  );
});

LabeledContainer.displayName = 'Labeled Container';

LabeledContainer.defaultProps = {
  labelPosition: 'left',
  label: 'Container',
};

export { LabeledContainer };
