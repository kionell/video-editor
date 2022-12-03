import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';
import { updateElement } from '../../store/Reducers/TimelineSlice';
import { BaseElement } from '../../core/Elements';
import { IHasAudio } from '../../core/Elements/Types/IHasAudio';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFocusedElement } from '../../store';
import { useDebounce } from '../../hooks/useDebounce';
import { DEFAULT_VOLUME } from '../../constants';

const StyledVolumeSettings = styled.div`
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

const VolumeSettings: React.FC = () => {
  const disptach = useAppDispatch();
  const focusedElement = useAppSelector(selectFocusedElement);
  const targetElement = focusedElement as BaseElement & IHasAudio;

  const volumeRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onVolumeInput = useDebounce((event: Event) => {
    const slider = event.target as HTMLInputElement;

    disptach(updateElement({
      volume: slider.valueAsNumber,
      element: targetElement,
    }));
  });

  const onReset = () => {
    disptach(updateElement({
      volume: DEFAULT_VOLUME,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    if (volumeRef.current) {
      volumeRef.current.valueAsNumber = targetElement.volume;
      volumeRef.current.dispatchEvent(new Event('input'));
    }

    volumeRef.current?.addEventListener('input', onVolumeInput);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      volumeRef.current?.removeEventListener('input', onVolumeInput);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [
    targetElement?.uniqueId,
    targetElement?.volume,
  ]);

  return (
    <StyledVolumeSettings>
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
          defaultValue={targetElement?.volume ?? 1}
          label='Volume'
          showLabel
          sliderRef={volumeRef}
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
    </StyledVolumeSettings>
  );
};

export { VolumeSettings };
