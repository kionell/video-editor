import { AudioType } from '../Enums/MIMEType';
import { UploadedFile } from './UploadedFile';

/**
 * Describes a blob audio file uploaded via inputs.
 */
export class AudioFile extends UploadedFile {
  /**
   * Audio MIME type.
   */
	declare type: AudioType;

  /**
   * HTML audio element that will store file data.
   */
  source: HTMLAudioElement;

  /**
   * Reference to this file for getting audio buffer.
   */
  private _file: File;

  constructor(file: File) {
    super(file);

    this.type = file.type as AudioType;
    this.source = document.createElement('audio');
    this._file = file;
  }

  /**
   * Loads this audio file to the HTML audio element.
   */
  async load(): Promise<this> {
    return new Promise((resolve) => {
      this.source.addEventListener('loadeddata', () => {
        resolve(this);
      }, { once: true });

      this.source.addEventListener('error', () => {
        console.warn(`Audio "${this.name}" failed to load!`);

        resolve(this);
      }, { once: true });

      this.source.src = this.url;
      this.source.load();
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
    return this.source.duration || 0;
  }

  get hasDuration(): boolean {
    return this.duration > 0;
  }
}
