import styled from 'styled-components';
import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { DEFAULT_FONT, DEFAULT_WEIGHT, NORMAL_FONT_SIZE } from '../constants';

type FontWeight = 'Regular' | 'Medium';

export interface TextProps extends HTMLAttributes<HTMLLabelElement> {
  visible?: boolean;
  disabled?: boolean;
  text?: string;
  size?: number;
  font?: string;
  weight?: FontWeight;
  color?: string;
  className?: string;
}

const StyledText = styled.label<TextProps>`
  position: relative;
  color: ${(props) => props.color ?? 'inherit'};
  font-weight: ${(props) => props.weight === 'Medium' ? 600 : 400 };
  font-family: ${(props) => props.font};
  font-size: ${(props) => props.size}px;
  display: ${(props) => props.visible ? 'inline-block' : 'none'};
  opacity: ${(props) => props.disabled ? 0.25 : 1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  pointer-events: none;
  cursor: inherit;
`;

const Text = forwardRef<HTMLLabelElement, TextProps>((
  props: HTMLAttributes<HTMLLabelElement> & TextProps, 
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return <StyledText {...props} ref={ref}>{props.text}</StyledText>;
});

Text.displayName = 'Text';

Text.defaultProps = {
  visible: true,
  disabled: false,
  text: 'Label',
  size: NORMAL_FONT_SIZE,
  font: DEFAULT_FONT,
  weight: DEFAULT_WEIGHT,
};

export { Text };