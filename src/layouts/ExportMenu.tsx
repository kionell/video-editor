import styled from 'styled-components';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { MouseEvent, useEffect, useRef } from 'react';
import { FlexContainer } from '../components/Containers/FlexContainer';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectShowExportMenu } from '../store/Selectors';
import { setExportMenuVisible } from '../store/Reducers/GeneralSlice';
import { TextInput } from '../components/Inputs/TextInput';
import { DropdownMenu } from '../components/Dropdown/DropdownMenu';
import { LabeledContainer } from '../components/Containers/LabeledContainer';
import { Checkbox } from '../components/Inputs/Checkbox';
import { SecondaryButton } from '../components/Buttons/SecondaryButton';
import { PrimaryButton } from '../components/Buttons/PrimaryButton';

const StyledExportMenuArea = styled(FlexContainer)`
  visibility: hidden;
  width: 100%;
  height: 100%;
  padding: 0px;
  gap: 0px;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 9999;
  backdrop-filter: blur(0px) brightness(100%);
  transition: 150ms linear;

  .export-menu {
    transition: 150ms linear;
    opacity: 0;
    transform: translateY(10%);
  }

  &:not(:not(.visible)) {
    visibility: visible;
    backdrop-filter: blur(15px) brightness(50%);

    .export-menu {
      opacity: 1;
      transform: translateY(0%);
    }
  }
`;

const StyledExportMenu = styled(FlexContainer)`
  width: 350px;
  position: relative;
  border-radius: 10px;
  flex-direction: column;
  gap: 32px;
  padding: 24px;
  background-color: ${(props) => props.theme.primary.surface};
`;

const ExportMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector(selectShowExportMenu);

  const exportRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => dispatch(setExportMenuVisible(false));
  const onMenuClick = (e: MouseEvent) => e.stopPropagation();

  useEffect(() => {
    if (!exportRef.current) return;

    if (isVisible && !exportRef.current.classList.contains('visible')) {
      exportRef.current.classList.add('visible');
    }

    if (!isVisible && exportRef.current.classList.contains('visible')) {
      exportRef.current.classList.remove('visible');
    }
  }, [isVisible]);

  return (
    <StyledExportMenuArea
      onClick={closeMenu}
      ref={exportRef}
    >
      <StyledExportMenu
        className='export-menu'
        onClick={onMenuClick}
      >
        <TextInput
          label='File name'
          labelPosition='top'
          labelWeight='Medium'
          placeholder='Untitled'
          showLabel
        />

        <LabeledContainer
          label='Video'
          labelPosition='center'
          direction='column'
          fullWidth
          gap={12}
        >
          <Checkbox label='Include Video'/>
          <FlexContainer gap={12}>
            <TextInput
              width={50}
              label='Width'
              placeholder='1920'
            />
            <TextInput
              width={50}
              label='Height'
              placeholder='1080'
            />
          </FlexContainer>
          <TextInput
            width={50}
            label='Frame Rate'
            placeholder='60'
          />
          <FlexContainer
            align='center'
            gap={12}
          >
            <DropdownMenu
              label='Bitrate Encoding'
              width={60}
              selectedIndex={0}
              options={[
                'VBR',
                'CBR',
              ]}
            />
            <Checkbox label='Two Pass' />
          </FlexContainer>
        </LabeledContainer>

        <LabeledContainer
          label='Audio'
          labelPosition='center'
          direction='column'
          fullWidth
          gap={12}
        >
          <Checkbox label='Include Audio' />
          <DropdownMenu
            label='Sample Rate (Hz)'
            selectedIndex={4}
            options={[
              '48 000',
              '48 000',
              '48 000',
              '48 000',
              '48 000',
            ]}
          />
          <DropdownMenu
            label='Birtrate (Mbps)'
            selectedIndex={4}
            options={[
              '192 000',
              '192 000',
              '192 000',
              '192 000',
              '192 000',
            ]}
          />
        </LabeledContainer>

        <FlexContainer
          fullWidth
          justify='space-between'
        >
          <SecondaryButton
            showIcon={false}
            showLabel
            label='Cancel'
            onClick={closeMenu}
          />
          <PrimaryButton
            showIcon={false}
            showLabel
            label='Render'
          />
        </FlexContainer>
      </StyledExportMenu>
    </StyledExportMenuArea>
  );
};

export { ExportMenu };
