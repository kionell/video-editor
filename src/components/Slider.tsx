import styled, { css } from 'styled-components';
import { useRef, useEffect } from 'react';
import { Label } from './Label';
import { FlexContainer } from './Containers';
import { NORMAL_FONT_SIZE } from '../constants';

export interface SliderProps {
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
}

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
    translate: 0px -3px;
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

          &::-webkit-slider-thumb {
            background: ${accentColor};
          }
        `;
      }};
    }

    &:active::after {
      position: absolute;
      content: attr(value);
    }
  }

  &:disabled {
    opacity: 0.25;
  }


`;

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
  const { showLabel, label, minValue, maxValue } = props;

  const sliderRef = useRef<HTMLInputElement>(null);

  const onChangeListener = () => {
    if (!sliderRef.current) return;

    const el = sliderRef.current;

    el.style.setProperty('--min', el.min);
    el.style.setProperty('--max', el.max);
    el.style.setProperty('--value', el.value);
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    
    onChangeListener();

    sliderRef.current.addEventListener('input', onChangeListener);

    return () => {
      sliderRef.current?.removeEventListener('input', onChangeListener);
    };
  });

  return (
    <FlexContainer
      {...props}
      direction='column'
      align='start'
    >
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
      />
    </FlexContainer>
  );
};

Slider.defaultProps = {
  disabled: false,
  showLabel: false,
  label: 'Slider',
  minValue: 0,
  maxValue: 100,
  defaultValue: 50,
};

export { Slider };
