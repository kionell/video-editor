import { TimelineTrack } from '../Timeline/TimelineTrack';
import { MediaType } from '../Enums/MediaType';
import { getTimingState, RenderTiming } from './Utils/Timings';
import { UploadedFile } from '../Files/UploadedFile';
import { RequiredSettings } from './Interfaces/IOutputSettings';
import {
  AudioElement,
  BaseElement,
  ImageElement,
  TextElement,
  VideoElement,
} from '../Elements';
import { IFileElement } from '../Elements/Types/IFileElement';
import { IVideo } from '../Elements/Types/IVideo';
import { IAudio } from '../Elements/Types/IAudio';
import { IImage } from '../Elements/Types/IImage';
import { IText } from '../Elements/Types/IText';

export class FilterFlagGenerator {
  private _tracks: TimelineTrack[];
  private _files: UploadedFile[];
  private _outputSettings: RequiredSettings;
  private _tempVariables: Set<string>;

  constructor(tracks: TimelineTrack[], files: UploadedFile[], settings: RequiredSettings) {
    this._tracks = tracks;
    this._files = files;
    this._outputSettings = settings;
  }

  generateFlag(): string[] {
    if (!this._shouldAddFilters()) return [];

    const filters: string[] = [];
    const timings = getTimingState(this._tracks);

    this._tempVariables = new Set();

    timings.forEach((element, timing) => {
      filters.push(this._getFilter(element, timing));
    });

    if (timings.size > 1) {
      filters.push(this._getConcatFilter());
    }

    const stringifiedFilters = filters.filter((x) => x).join(';');

    if (!stringifiedFilters.length) return [];

    return `-filter_complex ${stringifiedFilters}`.split(' ');
  }

  private _shouldAddFilters(): boolean {
    if (!this._outputSettings.includeVideo && !this._outputSettings.includeAudio) {
      return false;
    }

    return this._tracks.some((track) => {
      return track.elements.some((element) => {
        return element.isChanged || element.type === MediaType.Text;
      });
    });
  }

  private _getFilter(element: BaseElement | null, timing: RenderTiming): string {
    if (element.type === MediaType.Video) {
      return this._getVideoFilters(element as VideoElement, timing);
    }

    if (element.type === MediaType.Audio) {
      return this._getAudioFilters(element as AudioElement);
    }

    if (element.type === MediaType.Text) {
      return this._getTextFilters(element as TextElement, timing);
    }

    return this._getVisualFilters(element as ImageElement, timing);
  }

  private _getVisualFilters(element: IImage | null, timing: RenderTiming): string {
    if (!this._outputSettings.includeVideo) return '';

    const filters: string[] = [];
    const streamIndex = this._getStreamIndex(element);

    const startTimeMs = timing.startTimeMs;
    const endTimeMs = timing.endTimeMs;

    if (element.flipX) filters.push('hflip');
    if (element.flipY) filters.push('vflip');

    if (element.rotation) {
      filters.push(`rotate=a=${element.rotation}*PI/180`);
    }

    if (element.fadeInTimeMs) {
      filters.push(`fade=in:0:d=${element.fadeInTimeMs}ms`);
    }

    if (element.fadeOutTimeMs) {
      const fadeStartTimeMs = element.durationMs - element.fadeOutTimeMs;

      filters.push(`fade=out:st=${fadeStartTimeMs}ms:d=${element.fadeOutTimeMs}ms`);
    }

    if (element.startTrimMs !== 0 || element.endTrimMs !== 0) {
      filters.push(`trim=${startTimeMs}:${endTimeMs}`);
      filters.push('setpts=PTS-STARTPTS');
    }

    if (!filters.length) return '';

    return `[${streamIndex}:v]${filters.join(',')}`;
  }

  private _getVideoFilters(element: IVideo | null, timing: RenderTiming): string {
    if (!this._outputSettings.includeVideo) return '';

    const filters: string[] = [];

    const visualFilters: string[] = [];
    const baseFilters = this._getVisualFilters(element, timing);

    if (baseFilters.length > 0) {
      visualFilters.push(baseFilters);
    }

    // ...

    const videoFilters = visualFilters.filter((x) => x).join(',');
    const audioFilters = this._getAudioFilters(element);

    if (videoFilters.length > 0) filters.push(videoFilters);
    if (audioFilters.length > 0) filters.push(audioFilters);

    return filters.join(';');
  }

  private _getAudioFilters(element: IAudio | null): string {
    if (!this._outputSettings.includeAudio) return '';

    const filters: string[] = [];
    const streamIndex = this._getStreamIndex(element);

    if (element.volume !== 1) {
      filters.push(`volume=${element.volume}`);
    }

    return `[${streamIndex}:a]${filters.join(',')}`;
  }

  private _getTextFilters(element: IText | null, timing: RenderTiming): string {
    if (!this._outputSettings.includeVideo) return '';

    return '';
  }

  private _getConcatFilter(): string {
    const input = [...this._tempVariables].join('');
    const includeVideo = this._outputSettings.includeVideo;
    const includeAudio = this._outputSettings.includeAudio;

    return `${input}concat=v=${includeVideo}:a=${includeAudio}[out]`;
  }

  private _getStreamIndex(element: IFileElement | null): number {
    const mediaElement = element as IFileElement;

    /**
     * Reserved index for blank space input.
     */
    if (!mediaElement?.file) return this._files.length;

    /**
     * We already know that our index will never be -1.
     */
    return this._files.findIndex((file) => file.equals(mediaElement.file));
  }
}
