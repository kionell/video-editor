import styled from 'styled-components';
import { FormEventHandler, ForwardedRef, forwardRef, HTMLAttributes } from 'react';
import { Text } from '../../components/Text';
import { getIconSizeBySizeType, Icon } from '../../components/Icon';
import { FileInput } from '../../components/Inputs/FileInput';
import { LARGE_FONT_SIZE } from '../../constants';

export interface DragUploaderProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  onChange?: FormEventHandler<HTMLInputElement>;
}

const StyledDragUploaderWrapper = styled.div<DragUploaderProps>`
  display: ${(props) => props.visible ? 'flex' : 'none'};
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  backdrop-filter: blur(40px) brightness(50%);
  z-index: 9999;
  overflow: hidden;
`;

const StyledDragUploaderShowArea = styled.div<DragUploaderProps>`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 5px dashed ${(props) => props.theme.primary.accentHover};

  .message-icons {
    fill: ${(props) => props.theme.primary.accentHover};
  }

  .message-labels {
    color: ${(props) => props.theme.primary.accentHover};
  }
`;

const StyledUploadMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
`;

const DragUploadOverlay = forwardRef<HTMLInputElement, DragUploaderProps>((
  props: DragUploaderProps, 
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <StyledDragUploaderWrapper {...props}>
      <StyledDragUploaderShowArea {...props}>
        <StyledUploadMessageWrapper>
          <Icon 
            className='message-icons'
            size={getIconSizeBySizeType('Giant')}
            variant='Plus'
            useColor={false}
          />
          <Text
            className='message-labels'
            text='Drop here to upload' 
            size={LARGE_FONT_SIZE}
            useColor={false} 
          />
        </StyledUploadMessageWrapper>
      </StyledDragUploaderShowArea>
      <FileInput ref={ref} onChange={props.onChange}/>
    </StyledDragUploaderWrapper>
  );
});

DragUploadOverlay.displayName = 'Drag Upload Overlay';

export { DragUploadOverlay };
