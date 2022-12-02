import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';

const StyledSecondaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.secondary.accent};
  border: 1px solid;
  border-color: transparent;
  transition: border 100ms ease-in-out;

  &:hover:enabled {
    background: ${(props) => props.theme.secondary.hover};
  }

  &:active:enabled {
    background: ${(props) => props.theme.secondary.press};
  }

  &.toggled {
    border-color: ${(props) => props.theme.primary.accent};

    &:hover:enabled {
      border-color: ${(props) => props.theme.primary.hover};
    }

    &:active:enabled {
      border-color: ${(props) => props.theme.primary.press};
    }
  }
`;

const SecondaryButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    showIcon,
    iconType,
    iconSize,
    showLabel,
    label,
    toggled,
  } = props;

  const buttonRef = props.buttonRef ?? useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const hasToggled = buttonRef.current.classList.contains('toggled');

    if (toggled && !hasToggled) {
      buttonRef.current.classList.add('toggled');
    }
    else if (!toggled && hasToggled) {
      buttonRef.current.classList.remove('toggled');
    }
  }, [toggled]);

  return (
    <StyledSecondaryButton
      {...props}
      ref={buttonRef}
    >
      <Icon
        visible={showIcon}
        variant={iconType}
        size={getIconSizeBySizeType(iconSize)}
      />
      <Text
        visible={showLabel}
        text={label}
      />
    </StyledSecondaryButton>
  );
};

SecondaryButton.defaultProps = {
  showLabel: false,
  label: 'Button',
};

export { SecondaryButton };
