import { ImageType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob image file uploaded via inputs.
 */
export class ImageFile extends UploadedFile {
  /**
   * Image MIME type.
   */
	type: ImageType;

  /**
   * HTML image element that will store file data.
   */
  element: HTMLImageElement;

  constructor(file: File) {
    super(file);

    this.type = file.type as ImageType;
    this.element = document.createElement('img');
  }

  /**
   * Loads this image file to the HTML image element.
   */
  async load(): Promise<void> {
    return new Promise((resolve) => {
      this.element.onload = () => {
        resolve();  
      };

      this.element.onerror = () => {
        console.warn(`Image "${this.name}" failed to load!`);

        resolve();
      };

      this.element.src = this.url;
    });
  }
}