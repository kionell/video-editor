import React from 'react';
import styled from 'styled-components';
import { forwardRef } from 'react';
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
  justify-content: center;
  padding: 6px;
  gap: 8px;
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

const BaseFlatButton = forwardRef<HTMLButtonElement, FlatButtonProps>((
  props: FlatButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { showIcon, iconType, showLabel, label } = props;

  return (
    <StyledFlatButton ref={ref} {...props}>
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
  showBackground: true,
  togglable: false,
};

export const FlatButton: React.FC<FlatButtonProps> = (
  withTogglable(withClickable(BaseFlatButton)) as any
);
