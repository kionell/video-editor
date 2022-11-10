import styled, { css } from 'styled-components';
import React, { useRef, useEffect } from 'react';
import { Text } from '../Text';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { NORMAL_FONT_SIZE } from '../../constants';
import { StyledTextInput } from './TextInput';

export interface NumberInputProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  min?: number,
  max?: number,
  step?: number,
  defaultValue?: number,
  onChange?: (event: Event) => void;
  className?: string;
}

const StyledNumberInputWrapper = styled.div<NumberInputProps>`
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  margin: 12px;
  gap: 5px;

  flex-direction: ${(props) => props.labelPosition === 'left' ? 'row-reverse' : 'row'};
`;

const StyledNumberInputContainer = styled(FlexContainer)`
  padding: 0px;
  gap: 0px;
  min-width: 180px;
`;

const StyledMinusButton = styled(SecondaryButton)`
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  flex: 0;
`;

const StyledPlusButton = styled(SecondaryButton)`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  flex: 0;
`;

const StyledNumberInput = styled(StyledTextInput).attrs({ type: 'number' })<NumberInputProps>`
  -moz-appearance: textfield;
  width: 50px;
  padding: 0px;
  flex: 1;
  border-radius: 0px;
  border-left: none;
  border-right: none;
  text-align: center;

  opacity: ${(props) => props.disabled ? 0.25 : 1};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

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

const StyledNumberInputLabel = styled(Text)`
  color: ${(props) => props.theme.text.normal};
`;

const NumberInput: React.FC<NumberInputProps> = (props: NumberInputProps) => {
  const { showLabel, label, labelPosition, disabled } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const increment = () => {
    inputRef.current?.stepUp();
    inputRef.current?.dispatchEvent(new Event('change'));
  };

  const decrement = () => {
    inputRef.current?.stepDown();
    inputRef.current?.dispatchEvent(new Event('change'));
  };

  const updateValue = () => {
    if (!inputRef.current) return;

    const minValue = props.min as number;
    const maxValue = props.max as number;
    const currentValue = inputRef.current.value
      ? parseFloat(inputRef.current.value)
      : props.defaultValue as number;

    const value = Math.max(minValue, Math.min(currentValue, maxValue));
    const stringifiedStep = (props.step as number).toString();
    const digits = stringifiedStep.split('.')[1]?.length ?? 0;

    inputRef.current.value = value.toFixed(digits);
  };

  useEffect(() => {
    inputRef.current?.addEventListener('change', updateValue);

    if (props.onChange) {
      inputRef.current?.addEventListener('change', props.onChange);
    }

    updateValue();

    return () => {
      inputRef.current?.removeEventListener('change', updateValue);

      if (props.onChange) {
        inputRef.current?.removeEventListener('change', props.onChange);
      }
    };
  }, []);

  return (
    <StyledNumberInputWrapper
      labelPosition={labelPosition}
      disabled={disabled}
    >
      <StyledNumberInputContainer>
        <StyledMinusButton
          onClick={decrement}
          className="minus-button"
          iconType='Minus'
          iconSize='Large'
          disabled={disabled}
          showLabel={false}
        />
        <StyledNumberInput
          ref={inputRef}
          min={props.min}
          max={props.max}
          step={props.step}
          disabled={disabled}
        />
        <StyledPlusButton
          onClick={increment}
          className="plus-button"
          iconType='Plus'
          iconSize='Large'
          disabled={disabled}
          showLabel={false}
        />
      </StyledNumberInputContainer>
      <StyledNumberInputLabel
        visible={showLabel}
        disabled={disabled}
        text={label}
        size={NORMAL_FONT_SIZE}
      />
    </StyledNumberInputWrapper>
  );
};

NumberInput.defaultProps = {
  disabled: false,
  showLabel: true,
  label: 'Input',
  labelPosition: 'left',
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
};

export { NumberInput };
