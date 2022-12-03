import { TimelineTrack } from '../Timeline/TimelineTrack';
import { MediaType } from '../Enums/MediaType';
import { getTimingState, RenderTiming } from './Utils/Timings';
import { UploadedFile } from '../Files/UploadedFile';
import { RequiredSettings } from './Interfaces/IOutputSettings';
import {
  BaseElement,
  VideoElement,
  AudioElement,
  TextElement,
  MediaElement,
} from '../Elements';

export class FilterFlagGenerator {
  private _tracks: TimelineTrack[];
  private _files: UploadedFile[];
  private _outputSettings: RequiredSettings;

  constructor(tracks: TimelineTrack[], files: UploadedFile[], settings: RequiredSettings) {
    this._tracks = tracks;
    this._files = files;
    this._outputSettings = settings;
  }

  generateFlag(): string[] {
    if (!this._shouldAddFilters()) return [];

    const filters: string[] = [];

    const state = getTimingState(this._tracks);

    state.forEach((element, timing) => {
      filters.push(this._getFilter(element, timing));
    });

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
    if (element.type === MediaType.Audio) {
      return this._getAudioFilters(element as AudioElement);
    }

    if (element.type === MediaType.Text) {
      return this._getTextFilters(element as TextElement, timing);
    }

    return this._getVideoFilters(element as VideoElement, timing);
  }

  private _getVideoFilters(element: VideoElement | null, timing: RenderTiming): string {
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

    return `[${streamIndex}:v]${filters.join(',')}`;
  }

  private _getAudioFilters(element: AudioElement | null): string {
    if (!this._outputSettings.includeAudio) return '';

    // const filters: string[] = [];
    // const streamIndex = getStreamIndex(element);

    return '';
  }

  private _getTextFilters(element: TextElement | null, timing: RenderTiming): string {
    if (!this._outputSettings.includeVideo) return '';

    return '';
  }

  private _getStreamIndex(element: MediaElement | null): number {
    /**
     * Reserved index for blank space input.
     */
    if (!element) return this._files.length;

    /**
     * We already know that our index will never be -1.
     */
    return this._files.findIndex((file) => file.equals(element.file));
  }
}
