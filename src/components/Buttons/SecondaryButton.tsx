import styled from 'styled-components';
import { forwardRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { withClickable, withTogglable } from '../../hoc';
import { 
  LARGE_ICON_SIZE, 
  NORMAL_FONT_SIZE, 
  NORMAL_ICON_SIZE 
} from '../../constants';

interface SecondaryButtonProps extends ButtonProps {
  largeIcon?: boolean;
  togglable?: boolean;
}

const StyledSecondaryButton = styled(StyledBaseButton)`
  height: 40px;

  background: ${(props) => props.theme.secondary.normal};
  
  &:hover:enabled {
    background: ${(props) => props.theme.secondary.normalHover};
  }

  &.toggled {
    border: 1px solid;
    border-color: ${(props) => props.theme.primary.accent};

    &:hover:enabled {
      border-color: ${(props) => props.theme.primary.accentHover};
    }
  }
`;

const BaseSecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>((
  props: SecondaryButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { showIcon, iconType, largeIcon, showLabel, label } = props;

  return (
    <StyledSecondaryButton ref={ref} {...props}>
      <Icon 
        visible={showIcon} 
        variant={iconType} 
        size={largeIcon ? LARGE_ICON_SIZE : NORMAL_ICON_SIZE}
        useColor={false}
      />
      <Label 
        visible={showLabel} 
        text={label} 
        size={NORMAL_FONT_SIZE}
        useColor={false}
      />
    </StyledSecondaryButton>
  );
});

BaseSecondaryButton.displayName = 'Secondary Button';

BaseSecondaryButton.defaultProps = {
  disabled: false,
  showIcon: true,
  largeIcon: false,
  showLabel: true,
  label: 'Button',
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = (
  withTogglable(withClickable(BaseSecondaryButton)) as any
);
