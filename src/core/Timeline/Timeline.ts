import { immerable } from 'immer';
import { PREVIEW_FRAME_WIDTH } from '../../constants';
import { ITimelineZoomState } from '../State/ITimelineZoomState';
import { ITimelineScrollState } from '../State/ITimelineScrollState';
import { TimelineTrack } from './TimelineTrack';
import { AudioElement } from '../Elements/AudioElement';
import { ImageElement } from '../Elements/ImageElement';
import { TextElement } from '../Elements/TextElement';
import { VideoElement } from '../Elements/VideoElement';
import { MediaType } from '../Enums/MediaType';
import { clamp } from '../Utils/Math';

/**
 * A timeline.
 */
export class Timeline {
  [immerable] = true;

  /**
   * Tracks of this timeline.
   */
  readonly tracks: TimelineTrack[] = [];

  /**
   * Current zoom of this timeline.
   */
  currentZoom: ITimelineZoomState = {
    unit: 1,
    zoom: 1,
    segments: 1,
  };

  /**
   * Current scroll position of this timeline.
   */
  currentScroll: ITimelineScrollState = {
    left: 0,
    top: 0,
  };

  /**
   * Whether the snap mode is activated or not.
   */
  snapMode = false;

  private _currentTimeMs = 0;

  /**
   * Current time of the playback in milliseconds.
   */
  get currentTimeMs(): number {
    return clamp(this._currentTimeMs, 0, this.totalLengthMs);
  }

  set currentTimeMs(timeMs: number) {
    this._currentTimeMs = timeMs;
  }

  get focusedTracks(): TimelineTrack[] {
    return this.tracks.filter((t) => t.focusedElements.length > 0);
  }

  get totalTracks(): number {
    return this.tracks.length;
  }

  get videoTracks(): TimelineTrack<VideoElement>[] {
    const result = this.tracks.filter((t) => t.type === MediaType.Video);

    return result as TimelineTrack<VideoElement>[];
  }

  get audioTracks(): TimelineTrack<AudioElement>[] {
    const result = this.tracks.filter((t) => t.type === MediaType.Audio);

    return result as TimelineTrack<AudioElement>[];
  }

  get imageTracks(): TimelineTrack<ImageElement>[] {
    const result = this.tracks.filter((t) => t.type === MediaType.Image);

    return result as TimelineTrack<ImageElement>[];
  }

  get textTracks(): TimelineTrack<TextElement>[] {
    const result = this.tracks.filter((t) => t.type === MediaType.Text);

    return result as TimelineTrack<TextElement>[];
  }

  get startTimeMs(): number {
    const timeMs = this.tracks
      .reduce((ms, t) => Math.min(ms, t.startTimeMs), Infinity);

    return timeMs === Infinity ? 0 : timeMs;
  }

  get endTimeMs(): number {
    const timeMs = this.tracks
      .reduce((ms, t) => Math.max(ms, t.endTimeMs), -Infinity);

    return timeMs === -Infinity ? 0 : timeMs;
  }

  get durationMs(): number {
    return this.endTimeMs - this.startTimeMs;
  }

  get totalLengthMs(): number {
    return this.endTimeMs;
  }

  get width(): number {
    return this.timeMsToUnits(this.totalLengthMs);
  }

  get zoomedFrameWidth(): number {
    return PREVIEW_FRAME_WIDTH * this.currentZoom.zoom;
  }

  timeMsToUnits(timeMs = this.currentTimeMs): number {
    const clampedTime = clamp(timeMs, 0, this.totalLengthMs);
    const frames = clampedTime * (60 / 1000);

    return frames * this.zoomedFrameWidth;
  }

  unitsToTimeMs(units: number): number {
    const frames = units / this.zoomedFrameWidth
    const frameInterval = 1000 / 60;
    const timeMs = frames * frameInterval;

    return clamp(timeMs, 0, this.totalLengthMs);
  }
}