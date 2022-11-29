import styled from 'styled-components';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Slider } from '../Inputs/Slider';

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
  return (
    <StyledFadeSettings>
      <ScrollableContainer
        direction='column'
        gap={20}
        padding={20}
        align='start'
      >
        <Slider
          minValue={0}
          maxValue={2}
          step={0.1}
          label='Fade In'
          showLabel
        />
        <Slider
          minValue={0}
          maxValue={2}
          step={0.1}
          label='Fade Out'
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
    </StyledFadeSettings>
  );
};

export { FadeSettings };
