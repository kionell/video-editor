import { MediaType } from '../../Enums/MediaType';
import { UploadedFile } from '../../Files/UploadedFile';
import { TimelineTrack } from '../../Timeline/TimelineTrack';
import { RequiredSettings } from '../Interfaces/IOutputSettings';
import { IFileElement } from '../../Elements/Types/IFileElement';
import { IVisible } from '../../Elements/Types/IVisible';
import { IVideo } from '../../Elements/Types/IVideo';
import { IAudio } from '../../Elements/Types/IAudio';
import { IText } from '../../Elements/Types/IText';
import { map } from '../../Utils/Math';
import {
  DEFAULT_MAX_BRIGHTNESS,
  DEFAULT_MIN_BRIGHTNESS,
} from '../../../constants';
import {
  AudioElement,
  BaseElement,
  ImageElement,
  TextElement,
  VideoElement,
} from '../../Elements';

export class FilteredElementGenerator {
  constructor(
    private _tracks: TimelineTrack[],
    private _files: UploadedFile[],
    private _outputSettings: RequiredSettings,
  ) {}

  generate(): string {
    const output: string[] = [];

    /**
     * We need to start from the last track 
     * because we will overlay them one by one.
     * 
     * ti = track index.
     * ei = element index.
     */
    for (let ti = this._tracks.length - 1; ti >= 0; --ti) {
      const totalElements = this._tracks[ti].elements.length;

      for (let ei = 0; ei < totalElements; ++ei) {
        const element = this._tracks[ti].elements[ei];
        const filteredElement = this._getFilteredElement(element);

        output.push(filteredElement + `[track${ti}_element${ei}]`);
      }
    }

    return output.join(';');
  }

  /**
   * Converts timeline element to FFmpeg filter complex command.
   * @param element Current timeline element.
   * @returns Stringified filtered element.
   */
  private _getFilteredElement(element: BaseElement): string {
    if (element.type === MediaType.Video) {
      return this._getFilteredVideo(element as VideoElement);
    }

    if (element.type === MediaType.Audio) {
      return this._getFilteredAudio(element as AudioElement);
    }

    if (element.type === MediaType.Text) {
      return this._getFilteredText(element as TextElement);
    }

    return this._getFilteredVisual(element as ImageElement);
  }

  private _getFilteredVisual(element: IVisible): string {
    if (!this._outputSettings.includeVideo) return '';

    const filters: string[] = [];
    const streamIndex = this._getStreamIndex(element as IVisible & IFileElement);

    if (element.flipX) filters.push('hflip');
    if (element.flipY) filters.push('vflip');

    filters.push(`rotate=a=${element.rotation}*PI/180`);
    filters.push(`fade=in:0:d=${element.fadeInTimeMs}ms`);

    const fadeStartTimeMs = element.durationMs - element.fadeOutTimeMs;

    filters.push(`fade=out:st=${fadeStartTimeMs}ms:d=${element.fadeOutTimeMs}ms`);

    const eqFilter = this._getEqFilter(element);

    filters.push(eqFilter);
    filters.push(`trim=${element.startTrimMs}:${element.durationMs}`);
    filters.push('setpts=PTS-STARTPTS');

    return `[${streamIndex}:v]${filters.join(',')}`;
  }

  private _getFilteredVideo(element: IVideo): string {
    if (!this._outputSettings.includeVideo) return '';

    const filters: string[] = [];
    const visualFilters = [this._getFilteredVisual(element)];

    visualFilters.push(`setpts=PTS/${element.speed}`);

    const videoFilters = visualFilters.join(',');

    filters.push(videoFilters);

    const audioFilters = this._getFilteredAudio(element);

    filters.push(audioFilters);

    return filters.join(';');
  }

  private _getFilteredAudio(element: IAudio): string {
    if (!this._outputSettings.includeAudio) return '';

    const filters: string[] = [];
    const streamIndex = this._getStreamIndex(element);

    filters.push(`volume=${element.volume}`);
    filters.push(`atempo=${element.speed}`);

    return `[${streamIndex}:a]${filters.join(',')}`;
  }

  private _getFilteredText(element: IText): string {
    if (!this._outputSettings.includeVideo) return '';

    return element && '';
  }

  private _getEqFilter(element: IVisible): string {
    const commands: string[] = [];

    commands.push(`contrast=${element.contrast}`);

    // 0 ... value ... 2 -> -1 ... value ... 1
    const brightness = map(
      element.brightness,
      DEFAULT_MIN_BRIGHTNESS,
      DEFAULT_MAX_BRIGHTNESS,
      -1,
      1,
    );

    commands.push(`brightness=${brightness}`);
    commands.push(`saturation=${element.saturation}`);

    return `eq=${commands.join(':')}`;
  }

  private _getStreamIndex(element: IFileElement): number {
    /**
     * We already know that our index will never be -1.
     * Because this files array is generated from existing elements.
     */
    return this._files.findIndex((file) => file.equals(element.file));
  }
}
