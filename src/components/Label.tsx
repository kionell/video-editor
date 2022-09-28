import styled, { css } from 'styled-components';

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
  font-weight: ${(props) => props.weight === 'Medium' ? 600 : 400 };
  font-family: ${(props) => props.font};
  font-size: ${(props) => props.size}px;
  display: ${(props) => props.visible ? 'inline-block' : 'none'};
  opacity: ${(props) => props.disabled ? 0.25 : 1};
  user-select: none;
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
  size: 14,
  font: 'Roboto',
  weight: 'Regular',
  useColor: true,
};

export { Label };