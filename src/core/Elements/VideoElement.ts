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
  volume = 1;
  speed = 1;

  file: VideoFile;

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Video;

  constructor(file: VideoFile) {
    super();

    this.file = file;
  }

  /**
   * Duration of this video element.
   */
  get totalDurationMs(): number {
    const fileDurationMs = this.file.duration * 1000;

    return Math.max(0, this._totalDurationMs ?? fileDurationMs);
  }

  set totalDurationMs(value: number) {
    const fileDurationMs = this.file.duration * 1000;

    this._totalDurationMs = Math.max(0, Math.min(value, fileDurationMs));
  }

  get isChanged(): boolean {
    return super.isChanged
      || this.volume !== DEFAULT_VOLUME
      || this.speed !== DEFAULT_SPEED
      || this.fadeInTimeMs !== DEFAULT_FADE_IN
      || this.fadeOutTimeMs !== DEFAULT_FADE_OUT;
  }
}
