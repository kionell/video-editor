import styled, { css } from 'styled-components';
import { FormEventHandler, RefObject, useEffect } from 'react';
import { Text } from '../Text';
import { DEFAULT_FONT, NORMAL_FONT_SIZE } from '../../constants';

export interface TextInputProps {
  width?: number;
  height?: number;
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left' | 'right';
  labelWeight?: 'Regular' | 'Medium';
  placeholder?: string;
  numbersOnly?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onChange?: FormEventHandler<HTMLInputElement>;
}

const StyledTextInputWrapper = styled.div<TextInputProps>`
  display: flex;
  justify-content: left;
  position: relative;
  gap: 8px;
  transition: opacity 150ms;

  ${(props) => {
    if (props.width) return;

    return css`width: 100%;`;
  }}

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
  outline: none;
  padding-left: 5px;
  border: 1px solid;
  border-radius: 4px;
  border-color: ${(props) => props.theme.secondary.accent};
  background: ${(props) => props.theme.background};
  caret-color: ${(props) => props.theme.text.darker};
  color: ${(props) => props.theme.text.accent};
  pointer-events: ${(props) => props.disabled ? 'none' : 'all'};
  font-family: ${DEFAULT_FONT};
  font-size: ${NORMAL_FONT_SIZE}px;
  transition: 150ms;

  width: ${(props) => props.width ? props.width + 'px' : '100%'};
  height: ${(props) => props.height ?? 35}px; 

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
  const { inputRef, ...other } = props;

  const {
    width,
    showLabel,
    label,
    labelPosition,
    labelWeight,
    disabled,
    numbersOnly,
  } = other;

  const removeWrongValue = () => {
    if (!inputRef.current || !numbersOnly) return;

    inputRef.current.value = inputRef.current.value.replace(/[^\d]*/g, '');
  };

  useEffect(() => {
    inputRef.current?.addEventListener('input', removeWrongValue);

    return () => {
      inputRef.current?.removeEventListener('input', removeWrongValue);
    };
  }, []);

  return (
    <StyledTextInputWrapper
      width={width}
      labelPosition={labelPosition}
      disabled={disabled}
    >
      <StyledTextInputLabel
        visible={showLabel}
        text={label}
        weight={labelWeight}
        overflow='visible'
        size={NORMAL_FONT_SIZE}
      />
      <StyledTextInput
        {...other}
        onChange={other.onChange}
        onInput={other.onChange}
        ref={inputRef}
      />
    </StyledTextInputWrapper>
  );
};

TextInput.defaultProps = {
  disabled: false,
  showLabel: true,
  label: 'Input',
  labelPosition: 'left',
  labelWeight: 'Regular',
  placeholder: 'Placeholder Text',
};

export { TextInput };
