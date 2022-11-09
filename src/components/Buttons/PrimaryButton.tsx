import styled from 'styled-components';
import { forwardRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';
import { withClickable } from '../../hoc';

const StyledPrimaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.primary.accent};

  &:hover:enabled {
    background: ${(props) => props.theme.primary.accentHover};
  }
`;

const BasePrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { showIcon, iconType, iconSize, showLabel, label } = props;

  return (
    <StyledPrimaryButton ref={ref} {...props}>
      <Icon 
        visible={showIcon} 
        variant={iconType}
        size={getIconSizeBySizeType(iconSize)}
      />
      <Text
        visible={showLabel}
        text={label}
      />
    </StyledPrimaryButton>
  );
});

BasePrimaryButton.displayName = 'Primary Button';

export const PrimaryButton = withClickable(BasePrimaryButton);
