import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
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

const SecondaryButton: React.FC<SecondaryButtonProps> = (props: SecondaryButtonProps) => {
  const { showIcon, iconType, largeIcon, showLabel, label, togglable } = props;

  const [ isToggled, setToggled ] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleButton = () => togglable && setToggled(!isToggled);

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
    <StyledSecondaryButton
      {...props}
      ref={buttonRef}
      onClick={toggleButton}
      className={isToggled ? 'toggled' : ''}
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
    </StyledSecondaryButton>
  );
};

SecondaryButton.defaultProps = {
  disabled: false,
  togglable: false,
  showIcon: true,
  largeIcon: false,
  showLabel: true,
  label: 'Button',
};

export { SecondaryButton };
