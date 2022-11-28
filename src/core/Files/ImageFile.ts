import { ImageType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob image file uploaded via inputs.
 */
export class ImageFile extends UploadedFile {
  /**
   * Image MIME type.
   */
	declare type: ImageType;

  /**
   * HTML image element that will store file data.
   */
  source: HTMLImageElement;

  constructor(file: File) {
    super(file);

    this.type = file.type as ImageType;
    this.source = document.createElement('img');
  }

  /**
   * Loads this image file to the HTML image element.
   */
  async load(): Promise<this> {
    return new Promise((resolve) => {
      this.source.addEventListener('load', () => {
        resolve(this);
      }, { once: true });

      this.source.addEventListener('error', () => {
        console.warn(`Image "${this.name}" failed to load!`);

        resolve(this);
      }, { once: true });

      this.source.src = this.url;
    });
  }

  /**
   * Duration of this image file in seconds.
   */
  get duration(): number {
    return 0;
  }

  get hasDuration(): boolean {
    return false;
  }
}
