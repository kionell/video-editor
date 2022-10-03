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
  async load(): Promise<this> {
    return new Promise((resolve) => {
      this.element.addEventListener('canplaythrough', () => {
        resolve(this);
      });

      this.element.addEventListener('error', () => {
        console.warn(`Audio "${this.name}" failed to load!`);

        resolve(this);
      });

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

  get hasDuration(): boolean {
    return this.duration > 0;
  }
}
