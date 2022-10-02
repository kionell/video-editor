import { useEffect, useRef } from 'react';

export interface PreviewProps {
  width?: number;
  height?: number;
  previewElement?: HTMLElement;
}

const ImagePreview: React.FC<PreviewProps> = (props: PreviewProps) => {
  const { width, height, previewElement } = props;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const draw = (source: CanvasImageSource) => {      
      const sw = source.width as number;
      const sh = source.height as number;
      const scale = canvas.height / sh;
      
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = canvas.width / 2 - dw / 2;
      const dy = canvas.height / 2 - dh / 2;

      context.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);
    };

    if (previewElement instanceof HTMLVideoElement) {
      const onPlay = () => {
        draw(previewElement);

        previewElement.removeEventListener('play', onPlay);
        previewElement.pause();
      };
      
      previewElement.addEventListener('play', onPlay);
      previewElement.play();
    }

    if (previewElement instanceof HTMLImageElement) {
      draw(previewElement);
    }
  }, [canvasRef, previewElement]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
    />
  );
};

export { ImagePreview };
