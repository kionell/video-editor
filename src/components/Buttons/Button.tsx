import { Ref } from 'react';
import styled from 'styled-components';
import { IconType, IconSize } from '../Icon';

export interface ButtonProps {
  visible?: boolean;
  disabled?: boolean;
  showIcon?: boolean;
  iconType?: keyof typeof IconType;
  iconSize?: keyof typeof IconSize;
  showLabel?: boolean;
  label?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  listener?: (event: MouseEvent) => void;
}

const StyledBaseButton = styled.button<ButtonProps>`
  border-radius: 6px;
  padding: 7px 12px;
  gap: 5px;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;

  &:enabled, &:enabled > * {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.25;
  }

  color: ${(props) => props.theme.text.normal};

  & > * {
    pointer-events: none;
    fill: ${(props) => props.theme.text.normal};
  }

  &:hover:enabled {
    color: ${(props) => props.theme.text.lighter};

    & > * > * {
      fill: ${(props) => props.theme.text.lighter};
    }
  }

  &:active:enabled {
    color: ${(props) => props.theme.text.lighter};

    & > * > * {
      fill: ${(props) => props.theme.text.lighter};
    }
  }
`;

StyledBaseButton.defaultProps = {
  visible: true,
  disabled: false,
  showIcon: true,
  iconType: 'Check', 
  iconSize: 'Normal',
  showLabel: true,
  label: 'Button',
};

export { StyledBaseButton };
