import styled from 'styled-components';
import React, { forwardRef, Ref, FormEvent } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addFile } from '../../store/Reducers/FileSlice';
import { ffmpeg } from '../../lib/FFmpeg';
import { loadFile } from '../../core/Utils/Files';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { useAppSelector } from '../../hooks/useAppSelector';

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

const FileInput = forwardRef<HTMLInputElement, FileInputProps>((
  props: FileInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const files = useAppSelector((state) => state.files);
  const dispatch = useAppDispatch();

  const onChange = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;

    if (!input?.files) return;

    for (const file of input.files) {
      const loaded = await loadFile(file);

      if (!loaded) continue;

      dispatch(addFile(loaded));
    }

    // const file = input.files[0];

    // ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    // // Reset input files to allow repeated upload.
    // input.value = '';

    // // if (files.list.length < 3) return;

    // await ffmpeg.run(
    //   '-i', file.name, 
    //   '-c:v', 'copy', 
    //   '-preset', 'ultrafast',
    //   // '-vf', 'scale=88:50',
    //   // '-crf', '50',
    //   'output.mp4'
    // );

    // const buffer = ffmpeg.FS('readFile', 'output.mp4');

    // const link = document.createElement('a');

    // link.type = 'download';
    // link.href = URL.createObjectURL(new Blob([buffer]));
    // link.download = 'output.mp4';
    // link.click();
  };

  return <StyledFileInput {...props} onChange={onChange} ref={ref} />;
});

FileInput.displayName = 'File Input';

export { FileInput };
