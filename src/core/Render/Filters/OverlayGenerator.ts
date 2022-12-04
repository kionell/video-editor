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
    return '';
  }
}
