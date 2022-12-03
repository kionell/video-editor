import styled from 'styled-components';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { LabeledContainer } from '../Containers/LabeledContainer';
import { NumberInput } from '../Inputs/NumberInput';
import { BaseElement } from '../../core/Elements';
import { ITransformableElement } from '../../core/Elements/Types/ITransformableElement';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFocusedElement } from '../../store';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { useEffect, useRef } from 'react';
import { updateElement } from '../../store/Reducers/TimelineSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { FlexContainer } from '../Containers/FlexContainer';
import {
  DEFAULT_FLIP_X,
  DEFAULT_FLIP_Y,
  DEFAULT_ROTATION,
} from '../../constants';

const StyledTransformSettings = styled.div`
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

const TransformSettings: React.FC = () => {
  const disptach = useAppDispatch();
  const focusedElement = useAppSelector(selectFocusedElement);
  const targetElement = focusedElement as BaseElement & ITransformableElement;

  const flipXRef = useRef<HTMLButtonElement>(null);
  const flipYRef = useRef<HTMLButtonElement>(null);
  const rotateLeftRef = useRef<HTMLButtonElement>(null);
  const rotateRightRef = useRef<HTMLButtonElement>(null);
  const customRotateRef = useRef<HTMLInputElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const onFlipX = () => {
    disptach(updateElement({
      flipX: !targetElement.flipX,
      element: targetElement,
    }));
  };

  const onFlipY = () => {
    disptach(updateElement({
      flipY: !targetElement.flipY,
      element: targetElement,
    }));
  };

  const onRotateLeft = () => {
    const degrees = targetElement.rotation - 90;
    const rotation = degrees < 0 ? degrees + 360 : degrees;

    disptach(updateElement({
      element: targetElement,
      rotation,
    }));

    if (customRotateRef.current) {
      customRotateRef.current.valueAsNumber = rotation;
    }
  };

  const onRotateRight = () => {
    const degrees = targetElement.rotation + 90;
    const rotation = degrees >= 360 ? degrees - 360 : degrees;

    disptach(updateElement({
      element: targetElement,
      rotation,
    }));

    if (customRotateRef.current) {
      customRotateRef.current.valueAsNumber = rotation;
    }
  };

  const onCustomRotate = useDebounce((event: Event) => {
    const input = event.target as HTMLInputElement;

    disptach(updateElement({
      rotation: input.valueAsNumber,
      element: targetElement,
    }));
  });

  const onReset = () => {
    disptach(updateElement({
      flipX: DEFAULT_FLIP_X,
      flipY: DEFAULT_FLIP_Y,
      rotation: DEFAULT_ROTATION,
      element: targetElement,
    }));
  };

  useEffect(() => {
    if (!targetElement) return;

    if (customRotateRef.current) {
      customRotateRef.current.valueAsNumber = targetElement.rotation;
    }

    flipXRef.current?.addEventListener('click', onFlipX);
    flipYRef.current?.addEventListener('click', onFlipY);
    rotateLeftRef.current?.addEventListener('click', onRotateLeft);
    rotateRightRef.current?.addEventListener('click', onRotateRight);
    customRotateRef.current?.addEventListener('change', onCustomRotate);
    resetRef.current?.addEventListener('click', onReset);

    return () => {
      flipXRef.current?.removeEventListener('click', onFlipX);
      flipYRef.current?.removeEventListener('click', onFlipY);
      rotateLeftRef.current?.removeEventListener('click', onRotateLeft);
      rotateRightRef.current?.removeEventListener('click', onRotateRight);
      customRotateRef.current?.removeEventListener('change', onCustomRotate);
      resetRef.current?.removeEventListener('click', onReset);
    };
  }, [
    targetElement?.uniqueId,
    targetElement?.flipX,
    targetElement?.flipY,
    targetElement?.rotation,
  ]);

  return (
    <StyledTransformSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <LabeledContainer label='Flip' gap={6}>
          <SecondaryButton iconType='HorizontalFlip' buttonRef={flipXRef} />
          <SecondaryButton iconType='VerticalFlip' buttonRef={flipYRef} />
        </LabeledContainer>

        <LabeledContainer label='Rotate' fullWidth justify='space-between'>
          <FlexContainer gap={6}>
            <SecondaryButton iconType='RotateLeft' buttonRef={rotateLeftRef} />
            <SecondaryButton iconType='RotateRight' buttonRef={rotateRightRef} />
          </FlexContainer>
          <NumberInput max={359} inputRef={customRotateRef} />
        </LabeledContainer>

        <PrimaryButton
          fullWidth
          height={35}
          showIcon={false}
          label='Reset'
          showLabel
          buttonRef={resetRef}
        />
      </ScrollableContainer>
    </StyledTransformSettings>
  );
};

export { TransformSettings };
