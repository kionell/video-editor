import styled from 'styled-components';
import { forwardRef, useEffect } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';

const StyledSecondaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.secondary.accent};
  
  &:hover:enabled {
    background: ${(props) => props.theme.secondary.hover};
  }

  &:active:enabled {
    background: ${(props) => props.theme.secondary.press};
  }

  &.toggled {
    outline: 1px solid;
    outline-color: ${(props) => props.theme.primary.accent};

    &:hover:enabled {
      outline-color: ${(props) => props.theme.primary.hover};
    }

    &:active:enabled {
      outline-color: ${(props) => props.theme.primary.press};
    }
  }
`;

const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { showIcon, iconType, iconSize, showLabel, label, toggled } = props;

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    const hasToggled = ref.current.classList.contains('toggled');

    if (toggled && !hasToggled) {
      ref.current.classList.add('toggled');
    }
    else if (!toggled && hasToggled) {
      ref.current.classList.remove('toggled');
    }
  }, [toggled]);

  return (
    <StyledSecondaryButton
      {...props}
      ref={ref}
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
});

SecondaryButton.displayName = 'Secondary Button';

export { SecondaryButton };
