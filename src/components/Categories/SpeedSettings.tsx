import styled from 'styled-components';
import { ScrollableContainer } from '../Containers/ScrollableContainer';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { NumberInput } from '../Inputs/NumberInput';

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
  return (
    <StyledSpeedSettings>
      <ScrollableContainer
        direction='column'
        gap={24}
        padding={24}
        align='start'
      >
        <NumberInput
          min={0.25}
          max={3.00}
          step={0.01}
          loop={false}
          label='Speed'
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
    </StyledSpeedSettings>
  );
};

export { SpeedSettings };
