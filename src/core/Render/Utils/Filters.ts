import { TimelineTrack } from '../../Timeline/TimelineTrack';
import { MediaType } from '../../Enums/MediaType';
import { getTimingState, RenderTiming } from './Timings';
import { UploadedFile } from '../../Files/UploadedFile';
import {
  BaseElement,
  VideoElement,
  AudioElement,
  ImageElement,
  TextElement,
  MediaElement,
} from '../../Elements';

export function getFilterComplex(tracks: TimelineTrack[], files: UploadedFile[]): string[] {
  if (!shouldAddFilters(tracks)) return [];

  const filters: string[] = [];

  const state = getTimingState(tracks);

  state.forEach((element, timing) => {
    filters.push(getFilter(element, timing, files));
  });

  return `-filter_complex ${filters.join(';')}`.split(' ');
}

function shouldAddFilters(tracks: TimelineTrack[]): boolean {
  return tracks.some((track) => {
    return track.elements.some((element) => {
      return element.isChanged || element.type === MediaType.Text;
    });
  });
}

function getFilter(
  element: BaseElement | null,
  timing: RenderTiming,
  files: UploadedFile[],
): string {
  if (element.type === MediaType.Audio) {
    return getAudioFilters(element as null);
  }

  if (element.type === MediaType.Text) {
    return getTextFilters(element as null, timing);
  }

  return getVideoFilters(element as null, timing, files);
}

function getVideoFilters(
  element: VideoElement | ImageElement | null,
  timing: RenderTiming,
  files: UploadedFile[],
): string {
  const filters: string[] = [];
  const streamIndex = getStreamIndex(element, files);

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

function getAudioFilters(element: AudioElement | null): string {
  // const filters: string[] = [];
  // const streamIndex = getStreamIndex(element);

  return '';
}

function getTextFilters(
  element: TextElement | null,
  timing: RenderTiming,
): string {
  return '';
}

function getStreamIndex(element: MediaElement | null, files: UploadedFile[]): number {
  /**
   * Reserved index for blank space input.
   */
  if (!element) return files.length;

  /**
   * We already know that our index will never be -1.
   */
  return files.findIndex((file) => file.equals(element.file));
}
