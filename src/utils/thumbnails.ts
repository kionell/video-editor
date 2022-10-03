import { UploadedFile } from '../models/Files/UploadedFile';
import { VideoFile } from '../models/Files/VideoFile';
import { ImageFile } from '../models/Files/ImageFile';
import { AudioFile } from '../models/Files/AudioFile';

interface ThumbnailOptions {
  file?: UploadedFile;
  width?: number;
  height?: number;
  backgroundColor?: string;
  accentColor?: string;
}

export async function getImageThumbnailURL(options?: ThumbnailOptions): Promise<string> {
  if (!options?.file) return '';

  if (options?.file instanceof VideoFile) {
    return drawImage(options);
  }

  if (options?.file instanceof ImageFile) {
    return drawImage(options);
  }

  if (options?.file instanceof AudioFile) {
    const audioBuffer = await options.file.getAudioBuffer();
    const bounds = calculateWaveData(audioBuffer, options.width);

    return drawWaveform(bounds, options);
  }

  return '';
}

/**
 * Draws a video/image element to the canvas and returns data URL.
 * @param options Thumbnail options
 * @returns Thumbnail URL or empty string.
 */
function drawImage(options?: ThumbnailOptions): string {
  if (!options?.file?.element) return '';

  const source = options.file.element as CanvasImageSource;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return '';
  
  const sw = source instanceof HTMLVideoElement 
    ? source.videoWidth 
    : source.width as number;

  const sh = source instanceof HTMLVideoElement 
    ? source.videoHeight 
    : source.height as number;
  
  canvas.width = options.width || sw;
  canvas.height = options.height || sh;

  const scale = sh ? canvas.height / sh : 1;
  
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = canvas.width / 2 - dw / 2;
  const dy = canvas.height / 2 - dh / 2;

  context.fillStyle = options.backgroundColor ?? 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);

  return canvas.toDataURL();
}

/**
 * Draw a waveform on a canvas
 * buffer - waveform buffer
 * canvas - HTML5 canvas reference
 * style - line style to use (color)
 */
 export function drawWaveform(bounds: AudioBounds[], options?: ThumbnailOptions): string {
  if (!bounds.length) return '';
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return '';

  if (options?.width) canvas.width = options.width;
  if (options?.height) canvas.height = options.height;

  context.fillStyle = options?.accentColor ?? 'white';
  context.strokeStyle = options?.accentColor ?? 'white';

  // Find the max height we can draw
  const maxAmplitude = canvas.height / 2;

  // Extra height scale factor.
  const scaleFactor = 0.8;

  context.moveTo(0, maxAmplitude);

  for (let i = 0; i < bounds.length; ++i) {
    const range = bounds[i].max - bounds[i].min;
    const height = Math.max(1, range * maxAmplitude * scaleFactor);
    const x = i;
    const y = (canvas.height - height) / 2;

    context.lineTo(x, y);
    context.lineTo(x + 0.5, y + height);
  }

  context.stroke();

  return canvas.toDataURL();
}

interface AudioBounds {
  min: number;
  max: number;
}

/**
 * Calculates all wave data points depending on the total width and width of a point.
 * @param buffer Buffer with audio data.
 * @param width Total width of the waveform in pixels.
 * @param pointWidth Width of one waveform bar.
 */
function calculateWaveData(buffer: AudioBuffer | null, width?: number): AudioBounds[] {
  if (!buffer || !width) return [];

  const wave = buffer.getChannelData(0);
  const totalPoints = width;

  // Get array of bounds of each step
  return getBoundArray(wave, totalPoints);
}

/**
 * Calculate the bounds of each step in the buffer.
 * @param wave Current audio channel data.
 * @param totalPoints How many points will be drawn.
 */
function getBoundArray(wave: Float32Array, totalPoints: number) {
  // Find how many steps we are going to draw
  const step = Math.ceil(wave.length / totalPoints);

  const bounds: AudioBounds[] = [];

  for (let i = 0; i < totalPoints; i++) {
    const waveSlice = wave.slice(i * step, i * step + step);

    bounds.push(getBounds(waveSlice));
  }

  return bounds;
}

/**
 * Get the max and min values of an array.
 * @param waveSlice Slice of the wave data.
 * @returns Min and max points at this slice.
 */
function getBounds(waveSlice: Float32Array): AudioBounds {
  return waveSlice.reduce((total: AudioBounds, nextValue: number) => {
    total.max = nextValue > total.max ? nextValue : total.max;
    total.min = nextValue < total.min ? nextValue : total.min;

    return total;
  }, { max: -1.0, min: 1.0 });
}
