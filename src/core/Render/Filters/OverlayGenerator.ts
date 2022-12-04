import { BaseElement } from '../../Elements';
import { IFileElement } from '../../Elements/Types/IFileElement';
import { UploadedFile } from '../../Files/UploadedFile';
import { TimelineTrack } from '../../Timeline/TimelineTrack';
import { RequiredSettings } from '../Interfaces/IOutputSettings';

export class OverlayGenerator {
  constructor(
    private _tracks: TimelineTrack[],
    private _files: UploadedFile[],
    private _outputSettings: RequiredSettings,
    private _totalLengthMs: number,
  ) {}

  generate(): string {
    /**
     * Overlay generator should be used as the latest of all 3 video generators.
     * We will use predetermined variable names as they are already processed.
     */
    const output: string[] = [];

    /**
     * We are starting from background layer.
     */
    let base = '[background]';

    for (let ti = this._tracks.length - 1; ti >= 0; --ti) {
      const totalElements = this._tracks[ti].elements.length;

      for (let ei = 0; ei < totalElements; ++ei) {
        const element = this._tracks[ti].elements[ei];
        const streamIndex = this._getStreamIndex(element as any);

        // This element doesn't match any file input.
        if (streamIndex === -1) continue;

        output.push(filteredElement);
      }

      /**
       * Switch base video stream to the next layer.
       */
      base = `[track${ti}]`;
    }

    return output.join(';');
  }

  private _getStreamIndex(element: BaseElement): number {
    const fileElement = element as BaseElement & IFileElement;

    if (!fileElement.file) return -1;

    /**
     * We already know that our index will never be -1.
     * Because this files array is generated from existing elements.
     */
    return this._files.findIndex((file) => file.equals(fileElement.file));
  }
}
