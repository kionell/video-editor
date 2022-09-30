import { HTMLAttributes, Ref } from 'react';
import styled, { css } from 'styled-components';
import { IconType, IconSize } from '../Icon';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  visible?: boolean;
  disabled?: boolean;
  width?: number;
  height?: number;
  toggled?: boolean;
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

  ${(props) => {
    return props.width && css`
      width: ${props.width}px;
    `;
  }}

  ${(props) => {
    return props.height && css`
      height: ${props.height}px;
    `;
  }}

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
  toggled: false,
  height: 40,
  showIcon: true,
  iconType: 'Check', 
  iconSize: 'Normal',
  showLabel: true,
  label: 'Button',
};

export { StyledBaseButton };
