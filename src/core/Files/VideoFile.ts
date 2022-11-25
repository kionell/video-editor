import { VideoType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob video file uploaded via inputs.
 */
export class VideoFile extends UploadedFile {
  /**
   * Video MIME type.
   */
	declare type: VideoType;

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
  async load(): Promise<this> {
    return new Promise((resolve) => {
      this.element.addEventListener('canplaythrough', () => {
        resolve(this);
      });

      this.element.addEventListener('error', () => {
        console.warn(`Video "${this.name}" failed to load!`);

        resolve(this);
      });

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

  get hasDuration(): boolean {
    return this.duration > 0;
  }
}
