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

  const exposureRef = useRef<HTMLInputElement>(null);
  const saturationRef = useRef<HTMLInputElement>(null);
  const temperatureRef = useRef<HTMLInputElement>(null);
  const contrastRef = useRef<HTMLInputElement>(null);
  const opacityRef = useRef<HTMLInputElement>(null);
  const blurRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onExposureInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      exposure: slider.valueAsNumber,
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
      exposure: 0.5,
      saturation: 0.5,
      temperature: 0.5,
      contrast: 1,
      opacity: 1,
      blur: 0,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    const triggerInput = (input: HTMLInputElement) => {
      input.dispatchEvent(new Event('input'));
    };

    if (exposureRef.current) {
      exposureRef.current.valueAsNumber = targetElement.exposure;
      triggerInput(exposureRef.current);
    }

    if (saturationRef.current) {
      saturationRef.current.valueAsNumber = targetElement.saturation;
      triggerInput(saturationRef.current);
    }

    if (temperatureRef.current) {
      temperatureRef.current.valueAsNumber = targetElement.temperature;
      triggerInput(temperatureRef.current);
    }

    if (contrastRef.current) {
      contrastRef.current.valueAsNumber = targetElement.contrast;
      triggerInput(contrastRef.current);
    }

    if (opacityRef.current) {
      opacityRef.current.valueAsNumber = targetElement.opacity;
      triggerInput(opacityRef.current);
    }

    if (blurRef.current) {
      blurRef.current.valueAsNumber = targetElement.blur;
      triggerInput(blurRef.current);
    }

    exposureRef.current?.addEventListener('input', onExposureInput);
    saturationRef.current?.addEventListener('input', onSaturationInput);
    temperatureRef.current?.addEventListener('input', onTemperatureInput);
    contrastRef.current?.addEventListener('input', onContrastInput);
    opacityRef.current?.addEventListener('input', onOpacityInput);
    blurRef.current?.addEventListener('input', onBlurInput);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      exposureRef.current?.removeEventListener('input', onExposureInput);
      saturationRef.current?.removeEventListener('input', onSaturationInput);
      temperatureRef.current?.removeEventListener('input', onTemperatureInput);
      contrastRef.current?.removeEventListener('input', onContrastInput);
      opacityRef.current?.removeEventListener('input', onOpacityInput);
      blurRef.current?.removeEventListener('input', onBlurInput);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [targetElement?.uniqueId]);

  return (
    <StyledAdjustSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          defaultValue={targetElement?.exposure ?? 0.5}
          label='Exposure'
          showLabel
          sliderRef={exposureRef}
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          defaultValue={targetElement?.saturation ?? 0.5}
          label='Saturation'
          showLabel
          sliderRef={saturationRef}
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          defaultValue={targetElement?.temperature ?? 0.5}
          label='Temperature'
          showLabel
          sliderRef={temperatureRef}
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          defaultValue={targetElement?.contrast ?? 1}
          label='Contrast'
          showLabel
          sliderRef={contrastRef}
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          defaultValue={targetElement?.opacity ?? 1}
          label='Opacity'
          showLabel
          sliderRef={opacityRef}
        />
        <Slider
          minValue={0}
          maxValue={20}
          step={0.1}
          defaultValue={targetElement?.blur ?? 0}
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
          ref={resetRef}
        />
      </ScrollableContainer>
    </StyledAdjustSettings>
  );
};

export { AdjustSettings };
