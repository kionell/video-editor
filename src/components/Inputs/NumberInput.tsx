import styled, { css } from 'styled-components';
import React, { useRef, useEffect } from 'react';
import { Text } from '../Text';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { FlexContainer } from '../Containers/FlexContainer';
import { NORMAL_FONT_SIZE } from '../../constants';
import { StyledTextInput } from './TextInput';
import { clamp } from '../../core/Utils/Math';

export interface NumberInputProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  min?: number,
  max?: number,
  step?: number,
  loop?: boolean,
  defaultValue?: number,
  onChange?: (event: Event) => void;
  className?: string;
}

const StyledNumberInputWrapper = styled.div<NumberInputProps>`
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  gap: 12px;

  flex-direction: ${(props) => props.labelPosition === 'left' ? 'row-reverse' : 'row'};
`;

const StyledNumberInputContainer = styled(FlexContainer)`
  padding: 0px;
  gap: 0px;
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

  const lastValue = useRef<number>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const increment = () => {
    if (props.loop && inputRef.current.valueAsNumber >= props.max) {
      inputRef.current.valueAsNumber = props.min;
    }
    else {
      inputRef.current?.stepUp();
      inputRef.current?.dispatchEvent(new Event('change'));
    }
  };

  const decrement = () => {
    if (props.loop && inputRef.current.valueAsNumber <= props.min) {
      inputRef.current.valueAsNumber = props.max;
    }
    else {
      inputRef.current?.stepDown();
      inputRef.current?.dispatchEvent(new Event('change'));
    }
  };

  const getCurrentValue = (current: number, min: number, max: number) => {
    if (props.loop) {
      if (lastValue.current === current && current >= max) {
        return min;
      }

      if (lastValue.current === current && current <= min) {
        return max;
      }
    }

    return clamp(current, min, max);
  };

  const updateValue = () => {
    if (!inputRef.current) return;

    const minValue = props.min;
    const maxValue = props.max;
    const currentValue = inputRef.current.value
      ? parseFloat(inputRef.current.value)
      : props.defaultValue;

    const value = getCurrentValue(currentValue, minValue, maxValue);

    const stringifiedStep = props.step.toString();
    const digits = stringifiedStep.split('.')[1]?.length ?? 0;

    inputRef.current.value = value.toFixed(digits);

    lastValue.current = inputRef.current.valueAsNumber;
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
          disabled={disabled}
          showLabel={false}
        />
      </StyledNumberInputContainer>
      <StyledNumberInputLabel
        visible={showLabel}
        disabled={disabled}
        text={label}
        weight='Medium'
        size={NORMAL_FONT_SIZE}
      />
    </StyledNumberInputWrapper>
  );
};

NumberInput.defaultProps = {
  disabled: false,
  showLabel: false,
  label: 'Input',
  labelPosition: 'left',
  loop: true,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
};

export { NumberInput };
