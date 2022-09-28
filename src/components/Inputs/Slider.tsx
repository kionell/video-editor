import styled, { css } from 'styled-components';
import { FormEventHandler, useRef, useEffect } from 'react';
import { Label } from '../Label';
import { NORMAL_FONT_SIZE } from '../../constants';

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

const StyledSliderWrapper = styled.div<SliderProps>`
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
  border: none;
  background: transparent;
  outline: none;
  position: relative;
  width: 100%;

  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--value) - var(--min)) / var(--range));
  --sx: calc(0.5 * 10px + var(--ratio) * (100% - 10px));

  &::-webkit-slider-runnable-track {
    appearance: none;
    border-radius: 4px;
    height: 6px;

    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.input.normal;
      
      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};
  }

  &::-moz-range-track {
    appearance: none;
    border-radius: 4px;
    height: 6px;

    background: ${(props) => {
      const rangeColor = props.theme.primary.accent;
      const trackColor = props.theme.input.normal;
      
      return css`
        linear-gradient(${rangeColor}, ${rangeColor}) 0/var(--sx) 100% no-repeat, ${trackColor};
      `;
    }};
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: ${(props) => props.theme.primary.accent};
    translate: 0px -3px;
  }

  &::-moz-range-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: ${(props) => props.theme.primary.accent};
  }

  &:enabled {
    cursor: pointer;

    &:hover {
      ${(props) => {
        const accentColor = props.theme.primary.accentHover;
        const normalColor = props.theme.input.normalHover;

        return css`
          &::-webkit-slider-runnable-track {
            background: linear-gradient(${accentColor}, ${accentColor}) 0/var(--sx) 100% no-repeat, ${normalColor};
          }

          &::-moz-range-track {
            background: linear-gradient(${accentColor}, ${accentColor}) 0/var(--sx) 100% no-repeat, ${normalColor};
          }

          &::-webkit-slider-thumb {
            background: ${accentColor};
          }

          &::-moz-range-thumb {
            background: ${accentColor};
          }
        `;
      }};
    }

    &:active::before {
      font-size: 18px;
      font-family: 'Roboto';
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
  }
`;

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
  const { showLabel, label, minValue, maxValue, step } = props;

  const sliderRef = useRef<HTMLInputElement>(null);

  const onInputListener = () => {
    if (!sliderRef.current) return;

    const el = sliderRef.current;

    el.style.setProperty('--min', el.min);
    el.style.setProperty('--max', el.max);
    el.style.setProperty('--value', el.value);
    el.style.setProperty('--display', `"${el.value}"`);
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
    <StyledSliderWrapper {...props}>
      <Label 
        visible={showLabel} 
        text={label} 
        size={NORMAL_FONT_SIZE}
      />
      <StyledSlider 
        {...props} 
        ref={sliderRef}
        min={minValue}
        max={maxValue}
        step={step}
      />
    </StyledSliderWrapper>
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
