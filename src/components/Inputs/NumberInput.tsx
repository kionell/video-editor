import styled, { css } from 'styled-components';
import { useRef } from 'react';
import { Label } from '../Label';
import { SecondaryButton } from '../Buttons';
import { FlexContainer } from '../Containers';
import { useUpdateEffect } from '../../hooks';
import { NORMAL_FONT_SIZE } from '../../constants';

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

  .minus-button {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .plus-button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const StyledNumberInput = styled.input.attrs({ type: 'number' })<NumberInputProps>`
  -moz-appearance: textfield;
  position: relative;
  padding: 0px 5px;
  height: 40px;
  width: 100px;
  outline: none;
  text-align: center;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-left: none;
  border-right: none;
  border-color: ${(props) => props.theme.input.normal};
  background: ${(props) => props.theme.secondary.accent};
  caret-color: ${(props) => props.theme.text.darker};
  color: ${(props) => props.theme.text.lighter};
  opacity: ${(props) => props.disabled ? 0.25 : 1};
  font-family: 'Roboto';
  font-size: ${NORMAL_FONT_SIZE}px;

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
        border-color: ${props.theme.primary.accentHover};
      }
    `;
  }}

  &::selection {
    background: ${(props) => props.theme.primary.accent};
  }
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

  useUpdateEffect(() => {
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
      <FlexContainer gap={0} padding={0}>
        <SecondaryButton 
          onClick={decrement}
          className="minus-button" 
          iconType='Minus'
          disabled={disabled}
          showLabel={false}
          largeIcon
        />
        <StyledNumberInput
          ref={inputRef}
          min={props.min}
          max={props.max}
          step={props.step}
          disabled={disabled}
        />
        <SecondaryButton
          onClick={increment}
          className="plus-button"
          iconType='Plus'
          disabled={disabled}
          showLabel={false}
          largeIcon
        />
      </FlexContainer>
      <Label 
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
  labelPosition: 'right',
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
};

export { NumberInput };
