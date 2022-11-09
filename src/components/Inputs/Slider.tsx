import styled, { css } from 'styled-components';
import { FormEventHandler, useRef, useEffect } from 'react';
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
}

const StyledSliderContainer = styled.div<SliderProps>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  position: relative;
  margin: 12px;
  gap: 10px;

  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

const StyledSlider = styled.input.attrs({ type: 'range' })<SliderProps>`
  appearance: none;
  border-radius: 4px;
  outline: none;
  background: transparent;
  outline: none;
  position: relative;
  width: 100%;

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
    width: 12px;
    height: 12px;
    border-radius: 50%;
    outline: none;
    border: none;
    background: ${(props) => props.theme.primary.accent};
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    outline: none;
    border: none;
    translate: 0px -3px;
    background: ${(props) => props.theme.primary.accent};
  }
`;

const StyledSliderWrapper = styled.div<SliderProps>`
  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--value) - var(--min)) / var(--range));
  --sx: calc(0.5 * 10px + var(--ratio) * (100% - 10px));

  height: 0px;

  &:active::before {
    font-size: 18px;
    font-family: ${DEFAULT_FONT};
    user-select: none;
    background-color: ${(props) => props.theme.primary.normal};
    color: ${(props) => props.theme.text.lighter};
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    left: var(--sx);
    translate: -50% -125%;
    content: var(--display);
  }

  input[type=range]::-moz-range-track {
    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.input.normal;

      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};
  }

  input[type=range]::-webkit-slider-runnable-track {
    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.input.normal;

      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};
  }

  input[type=range]:enabled {
    cursor: pointer;

    &:hover {
      ${(props) => {
        const accentColor = props.theme.primary.accentHover;
        const normalColor = props.theme.input.normalHover;

        return css`
          &::-moz-range-track {
            background: linear-gradient(${accentColor}, ${accentColor}) 0/var(--sx) 100% no-repeat, ${normalColor};
          }

          &::-webkit-slider-runnable-track {
            background: linear-gradient(${accentColor}, ${accentColor}) 0/var(--sx) 100% no-repeat, ${normalColor};
          }

          &::-moz-range-thumb {
            background: ${accentColor};
          }

          &::-webkit-slider-thumb {
            background: ${accentColor};
          }
        `;
      }};
    }
  }
`;

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
  const { showLabel, label, minValue, maxValue, step } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const onInputListener = () => {
    if (!sliderRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const slider = sliderRef.current;

    wrapper.style.setProperty('--min', slider.min);
    wrapper.style.setProperty('--max', slider.max);
    wrapper.style.setProperty('--value', slider.value);
    wrapper.style.setProperty('--display', `"${slider.value}"`);
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
      <Text
        visible={showLabel}
        text={label}
        size={NORMAL_FONT_SIZE}
      />
      <StyledSliderWrapper ref={wrapperRef}>
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
