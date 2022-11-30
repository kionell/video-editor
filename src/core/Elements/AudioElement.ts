import { IFileElement } from './Types/IFileElement';
import { IFadeableElement } from './Types/IFadeableElement';
import { IPlayableElement } from './Types/IPlayableElement';
import { AudioFile } from '../Files/AudioFile';
import { BaseElement } from './BaseElement';
import { MediaType } from '../Enums/MediaType';
import { IHasAudio } from './Types/IHasAudio';

/**
 * An audio element that can be placed on a timeline track.
 */
export class AudioElement extends BaseElement
  implements IFileElement, IPlayableElement, IFadeableElement, IHasAudio {

  /**
   * Volume of this audio element.
   */
  volume = 1;
  speed = 1;

  fadeInTimeMs = 0;
  fadeOutTimeMs = 0;

  file: AudioFile;

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Audio;

  constructor(file: AudioFile) {
    super();

    this.file = file;
  }

  /**
   * Duration of this audio element.
   */
  get totalDurationMs(): number {
    const fileDurationMs = this.file.duration * 1000;

    return Math.max(0, this._totalDurationMs ?? fileDurationMs);
  }

	set totalDurationMs(value: number) {
    const fileDurationMs = this.file.duration * 1000;

    this._totalDurationMs = Math.max(0, Math.min(value, fileDurationMs));
  }
}
