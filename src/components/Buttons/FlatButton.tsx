import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { 
  SMALL_FONT_SIZE, 
  LARGE_ICON_SIZE 
} from '../../constants';

interface FlatButtonProps extends ButtonProps {
  showBackground?: boolean;
  togglable?: boolean;
}

const StyledFlatButton = styled(StyledBaseButton)<FlatButtonProps>`
  flex-direction: column;
  width: 60px;
  height: 60px;
  padding: 6px 6px;
  gap: 2px;
  border-radius: 0px;
  
  justify-content: ${(props) => {
    return !props.showLabel || !props.showIcon ? 'center' : 'space-between'; 
  }};

  &:not(.toggled) {
    background: ${(props) => props.showBackground ? props.theme.secondary.normal : 'transparent'};
    color: ${(props) => props.theme.text.darker};

    & > * > * {
      fill: ${(props) => props.theme.text.darker};
    }
  }

  &:hover:enabled:not(.toggled) {
    color: ${(props) => props.theme.text.normal};

    & > * > * {
      fill: ${(props) => props.theme.text.normal};
    }
  }

  &.toggled {
    background: ${(props) => props.showBackground ? props.theme.secondary.accent : 'transparent'};
    color: ${(props) => props.theme.text.lighter};

    & > * > * {
      fill: ${(props) => props.theme.text.lighter};
    }
  }
`;

const FlatButton: React.FC<FlatButtonProps> = (props: FlatButtonProps) => {
  const { togglable, showIcon, iconType, showLabel, label } = props;

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
    <StyledFlatButton 
      {...props}
      ref={buttonRef}
      onClick={toggleButton}
      className={isToggled ? 'toggled' : ''}
    >
      <Icon 
        visible={showIcon} 
        variant={iconType} 
        size={LARGE_ICON_SIZE}
        useColor={false}
      />
      <Label 
        visible={showLabel} 
        text={label} 
        size={SMALL_FONT_SIZE}
        weight='Medium'
        useColor={false}
      />
    </StyledFlatButton>
  );
};

FlatButton.defaultProps = {
  disabled: false,
  togglable: false,
  showBackground: true,
  showIcon: true,
  showLabel: true,
  label: 'Button',
};

export { FlatButton };
