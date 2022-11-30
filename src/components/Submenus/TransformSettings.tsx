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

  return (
    <StyledTransformSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <LabeledContainer label='Transform'>
          <SecondaryButton
            showLabel
            label='Crop'
            iconType='Crop'
          />
          <SecondaryButton
            showLabel
            label='Scale'
            iconType='Scale'
          />
        </LabeledContainer>

        <LabeledContainer label='Flip'>
          <SecondaryButton iconType='HorizontalFlip' />
          <SecondaryButton iconType='VerticalFlip' />
        </LabeledContainer>

        <LabeledContainer label='Rotate'>
          <SecondaryButton iconType='RotateLeft' />
          <SecondaryButton iconType='RotateRight' />
          <NumberInput max={359} />
        </LabeledContainer>
      </ScrollableContainer>
    </StyledTransformSettings>
  );
};

export { TransformSettings };
