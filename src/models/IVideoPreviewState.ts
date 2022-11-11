import { AspectRatio } from './Enums/AspectRatio';

/**
 * Video preview state.
 */
export interface IVideoPreviewState {
  /**
   * Aspect ratio of the preview.
   */
  aspectRatio: AspectRatio;

  /**
   * Preview width.
   */
  previewWidth: number;

  /**
   * Preview height.
   */
  previewHeight: number;

  /**
   * Preview frame rate.
   */
  previewFrameRate: number;

  /**
   * Whether this video preview is playing or not.
   */
  isPlaying: boolean;

  /**
   * Whether this video preview is on full screen or not.
   */
  isExpanded: boolean;
}
