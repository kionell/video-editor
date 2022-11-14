import styled from 'styled-components';
import { forwardRef } from 'react';
import { useUpdateEffect } from '../../hooks';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';
import { withClickable } from '../../hoc';
import { SMALL_FONT_SIZE } from '../../constants';

interface FlatButtonProps extends ButtonProps {
  showBackground?: boolean;
}

const StyledFlatButton = styled(StyledBaseButton)<FlatButtonProps>`
  flex-direction: column;
  justify-content: center;
  padding: 6px;
  gap: 8px;
  border-radius: 0px;

  &:not(.toggled) {
    background: ${(props) => {
      return props.showBackground ? props.theme.secondary.accent : 'transparent';
    }};

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
    background: ${(props) => props.theme.secondary.accent};
    color: ${(props) => props.theme.text.lighter};

    & > * > * {
      fill: ${(props) => props.theme.text.lighter};
    }
  }
`;

const BaseFlatButton = forwardRef<HTMLButtonElement, FlatButtonProps>((props, ref) => {
  const { showIcon, iconType, iconSize, showLabel, label, toggled } = props;

  useUpdateEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    if (toggled && !ref.current.classList.contains('toggled')) {
      ref.current.classList.add('toggled');
    }

    if (!toggled && ref.current.classList.contains('toggled')) {
      ref.current.classList.remove('toggled');
    }
  }, [toggled]);

  return (
    <StyledFlatButton ref={ref} {...props}>
      <Icon
        visible={showIcon}
        variant={iconType}
        size={getIconSizeBySizeType(iconSize)}
      />
      <Text
        visible={showLabel}
        text={label}
        size={SMALL_FONT_SIZE}
        weight='Medium'
      />
    </StyledFlatButton>
  );
});

BaseFlatButton.displayName = 'Flat Button';

BaseFlatButton.defaultProps = {
  showBackground: false,
  iconSize: 'Large',
  width: 70,
  height: 70,
};

export const FlatButton = withClickable(BaseFlatButton);
