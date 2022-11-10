import styled, { css } from 'styled-components';
import { FormEventHandler } from 'react';
import { Text } from '../Text';
import { DEFAULT_FONT, NORMAL_FONT_SIZE } from '../../constants';

export interface TextInputProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left' | 'right';
  placeholder?: string;
  className?: string;
  onChange?: FormEventHandler<HTMLInputElement>;
}

const StyledTextInputWrapper = styled.div<TextInputProps>`
  display: flex;
  justify-content: left;
  position: relative;
  margin: 12px;
  gap: 5px;

  flex-direction: ${(props) => {
    if (props.labelPosition === 'left') return 'row';
    if (props.labelPosition === 'right') return 'row-reverse';

    return 'column';
  }};

  align-items: ${(props) => {
    return props.labelPosition === 'top' ? 'start' : 'center';
  }};

  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

export const StyledTextInput = styled.input<TextInputProps>`
  position: relative;
  height: 40px;
  outline: none;
  padding-left: 5px;
  border: 1px solid;
  border-radius: 4px;
  border-color: ${(props) => props.theme.secondary.accent};
  background: ${(props) => props.theme.background};
  caret-color: ${(props) => props.theme.text.darker};
  color: ${(props) => props.theme.text.lighter};
  pointer-events: ${(props) => props.disabled ? 'none' : 'all'};
  font-family: ${DEFAULT_FONT};
  font-size: ${NORMAL_FONT_SIZE}px;
  transition: 100ms;

  ${(props) => {
    if (props.disabled) return;

    return css`
      cursor: text;

      &:focus {
        border-color: ${props.theme.primary.hover};
      }
    `;
  }}

  &::selection {
    background: ${(props) => props.theme.primary.accent};
  }
`;

const StyledTextInputLabel = styled(Text)`
  color: ${(props) => props.theme.text.normal};
`;

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const { showLabel, label, labelPosition, disabled } = props;

  return (
    <StyledTextInputWrapper
      labelPosition={labelPosition}
      disabled={disabled}
    >
      <StyledTextInputLabel
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
