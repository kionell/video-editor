import { IFileElement } from './Types/IFileElement';
import { IFadeableElement } from './Types/IFadeableElement';
import { IPlayableElement } from './Types/IPlayableElement';
import { AudioFile } from '../Files/AudioFile';
import { BaseElement } from './BaseElement';

/**
 * An audio element that can be placed on a timeline track.
 */
export class AudioElement extends BaseElement
  implements IFileElement, IPlayableElement, IFadeableElement {

  /**
   * Volume of this audio element.
   */
  volume = 1;

  speed = 1;
  reversed = false;

  fadeInTimeMs = 0;
  fadeOutTimeMs = 0;

  file: AudioFile;

  constructor(options: Pick<AudioElement, 'file'> & Partial<AudioElement>) {
    super(options);

    this.file = options.file;
  }

  /**
   * Duration of this audio element.
   */
	set durationMs(value: number) {
    const fileDurationMs = this.file.duration * 1000;

    this._durationMs = Math.max(0, Math.min(value, fileDurationMs));
  }
}
