import React from 'react';
import styled from 'styled-components';
import { forwardRef, useState } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { Icon } from '../Icon';
import { Label } from '../Label';
import { withClickable, withTogglable } from '../../hoc';
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

const BaseFlatButton = forwardRef<HTMLButtonElement, FlatButtonProps>((
  props: FlatButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { togglable, showIcon, iconType, showLabel, label } = props;

  const [ isToggled, setToggled ] = useState(false);

  const toggleButton = () => togglable && setToggled(!isToggled);

  return (
    <StyledFlatButton 
      {...props}
      ref={ref}
      onClick={toggleButton}
      
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
});

BaseFlatButton.displayName = 'Flat Button';

BaseFlatButton.defaultProps = {
  disabled: false,
  togglable: false,
  showBackground: true,
  showIcon: true,
  showLabel: true,
  label: 'Button',
};

export const FlatButton: React.FC<FlatButtonProps> = (
  withTogglable(withClickable(BaseFlatButton)) as any
);
