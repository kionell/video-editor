import styled from 'styled-components';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { MouseEvent, useEffect, useRef } from 'react';
import { FlexContainer } from '../components/Containers/FlexContainer';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectShowExportMenu, selectTracks } from '../store/Selectors';
import { setExportMenuVisible } from '../store/Reducers/GeneralSlice';
import { TextInput } from '../components/Inputs/TextInput';
import { DropdownMenu } from '../components/Dropdown/DropdownMenu';
import { LabeledContainer } from '../components/Containers/LabeledContainer';
import { Checkbox } from '../components/Inputs/Checkbox';
import { SecondaryButton } from '../components/Buttons/SecondaryButton';
import { PrimaryButton } from '../components/Buttons/PrimaryButton';
import { Renderer } from '../core/Render/Renderer';
import {
  DEFAULT_AUDIO_BITRATE,
  DEFAULT_AUDIO_SAMPLE_RATE,
  DEFAULT_FRAMERATE,
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_WIDTH,
} from '../constants';
import { getFileFormat, getFileType } from '../core/Render/Utils/Formats';

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
  width: 450px;
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
  const tracks = useAppSelector(selectTracks);

  const renderer = useRef<Renderer>();

  const fileNameRef = useRef<HTMLInputElement>(null);
  const outputFormatRef = useRef<DropdownMenu>(null);

  const outputWidthRef = useRef<HTMLInputElement>(null);
  const outputHeightRef = useRef<HTMLInputElement>(null);
  const frameRateRef = useRef<HTMLInputElement>(null);

  const includeVideoRef = useRef<HTMLInputElement>(null);
  const includeAudioRef = useRef<HTMLInputElement>(null);
  const forceAspectRatioRef = useRef<HTMLInputElement>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => dispatch(setExportMenuVisible(false));
  const onMenuClick = (e: MouseEvent) => e.stopPropagation();

  const renderVideo = async () => {
    if (!renderer.current) {
      renderer.current = new Renderer({
        fileName: fileNameRef.current?.value,
        fileType: getFileType(outputFormatRef.current?.selected),
        outputFormat: getFileFormat(outputFormatRef.current?.selected),
        includeVideo: includeVideoRef.current?.checked,
        width: outputWidthRef.current?.valueAsNumber,
        height: outputHeightRef.current?.valueAsNumber,
        forceAspectRatio: forceAspectRatioRef.current?.checked,
        frameRate: frameRateRef.current?.valueAsNumber,
        includeAudio: includeAudioRef.current?.checked,
      });
    }

    await renderer.current.load();

    const output = await renderer.current.render(tracks);

    console.log(output);
  };

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
        <LabeledContainer
          label='General'
          labelPosition='center'
          direction='column'
          fullWidth
          gap={12}
        >
          <TextInput
            label='File Name'
            placeholder='Untitled'
            inputRef={fileNameRef}
            showLabel
          />
          <DropdownMenu
            label='Output Format'
            selectedIndex={0}
            ref={outputFormatRef}
            options={[
              'mp4 (x264)',
              'wav (AAC)',
            ]}
            disabled={!includeVideoRef.current?.checked}
          />
        </LabeledContainer>

        <LabeledContainer
          label='Video'
          labelPosition='center'
          direction='column'
          fullWidth
          gap={12}
        >
          <Checkbox
            label='Include Video'
            checked
            checkboxRef={includeVideoRef}
          />
          <FlexContainer
            gap={12}
            wrapElements={false}
            align='center'
          >
            <TextInput
              label='Width'
              inputRef={outputWidthRef}
              placeholder={`${DEFAULT_VIDEO_WIDTH}`}
              numbersOnly
            />
            <TextInput
              label='Height'
              inputRef={outputHeightRef}
              placeholder={`${DEFAULT_VIDEO_HEIGHT}`}
              numbersOnly
            />
            <Checkbox
              label='Force Aspect Ratio'
              checkboxRef={forceAspectRatioRef}
              disabled={!includeVideoRef.current?.checked}
            />
          </FlexContainer>
          <TextInput
            label='Frame Rate'
            inputRef={frameRateRef}
            placeholder={`${DEFAULT_FRAMERATE}`}
            numbersOnly
          />
          <FlexContainer
            align='center'
            fullWidth
            wrapElements={false}
            gap={12}
          >
            <DropdownMenu
              label='Bitrate Encoding'
              selectedIndex={0}
              options={[
                'VBR',
                'CBR',
              ]}
              disabled={!includeVideoRef.current?.checked}
            />
            <Checkbox
              label='Two Pass'
              disabled={!includeVideoRef.current?.checked}
            />
          </FlexContainer>
        </LabeledContainer>

        <LabeledContainer
          label='Audio'
          labelPosition='center'
          direction='column'
          fullWidth
          gap={12}
        >
          <Checkbox
            label='Include Audio'
            checked
            checkboxRef={includeAudioRef}
          />
          <DropdownMenu
            label='Sample Rate (Hz)'
            placeholder={DEFAULT_AUDIO_SAMPLE_RATE.toLocaleString()}
            disabled={!includeAudioRef.current?.checked}
          />
          <DropdownMenu
            label='Birtrate (Mbps)'
            placeholder={DEFAULT_AUDIO_BITRATE.toLocaleString()}
            disabled={!includeAudioRef.current?.checked}
          />
        </LabeledContainer>

        <FlexContainer
          fullWidth
          justify='space-between'
          wrapElements={false}
          gap={50}
        >
          <SecondaryButton
            fullWidth
            showIcon={false}
            showLabel
            label='Cancel'
            onClick={closeMenu}
          />
          <PrimaryButton
            fullWidth
            showIcon={false}
            showLabel
            label='Render'
            onClick={renderVideo}
            disabled={
              !includeVideoRef.current.checked
                && !includeAudioRef.current.checked
            }
          />
        </FlexContainer>
      </StyledExportMenu>
    </StyledExportMenuArea>
  );
};

export { ExportMenu };
