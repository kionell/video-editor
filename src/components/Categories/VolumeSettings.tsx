import styled from 'styled-components';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';

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
          label='Volume'
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
    </StyledVolumeSettings>
  );
};

export { VolumeSettings };
