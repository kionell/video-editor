import { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { UploadedFile } from '../models/Files/UploadedFile';
import { getImageThumbnailURL } from '../utils/thumbnails';

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
  
  const theme = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getThumbnail = async () => {
      return getImageThumbnailURL({
        accentColor1: theme.primary.accent,
        accentColor2: theme.primary.accentHover,
        file,
        width,
        height,
      });
    };

    const setPreview = async () => {
      if (!previewRef.current) return;

      const thumbnailURL = await getThumbnail();

      previewRef.current.style.backgroundImage = `url("${thumbnailURL}")`;
    };
    
    setPreview();
  }, [previewRef, file]);

  return <StyledImagePreview {...props} ref={previewRef} />;
};

export { ImagePreview };
