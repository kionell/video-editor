import styled from 'styled-components';
import { useUpdateEffect } from '../../hooks/useUpdateEffect';
import { ButtonProps, StyledBaseButton } from './Button';
import { getIconSizeBySizeType, Icon } from '../Icon';
import { Text } from '../Text';
import { SMALL_FONT_SIZE } from '../../constants';
import { useRef } from 'react';

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

const FlatButton: React.FC<FlatButtonProps> = (props: FlatButtonProps) => {
  const {
    showIcon,
    iconType,
    iconSize,
    showLabel,
    label,
    toggled,
  } = props;

  const buttonRef = props.buttonRef ?? useRef<HTMLButtonElement>(null);

  useUpdateEffect(() => {
    if (!buttonRef.current) return;

    if (toggled && !buttonRef.current.classList.contains('toggled')) {
      buttonRef.current.classList.add('toggled');
    }

    if (!toggled && buttonRef.current.classList.contains('toggled')) {
      buttonRef.current.classList.remove('toggled');
    }
  }, [toggled]);

  return (
    <StyledFlatButton ref={buttonRef} {...props}>
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
};

FlatButton.defaultProps = {
  showBackground: false,
  iconSize: 'Large',
  width: 70,
  height: 70,
};

export { FlatButton };
