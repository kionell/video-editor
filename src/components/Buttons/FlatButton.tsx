import styled from 'styled-components';
import { useState } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { 
  SMALL_FONT_SIZE, 
  NORMAL_ICON_SIZE 
} from '../../constants';

interface FlatButtonProps extends ButtonProps {
  showBackground?: boolean;
  togglable?: boolean;
}

const StyledFlatButton = styled(StyledBaseButton)<FlatButtonProps>`
  width: 30px;
  height: 30px;
  flex-direction: column;
  justify-content: center;
  padding: 2px 0px;
  gap: 4px;
  border-radius: 0px;

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

  const toggleButton = () => togglable && setToggled(!isToggled);

  return (
    <StyledFlatButton 
      {...props} 
      onClick={toggleButton}
      className={isToggled ? 'toggled' : ''}
    >
      <Icon 
        visible={showIcon} 
        variant={iconType} 
        size={NORMAL_ICON_SIZE}
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
