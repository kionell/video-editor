import styled from 'styled-components';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';

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
  return (
    <StyledAdjustSettings>
      <ScrollableContainer
        direction='column'
        gap={24}
        padding={24}
        align='start'
      >
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          label='Exposure'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          label='Saturation'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          label='Temperature'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          label='Contrast'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={1}
          step={0.01}
          label='Opacity'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={20}
          step={0.1}
          label='Blur'
          showLabel
        />

        <PrimaryButton
          fullWidth
          height={35}
          showIcon={false}
          label='Reset'
          showLabel
        />
      </ScrollableContainer>
    </StyledAdjustSettings>
  );
};

export { AdjustSettings };
