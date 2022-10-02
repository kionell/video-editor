import styled from 'styled-components';
import React, { forwardRef, Ref, FormEvent } from 'react';
import { UploadedFile } from '../../models/Files/UploadedFile';
import { ImageFile } from '../../models/Files/ImageFile';
import { VideoFile } from '../../models/Files/VideoFile';
import { AudioFile } from '../../models/Files/AudioFile';
import { MIMEType } from '../../models/Enums/MIMEType';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addFile } from '../../store/Reducers/fileSlice';

interface FileInputProps {
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

const StyledFileInput = styled.input.attrs({ type: 'file' })<FileInputProps>`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  cursor: pointer;
`;

async function loadFile(file: File): Promise<UploadedFile | null> {
  switch (file.type) {
    case MIMEType.AVI:
    case MIMEType.MP4:
    case MIMEType.WEBM:
    case MIMEType.MPEG:
      return new VideoFile(file).load();

    case MIMEType.MP3:
    case MIMEType.OGG:
    case MIMEType.WAV:
    case MIMEType.WEBA:
      return new AudioFile(file).load();

    case MIMEType.BPM:
    case MIMEType.GIF:
    case MIMEType.ICO:
    case MIMEType.JPEG:
    case MIMEType.PNG:
    case MIMEType.SVG:
    case MIMEType.WEBP:
      return new ImageFile(file).load();
  }

  return null;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>((
  props: FileInputProps, 
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const dispatch = useAppDispatch();

  const onChange = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    
    if (!input?.files) return;

    console.log(input.files);

    for (const file of input.files) {
      const loaded = await loadFile(file);

      if (!loaded) continue;

      dispatch(addFile(loaded));
    }

    // Reset input files to allow repeated upload.
    input.value = '';
  };

  return <StyledFileInput {...props} onChange={onChange} ref={ref} />;
});

FileInput.displayName = 'File Input';

export { FileInput };
