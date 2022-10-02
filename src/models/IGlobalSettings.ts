import { AspectRatio } from './Enums/AspectRatio';


/**
 * Global settings of the project.
 */
export interface IGlobalSettings {
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
}
