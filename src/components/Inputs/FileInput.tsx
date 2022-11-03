import styled from 'styled-components';
import React, { forwardRef, Ref, FormEvent } from 'react';
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

const FileInput = forwardRef<HTMLInputElement, FileInputProps>((
  props: FileInputProps, 
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const dispatch = useAppDispatch();

  const onChange = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    
    if (!input?.files) return;

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
