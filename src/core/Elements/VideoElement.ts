import { MediaType } from '../Enums/MediaType';
import { VideoFile } from '../Files/VideoFile';
import { IFileElement } from './Types/IFileElement';
import { IHasAudio } from './Types/IHasAudio';
import { IPlayableElement } from './Types/IPlayableElement';
import { VisibleElement } from './VisibleElement';

/**
 * A video element that can be placed on a timeline track.
 */
export class VideoElement extends VisibleElement
  implements IFileElement, IPlayableElement, IHasAudio {

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
}
