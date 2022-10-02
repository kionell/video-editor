import styled from 'styled-components';
import { forwardRef } from 'react';
import { useUpdateEffect } from '../../hooks';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Label } from '../Label';
import { withClickable } from '../../hoc';

const StyledSecondaryButton = styled(StyledBaseButton)`
  background: ${(props) => props.theme.secondary.normal};
  
  &:hover:enabled {
    background: ${(props) => props.theme.secondary.normalHover};
  }

  &.toggled {
    outline: 1px solid;
    outline-color: ${(props) => props.theme.primary.accent};

    &:hover:enabled {
      outline-color: ${(props) => props.theme.primary.accentHover};
    }
  }
`;

const BaseSecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { showIcon, iconType, iconSize, showLabel, label, toggled } = props;

  useUpdateEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    ref.current.classList.toggle('toggled');
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
        useColor={false}
      />
      <Label
        visible={showLabel}
        text={label}
        useColor={false}
      />
    </StyledSecondaryButton>
  );
});

BaseSecondaryButton.displayName = 'Secondary Button';

export const SecondaryButton = withClickable(BaseSecondaryButton);
