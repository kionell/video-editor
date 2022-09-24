import styled, { css } from 'styled-components';

type FontWeight = 'Regular' | 'Medium';

interface LabelProps {
  visible?: boolean;
  text?: string;
  size?: number;
  font?: string;
  weight?: FontWeight;
  useColor?: boolean;
}

const StyledLabel = styled.label<LabelProps>`
  font-weight: ${(props) => props.weight === 'Medium' ? 600 : 400 };
  font-family: ${(props) => props.font};
  font-size: ${(props) => props.size}px;
  display: ${(props) => props.visible ? 'inline-block' : 'none'};
  user-select: none;
  
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
  text: 'Label',
  size: 14,
  font: 'Roboto',
  weight: 'Regular',
  useColor: true,
};

export { Label };