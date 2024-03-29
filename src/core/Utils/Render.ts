import { UploadedFile } from '../Files/UploadedFile';
import { VideoFile } from '../Files/VideoFile';
import { ImageFile } from '../Files/ImageFile';
import { AudioFile } from '../Files/AudioFile';
import { AudioBounds } from '../Types/AudioBounds';
import { Viewport } from '../Types/Viewport';

interface ThumbnailOptions {
  file: UploadedFile;
  width?: number;
  height?: number;
  backgroundColor?: string;
  accentColor1?: string;
  accentColor2?: string;
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
function drawImage(options: ThumbnailOptions): string {
  if (!options.file.source) return '';

  const source = options.file.source as CanvasImageSource;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return '';

  const { sw, sh, dx, dy, dw, dh } = getViewport(options);

  canvas.width = options.width || sw;
  canvas.height = options.height || sh;

  context.fillStyle = options.backgroundColor ?? 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);

  return canvas.toDataURL();
}

export function getViewport(options: ThumbnailOptions): Viewport {
  const source = options.file.source as CanvasImageSource;

  const sw = source instanceof HTMLVideoElement
    ? source.videoWidth
    : source.width as number;

  const sh = source instanceof HTMLVideoElement
    ? source.videoHeight
    : source.height as number;

  const width = options.width || sw;
  const height = options.height || sh;

  const scale = sh ? height / sh : 1;

  const dw = sw * scale;
  const dh = sh * scale;
  const dx = width / 2 - dw / 2;
  const dy = height / 2 - dh / 2;

  return new Viewport({ sw, sh, dx, dy, dw, dh });
}

/**
 * Draws a waveform on a canvas.
 * @param bounds Audio bounds of each step in the buffer.
 * @param options Thumbnail options.
 */
 export function drawWaveform(bounds: AudioBounds[], options: ThumbnailOptions): string {
  if (!bounds.length) return '';

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return '';

  if (options?.width) canvas.width = options.width;
  if (options?.height) canvas.height = options.height;

  // Extra height scale factor.
  const scaleFactor = 0.8;

  // Find the max height we can draw
  const maxAmplitude = canvas.height / 2 * scaleFactor;
  const paddingY = canvas.height / 2 - maxAmplitude;

  const accentColor1 = options?.accentColor1 ?? 'lightgray';
  const accentColor2 = options?.accentColor2 ?? options?.accentColor1 ?? 'white';
  const gradient = context.createLinearGradient(0, paddingY, 0, canvas.height - paddingY);

  gradient.addColorStop(0.0, accentColor1 + '11');
  gradient.addColorStop(0.3, accentColor1 + 'AA');
  gradient.addColorStop(0.5, accentColor2 + 'FF');
  gradient.addColorStop(0.7, accentColor1 + 'AA');
  gradient.addColorStop(1.0, accentColor1 + '11');

  context.strokeStyle = gradient;
  context.moveTo(0, maxAmplitude);

  for (let i = 0; i < bounds.length; ++i) {
    const range = bounds[i].max - bounds[i].min;
    const height = Math.max(1, range * maxAmplitude);
    const x = i;
    const y = (canvas.height - height) / 2;

    context.lineTo(x, y);
    context.lineTo(x + 0.5, y + height);
  }

  context.stroke();

  return canvas.toDataURL();
}

/**
 * Calculates all wave data points depending on the total width and width of a point.
 * @param buffer Buffer with audio data.
 * @param width Total width of the waveform in pixels.
 */
function calculateWaveData(buffer: AudioBuffer | null, width?: number): AudioBounds[] {
  if (!buffer || !width) return [];

  const wave = buffer.getChannelData(0);
  const totalPoints = width;

  // Get array of bounds of each step
  return getAudioBoundArray(wave, totalPoints);
}

/**
 * Calculate the bounds of each step in the buffer.
 * @param wave Current audio channel data.
 * @param totalPoints How many points will be drawn.
 */
function getAudioBoundArray(wave: Float32Array, totalPoints: number) {
  // Find how many steps we are going to draw
  const step = Math.ceil(wave.length / totalPoints);

  const bounds: AudioBounds[] = [];

  for (let i = 0; i < totalPoints; i++) {
    const waveSlice = wave.slice(i * step, i * step + step);

    bounds.push(getAudioBounds(waveSlice));
  }

  return bounds;
}

/**
 * Get the max and min values of an array.
 * @param waveSlice Slice of the wave data.
 * @returns Min and max points at this slice.
 */
function getAudioBounds(waveSlice: Float32Array): AudioBounds {
  return waveSlice.reduce((total: AudioBounds, nextValue: number) => {
    total.max = nextValue > total.max ? nextValue : total.max;
    total.min = nextValue < total.min ? nextValue : total.min;

    return total;
  }, new AudioBounds());
}
