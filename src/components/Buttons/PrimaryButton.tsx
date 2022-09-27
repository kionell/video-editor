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

interface PrimaryButtonProps extends ButtonProps {
  largeIcon?: boolean;
}

const StyledPrimaryButton = styled(StyledBaseButton)`
  height: 40px;

  background: ${(props) => props.theme.primary.accent};

  &:hover:enabled {
    background: ${(props) => props.theme.primary.accentHover};
  }
`;

const BasePrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>((
  props: PrimaryButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { showIcon, iconType, largeIcon, showLabel, label } = props;

  return (
    <StyledPrimaryButton 
      {...props}
      ref={ref}
      onClick={() => void 0}
    >
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
    </StyledPrimaryButton>
  );
});

BasePrimaryButton.displayName = 'Primary Button';

BasePrimaryButton.defaultProps = {
  disabled: false,
  showIcon: true,
  largeIcon: false,
  showLabel: true,
  label: 'Button',
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = (
  withTogglable(withClickable(BasePrimaryButton)) as any
);
