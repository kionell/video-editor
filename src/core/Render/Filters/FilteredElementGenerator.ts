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
  DEFAULT_BRIGHTNESS,
  DEFAULT_CONTRAST,
  DEFAULT_FADE_IN,
  DEFAULT_FADE_OUT,
  DEFAULT_MAX_BRIGHTNESS,
  DEFAULT_MIN_BRIGHTNESS,
  DEFAULT_ROTATION,
  DEFAULT_SATURATION,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
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

    if (element.rotation !== DEFAULT_ROTATION) {
      filters.push(`rotate=a=${element.rotation}*PI/180`);
    }

    if (element.fadeInTimeMs !== DEFAULT_FADE_IN) {
      filters.push(`fade=in:0:d=${element.fadeInTimeMs}ms`);
    }

    if (element.fadeOutTimeMs !== DEFAULT_FADE_OUT) {
      const fadeStartTimeMs = element.durationMs - element.fadeOutTimeMs;

      filters.push(`fade=out:st=${fadeStartTimeMs}ms:d=${element.fadeOutTimeMs}ms`);
    }

    const eqFilter = this._getEqFilter(element);

    if (eqFilter.length > 0) filters.push(eqFilter);

    if (element.startTrimMs !== 0 || element.endTrimMs !== 0) {
      filters.push(`trim=${element.startTrimMs}:${element.durationMs}`);
      filters.push('setpts=PTS-STARTPTS');
    }

    if (!filters.length) return '';

    return `[${streamIndex}:v]${filters.join(',')}`;
  }

  private _getFilteredVideo(element: IVideo): string {
    if (!this._outputSettings.includeVideo) return '';

    const filters: string[] = [];
    const visualFilters = [this._getFilteredVisual(element)];

    if (element.speed !== DEFAULT_SPEED) {
      visualFilters.push(`setpts=PTS/${element.speed}`);
    }

    const videoFilters = visualFilters.filter((x) => x).join(',');

    if (videoFilters.length > 0) filters.push(videoFilters);

    const audioFilters = this._getFilteredAudio(element);

    if (audioFilters.length > 0) filters.push(audioFilters);

    return filters.join(';');
  }

  private _getFilteredAudio(element: IAudio): string {
    if (!this._outputSettings.includeAudio) return '';

    const filters: string[] = [];
    const streamIndex = this._getStreamIndex(element);

    if (element.volume !== DEFAULT_VOLUME) {
      filters.push(`volume=${element.volume}`);
    }

    if (element.speed !== DEFAULT_SPEED) {
      filters.push(`atempo=${element.speed}`);
    }

    if (!filters.length) return '';

    return `[${streamIndex}:a]${filters.join(',')}`;
  }

  private _getFilteredText(element: IText): string {
    if (!this._outputSettings.includeVideo) return '';

    return element && '';
  }

  private _getEqFilter(element: IVisible): string {
    const commands: string[] = [];

    if (element.contrast !== DEFAULT_CONTRAST) {
      commands.push(`contrast=${element.contrast}`);
    }

    if (element.brightness !== DEFAULT_BRIGHTNESS) {
      // 0 ... value ... 2 -> -1 ... value ... 1
      const brightness = map(
        element.brightness,
        DEFAULT_MIN_BRIGHTNESS,
        DEFAULT_MAX_BRIGHTNESS,
        -1,
        1,
      );

      commands.push(`brightness=${brightness}`);
    }

    if (element.saturation !== DEFAULT_SATURATION) {
      commands.push(`saturation=${element.saturation}`);
    }

    if (!commands.length) return '';

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
