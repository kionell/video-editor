import { VideoFile } from '../Files/VideoFile';
import { IFileElement } from './Types/IFileElement';
import { IPlayableElement } from './Types/IPlayableElement';
import { VisibleElement } from './VisibleElement';

/**
 * A video element that can be placed on a timeline track.
 */
export class VideoElement extends VisibleElement implements IFileElement, IPlayableElement {
  speed = 1;
  reversed = false;

  file: VideoFile;

  constructor(options: Pick<VideoElement, 'file'> & Partial<VideoElement>) {
    super(options);

    this.file = options.file;
  }

  /**
   * Duration of this video element.
   */
  set durationMs(value: number) {
    const fileDurationMs = this.file.duration * 1000;

    this._durationMs = Math.max(0, Math.min(value, fileDurationMs));
  }
}