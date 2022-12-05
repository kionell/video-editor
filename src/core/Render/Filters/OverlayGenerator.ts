import { BaseElement } from '../../Elements';
import { IFileElement } from '../../Elements/Types/IFileElement';
import { UploadedFile } from '../../Files/UploadedFile';
import { TimelineTrack } from '../../Timeline/TimelineTrack';

export class OverlayGenerator {
  constructor(
    private _tracks: TimelineTrack[],
    private _files: UploadedFile[],
  ) {}

  generate(): string {
    /**
     * Overlay generator should be used as the latest of all 3 video generators.
     * We will use predetermined variable names as they are already processed.
     */
    const overlays: string[] = [];

    /**
     * We are starting from background layer.
     */
    let base = '[background]';

    for (let ti = this._tracks.length - 1; ti >= 0; --ti) {
      const totalElements = this._tracks[ti].elements.length;

      for (let ei = 0; ei < totalElements; ++ei) {
        const element = this._tracks[ti].elements[ei];
        const streamIndex = this._getStreamIndex(element);

        /**
         * This element doesn't match any file input.
         * Most likely that we are dealing with text element.
         * TODO: Add text element processing.
         */
        if (streamIndex === -1) continue;

        const start = element.startTimeMs * 1000;
        const end = element.endTimeMs * 1000;

        const commands = [
          'x=0',
          'y=0',
          `enable='between(t,${start},${end})'`,
        ];

        /**
         * 0 = current layer.
         * 1 = current element (video).
         */
        const input = base + `[track${ti}_element${ei}_v]`;
        const overlay = `overlay=${commands.join(':')}`;

        /**
         * track0_0 = temporary state of the track0 after overlaying first element.
         * track0   = full track0 that is ready to became next layer.
         */
        const output = ei < totalElements - 1 ? `[track${ti}_${ei}]` : `[track${ti}]`;

        overlays.push(input + overlay + output);

        /**
         * Switch base video stream to the next state.
         */
        base = output;
      }
    }

    return overlays.join(';');
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
