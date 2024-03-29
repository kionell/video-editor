import { TimelineTrack } from '../../Timeline/TimelineTrack';
import { MediaType } from '../../Enums/MediaType';
import { UploadedFile } from '../../Files/UploadedFile';
import { RequiredSettings } from '../Interfaces/IOutputSettings';
import { FilteredElementGenerator } from './FilteredElementGenerator';
import { OverlayGenerator } from './OverlayGenerator';
import { BackgroundGenerator } from './BackgroundGenerator';

export class FilterFlagGenerator {
  private _backgroundGenerator: BackgroundGenerator;
  private _elementGenerator: FilteredElementGenerator;
  private _overlayGenerator: OverlayGenerator;

  constructor(
    private _tracks: TimelineTrack[],
    private _files: UploadedFile[],
    private _outputSettings: RequiredSettings,
  ) {
    const totalLengthMs = _tracks.reduce((total, track) => {
      return Math.max(total, track.totalLengthMs);
    }, 0);

    this._backgroundGenerator = new BackgroundGenerator(
      this._outputSettings,
      totalLengthMs,
    );

    this._elementGenerator = new FilteredElementGenerator(
      this._tracks,
      this._files,
      this._outputSettings,
    );

    this._overlayGenerator = new OverlayGenerator(
      this._tracks,
      this._files,
    );
  }

  generate(): string[] {
    if (!this._shouldAddFilters()) return [];

    const background = this._backgroundGenerator.generate();
    const filteredElements = this._elementGenerator.generate();
    const overlays = this._overlayGenerator.generate(filteredElements);

    const commands = [background, filteredElements, overlays]
      .filter((x) => x)
      .join(';');

    return `-filter_complex ${commands}`.split(' ');
  }

  /**
   * We can skip filter complex flag if there are no input streams.
   * Also skip this process if none of our elements were changed.
   * @returns Whether to add filter complex flag.
   */
  private _shouldAddFilters(): boolean {
    const includeVideo = this._outputSettings.includeVideo;
    const includeAudio = this._outputSettings.includeAudio;

    if (!includeVideo && !includeAudio) return false;

    return this._tracks.some((track) =>
      track.elements.some((element) =>
        // Text elements always require complex filters.
        element.isChanged || element.type === MediaType.Text,
      ),
    );
  }
}
