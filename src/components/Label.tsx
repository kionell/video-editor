import styled, { css } from 'styled-components';
import { DEFAULT_FONT, DEFAULT_WEIGHT, NORMAL_FONT_SIZE } from '../constants';

type FontWeight = 'Regular' | 'Medium';

export interface LabelProps {
  visible?: boolean;
  disabled?: boolean;
  text?: string;
  size?: number;
  font?: string;
  weight?: FontWeight;
  useColor?: boolean;
  className?: string;
}

const StyledLabel = styled.label<LabelProps>`
  position: relative;
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
  
  ${(props) => {
    return props.useColor && css`
      color: ${props.theme.text.normal};
    `;
  }}
`;

const Label: React.FC<LabelProps> = (props: LabelProps) => {
  return <StyledLabel {...props}>{props.text}</StyledLabel>;
};

Label.defaultProps = {
  visible: true,
  disabled: false,
  text: 'Label',
  size: NORMAL_FONT_SIZE,
  font: DEFAULT_FONT,
  weight: DEFAULT_WEIGHT,
  useColor: true,
};

export { Label };