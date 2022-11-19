import styled from 'styled-components';
import { forwardRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';

const StyledPrimaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.primary.accent};

  &:hover:enabled {
    background: ${(props) => props.theme.primary.hover};
  }

  &:active:enabled {
    background: ${(props) => props.theme.primary.press};
  }
`;

const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
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

PrimaryButton.displayName = 'Primary Button';

export { PrimaryButton };
