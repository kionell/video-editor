import { AudioFile } from '../Files/AudioFile';
import { BaseElement } from './BaseElement';
import { MediaType } from '../Enums/MediaType';
import {
  DEFAULT_FADE_IN,
  DEFAULT_FADE_OUT,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
} from '../../constants';
import { IAudio } from './Types/IAudio';

/**
 * An audio element that can be placed on a timeline track.
 */
export class AudioElement extends BaseElement implements IAudio {
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

  get speed(): number {
    return this.file.source.playbackRate;
  }

  set speed(value: number) {
    this.file.source.playbackRate = value;
  }

  get volume(): number {
    return this.file.source.volume;
  }

  set volume(value: number) {
    this.file.source.volume = value;
  }

  /**
   * Duration of this audio element.
   */
  get totalDurationMs(): number {
    const fileDurationMs = this._totalDurationMs ?? this.file.duration * 1000;

    return fileDurationMs / this.file.source.playbackRate;
  }

	set totalDurationMs(value: number) {
    this._totalDurationMs = Math.max(value, 0);
  }

  get isChanged(): boolean {
    return super.isChanged
      || this.volume !== DEFAULT_VOLUME
      || this.speed !== DEFAULT_SPEED
      || this.fadeInTimeMs !== DEFAULT_FADE_IN
      || this.fadeOutTimeMs !== DEFAULT_FADE_OUT;
  }
}
