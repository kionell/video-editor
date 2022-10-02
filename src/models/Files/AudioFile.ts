import { AudioType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob audio file uploaded via inputs.
 */
export class AudioFile extends UploadedFile {
  /**
   * Audio MIME type.
   */
	type: AudioType;

  /**
   * HTML audio element that will store file data.
   */
  element: HTMLAudioElement;

  constructor(file: File) {
    super(file);

    this.type = file.type as AudioType;
    this.element = document.createElement('audio');
  }

  /**
   * Loads this audio file to the HTML audio element.
   */
  async load(): Promise<void> {
    return new Promise((resolve) => {
      this.element.onload = () => {
        resolve();  
      };

      this.element.onerror = () => {
        console.warn(`Audio "${this.name}" failed to load!`);

        resolve();
      };

      this.element.src = this.url;
      this.element.load();
    });
  }

  /**
   * Duration of this audio file in seconds.
   */
  get duration(): number {
    return this.element.duration || 0;
  }
}
