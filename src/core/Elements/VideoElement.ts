import { MediaType } from '../Enums/MediaType';
import { VideoFile } from '../Files/VideoFile';
import { VisibleElement } from './VisibleElement';
import {
  DEFAULT_FADE_IN,
  DEFAULT_FADE_OUT,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
} from '../../constants';
import { IVideo } from './Types/IVideo';

/**
 * A video element that can be placed on a timeline track.
 */
export class VideoElement extends VisibleElement implements IVideo {
  file: VideoFile;

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Video;

  constructor(file: VideoFile) {
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
   * Duration of this video element.
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
