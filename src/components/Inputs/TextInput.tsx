import styled, { css } from 'styled-components';
import { FormEventHandler } from 'react';
import { Label } from '../Label';
import { NORMAL_FONT_SIZE } from '../../constants';

export interface TextInputProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  placeholder?: string;
  className?: string;
  onChange?: FormEventHandler<HTMLInputElement>;
}

const StyledTextInputWrapper = styled.div<TextInputProps>`
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  margin: 12px;
  gap: 5px;

  flex-direction: ${(props) => props.labelPosition === 'left' ? 'row-reverse' : 'row'};
  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

const StyledTextInput = styled.input<TextInputProps>`
  position: relative;
  width: 100%;
  height: 40px;
  outline: none;
  padding-left: 5px;
  outline: 1px solid;
  border-radius: 4px;
  outline-color: ${(props) => props.theme.input.normal};
  background: ${(props) => props.theme.secondary.accent};
  caret-color: ${(props) => props.theme.text.darker};
  color: ${(props) => props.theme.text.lighter};
  font-family: 'Roboto';
  font-size: ${NORMAL_FONT_SIZE}px;

  ${(props) => {
    if (props.disabled) return;

    return css`
      cursor: text;

      &:focus {
        outline-color: ${props.theme.primary.accentHover};
      }
    `;
  }}

  &::selection {
    background: ${(props) => props.theme.primary.accent};
  }
`;

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const { showLabel, label, labelPosition, disabled } = props;

  return (
    <StyledTextInputWrapper
      labelPosition={labelPosition}
      disabled={disabled}
    >
      <Label 
        visible={showLabel} 
        text={label} 
        size={NORMAL_FONT_SIZE}
      />
      <StyledTextInput {...props} />
    </StyledTextInputWrapper>
  );
};

TextInput.defaultProps = {
  disabled: false,
  showLabel: true,
  label: 'Input',
  labelPosition: 'left',
  placeholder: 'Placeholder Text',
};

export { TextInput };
