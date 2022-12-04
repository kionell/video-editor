import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { NumberInput } from '../Inputs/NumberInput';
import { updateElement } from '../../store/Reducers/TimelineSlice';
import { BaseElement } from '../../core/Elements';
import { IPlayableElement } from '../../core/Elements/Types/IPlayableElement';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFocusedElement } from '../../store';
import { useDebounce } from '../../hooks/useDebounce';
import { DEFAULT_MAX_SPEED, DEFAULT_MIN_SPEED, DEFAULT_SPEED, DEFAULT_SPEED_STEP } from '../../constants';

const StyledSpeedSettings = styled.div`
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

const SpeedSettings: React.FC = () => {
  const disptach = useAppDispatch();
  const focusedElement = useAppSelector(selectFocusedElement);
  const targetElement = focusedElement as BaseElement & IPlayableElement;

  const speedRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onSpeedChange = useDebounce((event: Event) => {
    const input = event.target as HTMLInputElement;

    disptach(updateElement({
      speed: input.valueAsNumber,
      element: targetElement,
    }));
  });

  const onReset = () => {
    disptach(updateElement({
      speed: DEFAULT_SPEED,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    if (speedRef.current) {
      speedRef.current.value = targetElement.speed.toFixed(2);
    }

    speedRef.current?.addEventListener('change', onSpeedChange);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      speedRef.current?.removeEventListener('change', onSpeedChange);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [
    targetElement?.uniqueId,
    targetElement?.speed,
  ]);

  return (
    <StyledSpeedSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <NumberInput
          min={DEFAULT_MIN_SPEED}
          max={DEFAULT_MAX_SPEED}
          step={DEFAULT_SPEED_STEP}
          loop={false}
          defaultValue={targetElement?.speed ?? DEFAULT_SPEED}
          label='Speed'
          showLabel
          inputRef={speedRef}
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
    </StyledSpeedSettings>
  );
};

export { SpeedSettings };
