import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';
import { BaseElement } from '../../core/Elements';
import { updateElement } from '../../store/Reducers/TimelineSlice';
import { IHasColorAdjustments } from '../../core/Elements/Types/IHasColorAdjustments';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFocusedElement } from '../../store';
import { useDebounce } from '../../hooks/useDebounce';
import {
  DEFAULT_BLUR,
  DEFAULT_CONTRAST,
  DEFAULT_BRIGHTNESS,
  DEFAULT_OPACITY,
  DEFAULT_SATURATION,
  DEFAULT_TEMPERATURE,
  DEFAULT_MIN_BRIGHTNESS,
  DEFAULT_MAX_BRIGHTNESS,
  DEFAULT_BRIGHTNESS_STEP,
  DEFAULT_MIN_SATURATION,
  DEFAULT_MAX_SATURATION,
  DEFAULT_SATURATION_STEP,
  DEFAULT_MIN_TEMPERATURE,
  DEFAULT_MAX_TEMPERATURE,
  DEFAULT_TEMPERATURE_STEP,
  DEFAULT_MIN_CONTRAST,
  DEFAULT_MAX_CONTRAST,
  DEFAULT_CONTRAST_STEP,
  DEFAULT_MIN_OPACITY,
  DEFAULT_MAX_OPACITY,
  DEFAULT_OPACITY_STEP,
  DEFAULT_MIN_BLUR,
  DEFAULT_MAX_BLUR,
  DEFAULT_BLUR_STEP,
} from '../../constants';

const StyledAdjustSettings = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  overflow-y: auto;
`;

const AdjustSettings: React.FC = () => {
  const disptach = useAppDispatch();
  const focusedElement = useAppSelector(selectFocusedElement);
  const targetElement = focusedElement as BaseElement & IHasColorAdjustments;

  const brightnessRef = useRef<HTMLInputElement>(null);
  const saturationRef = useRef<HTMLInputElement>(null);
  const temperatureRef = useRef<HTMLInputElement>(null);
  const contrastRef = useRef<HTMLInputElement>(null);
  const opacityRef = useRef<HTMLInputElement>(null);
  const blurRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onBrightnessInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      brightness: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onSaturationInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      saturation: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onTemperatureInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      temperature: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onContrastInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      contrast: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onOpacityInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      opacity: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onBlurInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      blur: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onReset = () => {
    disptach(updateElement({
      brightness: DEFAULT_BRIGHTNESS,
      saturation: DEFAULT_SATURATION,
      temperature: DEFAULT_TEMPERATURE,
      contrast: DEFAULT_CONTRAST,
      opacity: DEFAULT_OPACITY,
      blur: DEFAULT_BLUR,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    if (brightnessRef.current) {
      brightnessRef.current.valueAsNumber = targetElement.brightness;
      brightnessRef.current.dispatchEvent(new Event('input'));
    }

    if (saturationRef.current) {
      saturationRef.current.valueAsNumber = targetElement.saturation;
      saturationRef.current.dispatchEvent(new Event('input'));
    }

    if (temperatureRef.current) {
      temperatureRef.current.valueAsNumber = targetElement.temperature;
      temperatureRef.current.dispatchEvent(new Event('input'));
    }

    if (contrastRef.current) {
      contrastRef.current.valueAsNumber = targetElement.contrast;
      contrastRef.current.dispatchEvent(new Event('input'));
    }

    if (opacityRef.current) {
      opacityRef.current.valueAsNumber = targetElement.opacity;
      opacityRef.current.dispatchEvent(new Event('input'));
    }

    if (blurRef.current) {
      blurRef.current.valueAsNumber = targetElement.blur;
      blurRef.current.dispatchEvent(new Event('input'));
    }

    brightnessRef.current?.addEventListener('input', onBrightnessInput);
    saturationRef.current?.addEventListener('input', onSaturationInput);
    temperatureRef.current?.addEventListener('input', onTemperatureInput);
    contrastRef.current?.addEventListener('input', onContrastInput);
    opacityRef.current?.addEventListener('input', onOpacityInput);
    blurRef.current?.addEventListener('input', onBlurInput);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      brightnessRef.current?.removeEventListener('input', onBrightnessInput);
      saturationRef.current?.removeEventListener('input', onSaturationInput);
      temperatureRef.current?.removeEventListener('input', onTemperatureInput);
      contrastRef.current?.removeEventListener('input', onContrastInput);
      opacityRef.current?.removeEventListener('input', onOpacityInput);
      blurRef.current?.removeEventListener('input', onBlurInput);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [
    targetElement?.uniqueId,
    targetElement?.brightness,
    targetElement?.saturation,
    targetElement?.temperature,
    targetElement?.contrast,
    targetElement?.opacity,
    targetElement?.blur,
  ]);

  return (
    <StyledAdjustSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <Slider
          minValue={DEFAULT_MIN_BRIGHTNESS}
          maxValue={DEFAULT_MAX_BRIGHTNESS}
          step={DEFAULT_BRIGHTNESS_STEP}
          defaultValue={targetElement?.brightness ?? DEFAULT_BRIGHTNESS}
          label='Brightness'
          showLabel
          sliderRef={brightnessRef}
        />
        <Slider
          minValue={DEFAULT_MIN_SATURATION}
          maxValue={DEFAULT_MAX_SATURATION}
          step={DEFAULT_SATURATION_STEP}
          defaultValue={targetElement?.saturation ?? DEFAULT_SATURATION}
          label='Saturation'
          showLabel
          sliderRef={saturationRef}
        />
        <Slider
          minValue={DEFAULT_MIN_TEMPERATURE}
          maxValue={DEFAULT_MAX_TEMPERATURE}
          step={DEFAULT_TEMPERATURE_STEP}
          defaultValue={targetElement?.temperature ?? DEFAULT_TEMPERATURE_STEP}
          label='Temperature'
          showLabel
          sliderRef={temperatureRef}
        />
        <Slider
          minValue={DEFAULT_MIN_CONTRAST}
          maxValue={DEFAULT_MAX_CONTRAST}
          step={DEFAULT_CONTRAST_STEP}
          defaultValue={targetElement?.contrast ?? DEFAULT_CONTRAST}
          label='Contrast'
          showLabel
          sliderRef={contrastRef}
        />
        <Slider
          minValue={DEFAULT_MIN_OPACITY}
          maxValue={DEFAULT_MAX_OPACITY}
          step={DEFAULT_OPACITY_STEP}
          defaultValue={targetElement?.opacity ?? DEFAULT_OPACITY}
          label='Opacity'
          showLabel
          sliderRef={opacityRef}
        />
        <Slider
          minValue={DEFAULT_MIN_BLUR}
          maxValue={DEFAULT_MAX_BLUR}
          step={DEFAULT_BLUR_STEP}
          defaultValue={targetElement?.blur ?? DEFAULT_BLUR}
          label='Blur'
          showLabel
          sliderRef={blurRef}
        />

        <PrimaryButton
          fullWidth
          height={35}
          showIcon={false}
          label='Reset'
          showLabel
          buttonRef={resetRef}
        />
      </ScrollableContainer>
    </StyledAdjustSettings>
  );
};

export { AdjustSettings };
