import styled from 'styled-components';
import { SecondaryButton } from '../Buttons/SecondaryButton';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { LabeledContainer } from '../Containers/LabeledContainer';
import { NumberInput } from '../Inputs/NumberInput';

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
  return (
    <StyledTransformSettings>
      <ScrollableContainer
        direction='column'
        gap={24}
        padding={24}
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
            iconType='Resize'
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
