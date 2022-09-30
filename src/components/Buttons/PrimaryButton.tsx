import styled from 'styled-components';
import { forwardRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Label } from '../Label';
import { withClickable } from '../../hoc';

const StyledPrimaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.primary.accent};

  &:hover:enabled {
    background: ${(props) => props.theme.primary.accentHover};
  }
`;

const BasePrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>((
  props: ButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { showIcon, iconType, iconSize, showLabel, label } = props;

  return (
    <StyledPrimaryButton ref={ref} {...props}>
      <Icon 
        visible={showIcon} 
        variant={iconType}
        size={getIconSizeBySizeType(iconSize)}
        useColor={false}
      />
      <Label 
        visible={showLabel} 
        text={label} 
        useColor={false}
      />
    </StyledPrimaryButton>
  );
});

BasePrimaryButton.displayName = 'Primary Button';

export const PrimaryButton = withClickable(BasePrimaryButton);
