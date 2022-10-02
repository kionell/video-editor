import { VideoType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob video file uploaded via inputs.
 */
export class VideoFile extends UploadedFile {
  /**
   * Video MIME type.
   */
	type: VideoType;

  /**
   * HTML video element that will store file data.
   */
  element: HTMLVideoElement;

  constructor(file: File) {
    super(file);

    this.type = file.type as VideoType;
    this.element = document.createElement('video');
  }

  /**
   * Loads this video file to the HTML video element.
   */
  async load(): Promise<void> {
    return new Promise((resolve) => {
      this.element.onload = () => {
        resolve();  
      };

      this.element.onerror = () => {
        console.warn(`Video "${this.name}" failed to load!`);

        resolve();
      };

      this.element.src = this.url;
      this.element.load();
    });
  }

  /**
   * Duration of this video file in seconds.
   */
  get duration(): number {
    return this.element.duration || 0;
  }
}
