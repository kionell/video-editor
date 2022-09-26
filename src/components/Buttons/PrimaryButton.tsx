import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
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

const PrimaryButton: React.FC<PrimaryButtonProps> = (props: PrimaryButtonProps) => {
  const { showIcon, iconType, largeIcon, showLabel, label } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    if (props.onClick) {
      buttonRef.current.addEventListener('click', props.onClick);
    }

    return () => {
      if (props.onClick) { 
        buttonRef.current?.removeEventListener('click', props.onClick);
      }
    };
  }, []);

  return (
    <StyledPrimaryButton 
      {...props}
      ref={buttonRef}
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
};

PrimaryButton.defaultProps = {
  disabled: false,
  showIcon: true,
  largeIcon: false,
  showLabel: true,
  label: 'Button',
};

export { PrimaryButton };
