import styled, { css } from 'styled-components';
import { FormEventHandler, useRef, useEffect, RefObject } from 'react';
import { Text } from '../Text';
import { DEFAULT_FONT, NORMAL_FONT_SIZE } from '../../constants';

export interface SliderProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  step?: number;
  onInput?: FormEventHandler<HTMLInputElement>;
  sliderRef?: RefObject<HTMLInputElement>;
}

const StyledSliderContainer = styled.div<SliderProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  position: relative;
  gap: 18px;
  user-select: none;
  margin-bottom: 16px;
  transition: opacity 150ms;
  
  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

const StyledSlider = styled.input.attrs({ type: 'range' })<SliderProps>`
  appearance: none;
  border-radius: 4px;
  outline: none;
  background: transparent;
  outline: none;
  position: absolute;
  width: 100%;
  height: 24px;

  &::-moz-range-track {
    appearance: none;
    border-radius: 4px;
    height: 6px;
  }

  &::-webkit-slider-runnable-track {
    appearance: none;
    border-radius: 4px;
    height: 6px;
  }

  &::-moz-range-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    outline: none;
    border: none;
    background: ${(props) => props.theme.primary.accent};
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    outline: none;
    border: none;
    transform: translateY(-5px);
    background: ${(props) => props.theme.primary.accent};
  }
`;

const StyledSliderWrapper = styled.div<SliderProps>`
  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--value) - var(--min)) / var(--range));
  --sx: calc(0.5 * 10px + var(--ratio) * (100% - 10px));

  width: 100%;

  input[type=range]::-moz-range-track {
    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.secondary.accent;

      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};

    pointer-events: none;
  }

  input[type=range]::-webkit-slider-runnable-track {
    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.secondary.accent;

      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};
  }

  input[type=range]:enabled {
    cursor: pointer;

    &:hover {
      ${(props) => {
        const rangeColor = props.theme.primary.hover;
        const trackColor = props.theme.secondary.hover;

        return css`
          &::-moz-range-track {
            background: linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
          }

          &::-webkit-slider-runnable-track {
            background: linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
          }

          &::-moz-range-thumb {
            background: ${rangeColor};
          }

          &::-webkit-slider-thumb {
            background: ${rangeColor};
          }
        `;
      }};
    }
  }

  ${(props) => {
    return !props.disabled && css`
      &::before {
        font-size: 18px;
        font-family: ${DEFAULT_FONT};
        user-select: none;
        pointer-events: none;
        background-color: ${(props) => props.theme.background};
        color: ${(props) => props.theme.text.accent};
        text-align: center;
        border-radius: 6px;
        padding: 10px;
        position: absolute;
        z-index: 1;
        left: var(--sx);
        transform: translate(-50%, -125%);
        opacity: 0;
        transition: opacity 100ms;
        content: var(--display);
      }

      &:active::before {
        opacity: 1;
      }
    `;
  }}
`;

const StyledSliderLabel = styled(Text)`
  color: ${(props) => props.theme.text.normal};
`;

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
  const { showLabel, label, minValue, maxValue, step } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = props.sliderRef ?? useRef<HTMLInputElement>(null);

  const stringifiedStep = props.step.toString();
  const digits = stringifiedStep.split('.')[1]?.length ?? 0;

  const onInputListener = () => {
    if (!sliderRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const slider = sliderRef.current;
    const value = sliderRef.current.valueAsNumber.toFixed(digits);

    wrapper.style.setProperty('--min', slider.min);
    wrapper.style.setProperty('--max', slider.max);
    wrapper.style.setProperty('--value', value);
    wrapper.style.setProperty('--display', `"${value}"`);
  };

  useEffect(() => {
    if (!sliderRef.current) return;

    onInputListener();

    sliderRef.current.addEventListener('input', onInputListener);

    return () => {
      sliderRef.current?.removeEventListener('input', onInputListener);
    };
  }, []);

  return (
    <StyledSliderContainer {...props}>
      <StyledSliderLabel
        visible={showLabel}
        text={label}
        weight='Medium'
        overflow='visible'
        size={NORMAL_FONT_SIZE}
      />
      <StyledSliderWrapper {...props} ref={wrapperRef}>
        <StyledSlider
          {...props}
          ref={sliderRef}
          min={minValue}
          max={maxValue}
          step={step}
        />
      </StyledSliderWrapper>
    </StyledSliderContainer>
  );
};

Slider.defaultProps = {
  disabled: false,
  showLabel: true,
  label: 'Slider',
  minValue: 0,
  maxValue: 100,
  defaultValue: 50,
  step: 1,
};

export { Slider };
