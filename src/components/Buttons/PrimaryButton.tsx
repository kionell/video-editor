import styled from 'styled-components';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';
import { useRef } from 'react';

const StyledPrimaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.primary.accent};

  &:hover:enabled {
    background: ${(props) => props.theme.primary.hover};
  }

  &:active:enabled {
    background: ${(props) => props.theme.primary.press};
  }
`;

const PrimaryButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    showIcon,
    iconType,
    iconSize,
    showLabel,
    label,
  } = props;

  const buttonRef = props.buttonRef ?? useRef<HTMLButtonElement>(null);

  return (
    <StyledPrimaryButton ref={buttonRef} {...props}>
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
};

PrimaryButton.defaultProps = {
  showLabel: false,
  label: 'Button',
};

export { PrimaryButton };
