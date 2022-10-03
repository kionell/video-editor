export async function getImageThumbnailURL(source?: HTMLElement, width?: number, height?: number): Promise<string> {
  if (!source) return '';
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return '';
  
  const getFirstFrame = (source: CanvasImageSource) => {
    const sw = source instanceof HTMLVideoElement 
      ? source.videoWidth 
      : source.width as number;

    const sh = source instanceof HTMLVideoElement 
      ? source.videoHeight 
      : source.height as number;
    
    canvas.width = width || sw;
    canvas.height = height || sh;

    const scale = sh ? canvas.height / sh : 1;
    
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = canvas.width / 2 - dw / 2;
    const dy = canvas.height / 2 - dh / 2;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);

    return canvas.toDataURL();
  };

  if (source instanceof HTMLVideoElement) {
    source.currentTime = source.duration * 0.25;

    return getFirstFrame(source);
  }

  if (source instanceof HTMLImageElement) {
    return getFirstFrame(source);
  }

  return '';
}
