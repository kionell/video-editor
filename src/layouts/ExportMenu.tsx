import styled from 'styled-components';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { MouseEvent, useEffect, useRef, useState } from 'react';
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
import { getFileFormat, getFileType } from '../core/Render/Utils/Formats';
import {
  DEFAULT_AUDIO_BITRATE,
  DEFAULT_AUDIO_SAMPLE_RATE,
  DEFAULT_FRAMERATE,
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_WIDTH,
} from '../constants';

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

  const [isVideoIncluded, setVideoIncluded] = useState(true);
  const [isAudioIncluded, setAudioIncluded] = useState(true);
  const [currentAspectRatio, setApectRatio] = useState(1);

  const renderer = useRef<Renderer>();

  const fileNameRef = useRef<HTMLInputElement>(null);
  // const outputFormatRef = useRef<DropdownMenu>(null);

  const outputWidthRef = useRef<HTMLInputElement>(null);
  const outputHeightRef = useRef<HTMLInputElement>(null);
  const frameRateRef = useRef<HTMLInputElement>(null);

  const includeVideoRef = useRef<HTMLInputElement>(null);
  const includeAudioRef = useRef<HTMLInputElement>(null);
  const forceAspectRatioRef = useRef<HTMLInputElement>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => dispatch(setExportMenuVisible(false));
  const onMenuClick = (e: MouseEvent) => e.stopPropagation();

  const updateAspectRatio = () => {
    const width = parseFloat(
      outputWidthRef.current?.value || outputWidthRef.current?.placeholder,
    );

    if (!width) return;

    const height = parseFloat(
      outputHeightRef.current?.value || outputHeightRef.current?.placeholder,
    );

    setApectRatio(width / height);
  };

  const syncOutputWidth = () => {
    if (!forceAspectRatioRef.current?.checked) return;

    if (!outputWidthRef.current || !outputHeightRef.current) return;

    if (!outputHeightRef.current?.value && outputWidthRef.current) {
      outputWidthRef.current.value = '';

      return;
    }

    const height = parseFloat(
      outputHeightRef.current?.value || outputHeightRef.current?.placeholder,
    );

    outputWidthRef.current.value = (height * currentAspectRatio).toFixed(0);
  };

  const syncOutputHeight = () => {
    if (!forceAspectRatioRef.current?.checked) return;

    if (!outputWidthRef.current || !outputHeightRef.current) return;

    if (!outputWidthRef.current?.value && outputHeightRef.current) {
      outputHeightRef.current.value = '';

      return;
    }

    const width = parseFloat(
      outputWidthRef.current?.value || outputWidthRef.current?.placeholder,
    );

    outputHeightRef.current.value = (width / currentAspectRatio).toFixed(0);
  };

  const renderVideo = async () => {
    if (!renderer.current) {
      renderer.current = new Renderer({
        fileName: fileNameRef.current?.value,
        // fileType: getFileType(outputFormatRef.current?.selected),
        // outputFormat: getFileFormat(outputFormatRef.current?.selected),
        includeVideo: includeVideoRef.current?.checked,
        width: Number(outputWidthRef.current?.value),
        height: Number(outputHeightRef.current?.value),
        forceAspectRatio: forceAspectRatioRef.current?.checked,
        frameRate: Number(frameRateRef.current?.value),
        includeAudio: includeAudioRef.current?.checked,
      });
    }

    await renderer.current.load();
    await renderer.current.render(tracks);
  };

  useEffect(() => {
    if (!exportRef.current) return;

    isVisible
      ? exportRef.current.classList.add('visible')
      : exportRef.current.classList.remove('visible');
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
            // ref={outputFormatRef}
            options={[
              'mp4 (x264)',
              'wav (AAC)',
            ]}
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
            onCheck={() => setVideoIncluded(true)}
            onUncheck={() => setVideoIncluded(false)}
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
              disabled={!isVideoIncluded}
              onChange={syncOutputHeight}
              numbersOnly
            />
            <TextInput
              label='Height'
              inputRef={outputHeightRef}
              placeholder={`${DEFAULT_VIDEO_HEIGHT}`}
              disabled={!isVideoIncluded}
              onChange={syncOutputWidth}
              numbersOnly
            />
            <Checkbox
              label='Force Aspect Ratio'
              checkboxRef={forceAspectRatioRef}
              onCheck={updateAspectRatio}
              disabled={!isVideoIncluded}
            />
          </FlexContainer>
          <TextInput
            label='Frame Rate'
            inputRef={frameRateRef}
            placeholder={`${DEFAULT_FRAMERATE}`}
            disabled={!isVideoIncluded}
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
              disabled={!isVideoIncluded}
            />
            <Checkbox
              label='Two Pass'
              disabled={!isVideoIncluded}
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
            onCheck={() => setAudioIncluded(true)}
            onUncheck={() => setAudioIncluded(false)}
          />
          <DropdownMenu
            label='Sample Rate (Hz)'
            placeholder={DEFAULT_AUDIO_SAMPLE_RATE.toLocaleString()}
            disabled={!isAudioIncluded}
          />
          <DropdownMenu
            label='Birtrate (Mbps)'
            placeholder={DEFAULT_AUDIO_BITRATE.toLocaleString()}
            disabled={!isAudioIncluded}
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
            disabled={!isVideoIncluded && !isAudioIncluded}
          />
        </FlexContainer>
      </StyledExportMenu>
    </StyledExportMenuArea>
  );
};

export { ExportMenu };
