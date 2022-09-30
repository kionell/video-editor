import styled from 'styled-components';
import { forwardRef } from 'react';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Label } from '../Label';
import { withClickable } from '../../hoc';

interface SecondaryButtonProps extends ButtonProps {
  togglable?: boolean;
}

const StyledSecondaryButton = styled(StyledBaseButton)`
  height: 40px;

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

const BaseSecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>((
  props: SecondaryButtonProps, 
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const { showIcon, iconType, iconSize, showLabel, label } = props;

  return (
    <StyledSecondaryButton ref={ref} {...props}>
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

BaseSecondaryButton.defaultProps = {
  togglable: true,
};

export const SecondaryButton = withClickable(BaseSecondaryButton);
