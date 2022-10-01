import styled from 'styled-components';
import React, { FormEventHandler, forwardRef, Ref } from 'react';

interface FileInputProps {
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  onChange?: FormEventHandler<HTMLInputElement>;
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
  return <StyledFileInput {...props} ref={ref} />;
});

FileInput.displayName = 'File Input';

export { FileInput };
