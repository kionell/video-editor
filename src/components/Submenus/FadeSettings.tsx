import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';
import { updateElement } from '../../store/Reducers/TimelineSlice';
import { IFadeableElement } from '../../core/Elements/Types/IFadeableElement';
import { BaseElement } from '../../core/Elements';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFocusedElement } from '../../store';
import { useDebounce } from '../../hooks/useDebounce';
import { DEFAULT_FADE_IN, DEFAULT_FADE_OUT, DEFAULT_FADE_STEP, DEFAULT_MAX_FADE, DEFAULT_MIN_FADE } from '../../constants';

const StyledFadeSettings = styled.div`
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

const FadeSettings: React.FC = () => {
  const disptach = useAppDispatch();
  const focusedElement = useAppSelector(selectFocusedElement);
  const targetElement = focusedElement as BaseElement & IFadeableElement;

  const fadeInRef = useRef<HTMLInputElement>(null);
  const fadeOutRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onFadeInInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      fadeInTimeMs: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onFadeOutInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      fadeOutTimeMs: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onReset = () => {
    disptach(updateElement({
      fadeInTimeMs: DEFAULT_FADE_IN,
      fadeOutTimeMs: DEFAULT_FADE_OUT,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    if (fadeInRef.current) {
      fadeInRef.current.valueAsNumber = targetElement.fadeInTimeMs;
      fadeInRef.current.dispatchEvent(new Event('input'));
    }

    if (fadeOutRef.current) {
      fadeOutRef.current.valueAsNumber = targetElement.fadeOutTimeMs;
      fadeOutRef.current.dispatchEvent(new Event('input'));
    }

    fadeInRef.current?.addEventListener('input', onFadeInInput);
    fadeOutRef.current?.addEventListener('input', onFadeOutInput);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      fadeInRef.current?.removeEventListener('input', onFadeInInput);
      fadeOutRef.current?.removeEventListener('input', onFadeOutInput);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [
    targetElement?.uniqueId,
    targetElement?.fadeInTimeMs,
    targetElement?.fadeOutTimeMs,
  ]);

  return (
    <StyledFadeSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <Slider
          minValue={DEFAULT_MIN_FADE}
          maxValue={DEFAULT_MAX_FADE}
          step={DEFAULT_FADE_STEP}
          defaultValue={targetElement?.fadeInTimeMs ?? DEFAULT_FADE_IN}
          label='Fade In (ms)'
          showLabel
          sliderRef={fadeInRef}
        />
        <Slider
          minValue={DEFAULT_MIN_FADE}
          maxValue={DEFAULT_MAX_FADE}
          step={DEFAULT_FADE_STEP}
          defaultValue={targetElement?.fadeOutTimeMs ?? DEFAULT_FADE_IN}
          label='Fade Out (ms)'
          showLabel
          sliderRef={fadeOutRef}
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
    </StyledFadeSettings>
  );
};

export { FadeSettings };
