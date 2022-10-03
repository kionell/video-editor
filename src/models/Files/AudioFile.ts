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

  /**
   * Reference to this file for getting audio buffer.
   */
  private _file: File;

  constructor(file: File) {
    super(file);

    this.type = file.type as AudioType;
    this.element = document.createElement('audio');
    this._file = file;
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

  async getAudioBuffer(): Promise<AudioBuffer | null> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      
      fileReader.onload = (event) => {
        const result = event.target?.result as ArrayBuffer;
        
        if (!result) return resolve(null);

        const audioContext = new AudioContext();

        audioContext.decodeAudioData(result)
          .then((audioBuffer) => resolve(audioBuffer))
          .catch(() => resolve(null));
      };

      fileReader.onerror = () => resolve(null);
      
      fileReader.readAsArrayBuffer(this._file);
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
