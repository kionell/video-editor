import styled from 'styled-components';
import { IconType } from '../Icon';

export interface ButtonProps {
  disabled?: boolean;
  showIcon?: boolean;
  iconType?: keyof typeof IconType;
  showLabel?: boolean;
  label?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
}

const StyledBaseButton = styled.button<ButtonProps>`
  border-radius: 6px;
  padding: 7px 12px;
  gap: 5px;
  display: flex;
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

    & > * {
      fill: ${(props) => props.theme.text.normal};
    }
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

export { StyledBaseButton };
