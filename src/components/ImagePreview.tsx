import { useEffect, useRef } from 'react';
import { WaveForm } from 'wavesurfer-react';
import styled from 'styled-components';
import { UploadedFile } from '../models/Files/UploadedFile';
import { getImageThumbnailURL } from '../utils/thumbnail';
// import { getImageThumbnailURL } from '../utils/thumbnail';

export interface PreviewProps {
  width?: number;
  height?: number;
  file?: UploadedFile;
}

const StyledImagePreview = styled.div<PreviewProps>`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
`;

const ImagePreview: React.FC<PreviewProps> = (props: PreviewProps) => {
  const { width, height, file } = props;
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getThumbnail = async () => {
      if (file?.element instanceof HTMLAudioElement) {
        
      }

      return getImageThumbnailURL(file?.element, width, height);
    };

    const setPreview = async () => {
      if (!previewRef.current) return;

      const thumbnailURL = await getThumbnail();

      previewRef.current.style.backgroundImage = `url("${thumbnailURL}")`;
    };
    
    setPreview();
  }, [previewRef, file]);

  return (
    <StyledImagePreview {...props} ref={previewRef}>
      <WaveForm />
    </StyledImagePreview>
  );
};

export { ImagePreview };
