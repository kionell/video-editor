import styled from 'styled-components';
import { FlatButton } from '../components/Buttons/FlatButton';
import { PrimaryButton } from '../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../components/Buttons/SecondaryButton';
import { ScrollableContainer } from '../components/Containers/ScrollableContainer';
import { DropdownMenu } from '../components/Dropdown/DropdownMenu';
import { Checkbox } from '../components/Inputs/Checkbox';
import { NumberInput } from '../components/Inputs/NumberInput';
import { Slider } from '../components/Inputs/Slider';
import { TextInput } from '../components/Inputs/TextInput';
import { GeneralItem } from '../components/Items/GeneralItem';
import { UploadItem } from '../components/Items/UploadItem';

const StyledDebugPage = styled(ScrollableContainer)`
  flex-direction: column;
  gap: 0px;
  padding: 0px;
`;

export const DebugPage: React.FC = () => {
  return (
    <StyledDebugPage>
      <PrimaryButton />
      <PrimaryButton disabled />
      <SecondaryButton />
      <SecondaryButton disabled />
      <FlatButton />
      <FlatButton disabled />

      <DropdownMenu
        options={[
          'Option 1',
          'Option 2',
          'Option 3',
        ]}
      />

      <DropdownMenu
        disabled
        options={[
          'Option 1',
          'Option 2',
          'Option 3',
        ]}
      />

      <Checkbox />
      <Checkbox disabled />
      <NumberInput />
      <NumberInput disabled />
      <Slider />
      <Slider disabled />
      <TextInput />
      <TextInput disabled />

      <GeneralItem />
      <UploadItem />
    </StyledDebugPage>
  );
};
