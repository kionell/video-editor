import { HTMLAttributes, RefObject } from 'react';
import styled, { css } from 'styled-components';
import { IconType, IconSize } from '../Icon';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  visible?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  width?: number;
  fullHeight?: boolean;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  toggled?: boolean;
  showIcon?: boolean;
  iconType?: keyof typeof IconType;
  iconSize?: keyof typeof IconSize;
  showLabel?: boolean;
  label?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
}

const StyledBaseButton = styled.button<ButtonProps>`
  border-radius: 6px;
  padding: ${(props) => props.paddingVertical}px ${(props) => props.paddingHorizontal}px;
  gap: 5px;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  transition: background, opacity 150ms;

  ${(props) => {
    if (props.fullWidth) {
      return css`width: 100%;`;
    }

    return props.width && css`
      width: ${props.width}px;
    `;
  }}

  ${(props) => {
    if (props.fullHeight) {
      return css`height: 100%;`;
    }

    return props.height && css`
      height: ${props.height}px;
    `;
  }}

  &:enabled, &:enabled > * {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.35;
  }

  color: ${(props) => props.theme.text.normal};

  & > * {
    fill: ${(props) => props.theme.text.normal};
  }

  &:hover:enabled {
    color: ${(props) => props.theme.text.accent};

    & > * > * {
      fill: ${(props) => props.theme.text.accent};
    }
  }

  &:active:enabled {
    color: ${(props) => props.theme.text.accent};

    & > * > * {
      fill: ${(props) => props.theme.text.accent};
    }
  }
`;

StyledBaseButton.defaultProps = {
  visible: true,
  disabled: false,
  toggled: false,
  fullWidth: false,
  fullHeight: false,
  height: 40,
  paddingHorizontal: 12,
  paddingVertical: 7,
  showIcon: true,
  iconType: 'Check',
  iconSize: 'Normal',
  label: 'Button',
};

export { StyledBaseButton };
