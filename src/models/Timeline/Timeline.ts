import { immerable } from 'immer';
import { PREVIEW_FRAME_WIDTH, TIMELINE_ZOOM_LEVELS } from '../../constants';
import { ITimeline } from './ITimeline';
import { ITimelineZoomLevel } from './ITimelineZoomLevel';
import { TimelineTrack } from './TimelineTrack';
import { AudioElement } from '../Elements/AudioElement';
import { ImageElement } from '../Elements/ImageElement';
import { TextElement } from '../Elements/TextElement';
import { VideoElement } from '../Elements/VideoElement';
import { MediaType } from '../Enums/MediaType';
import { clamp } from '../../utils/math';
import { findIndex } from '../../utils/search';

/**
 * A timeline.
 */
export class Timeline implements ITimeline {
  [immerable] = true;

  private _tracks: TimelineTrack[] = [];
	
  /**
   * Current time of the playback in milliseconds.
   */
  currentTimeMs = 0;

  /**
   * Current zoom of this timeline.
   */
  currentZoom: ITimelineZoomLevel = {
    unit: 1,
    zoom: 1,
    segments: 1,
  };

  /**
   * Current scroll position of this timeline.
   */
  currentScroll = 0;

  /**
   * Whether the snap mode is activated or not.
   */
  snapMode = false;

  getPreviousZoomLevel(): ITimelineZoomLevel {
    return TIMELINE_ZOOM_LEVELS[this._getPreviousZoomIndex()];
  }

  getNextZoomLevel(): ITimelineZoomLevel {
    return TIMELINE_ZOOM_LEVELS[this._getNextZoomIndex()];
  }

	/**
   * Adds a new track to this timeline.
   * @param track Track to add.
   */
  addTrack(track: TimelineTrack): TimelineTrack {
    this._tracks.splice(track.index, 0, track);

    this._reindexTracks();

    return track;
  }

	/**
   * Removes an existing track from this timeline.
   * @param track Track to remove.
   */
	removeTrack(track: TimelineTrack): TimelineTrack | null {
    const index = this._tracks.findIndex((t) => t === track);

    return this.removeTrackByIndex(index);
  }

  /**
   * Removes an existing track from this timeline by its index.
   * @param index Target index of a track.
   */
  removeTrackByIndex(index: number): TimelineTrack | null {
    if (index < 0 || index >= this.totalTracks) {
      return null;
    }

    const track = this._tracks.splice(index, 1);

    this._reindexTracks();

    return track[0];
  }

  /**
   * Moves target track to a specific index.
   * @param track Target track.
   * @param toIndex Target index.
   */
  moveTrack(track: TimelineTrack, toIndex: number): void {
    const fromIndex = this._tracks.findIndex((t) => t === track);

    return this.moveTrackByIndex(fromIndex, toIndex);
  }

  /**
   * Moves an existing track from one index to another.
   * @param fromIndex Source index of a track.
   * @param toIndex Target index of a track.
   */
  moveTrackByIndex(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this.totalTracks) return;

    const track = this._tracks.splice(fromIndex, 1);
    const index = clamp(toIndex, 0, this.totalTracks - 1);

    this._tracks.splice(index, 0, track[0]);

    this._reindexTracks();
  }

  /**
   * Searches for a track by its index.
   * @param index Target index of a track.
   * @returns Found timeline track or null.
   */
  getTrackByIndex(index: number): TimelineTrack | null {
    if (index < 0 || index >= this.totalTracks) {
      return null;
    }

    return this._tracks[index];
  }

  get totalTracks(): number {
    return this._tracks.length;
  }

  get tracks(): TimelineTrack[] {
    return this._tracks;
  }

  get videoTracks(): TimelineTrack<VideoElement>[] {
    const result = this._tracks.filter((t) => t.type === MediaType.Video);
    
    return result as TimelineTrack<VideoElement>[];
  }

	get audioTracks(): TimelineTrack<AudioElement>[] {
    const result = this._tracks.filter((t) => t.type === MediaType.Audio);
    
    return result as TimelineTrack<AudioElement>[];
  }

	get imageTracks(): TimelineTrack<ImageElement>[] {
    const result = this._tracks.filter((t) => t.type === MediaType.Image);
    
    return result as TimelineTrack<ImageElement>[];
  }

	get textTracks(): TimelineTrack<TextElement>[] {
    const result = this._tracks.filter((t) => t.type === MediaType.Text);
    
    return result as TimelineTrack<TextElement>[];
  }

  get startTimeMs(): number {
    const timeMs = this._tracks
      .reduce((ms, t) => Math.min(ms, t.startTimeMs), Infinity);

    return timeMs === Infinity ? 0 : timeMs;
  }

	get endTimeMs(): number {
    const timeMs = this._tracks
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
    return this.durationMs / 1000 * this.frameUnits;
  }

  get frameUnits(): number {
    return PREVIEW_FRAME_WIDTH * this.currentZoom.zoom;
  }

  timeMsToUnits(timeMs = this.currentTimeMs): number {
    const clampedTime = clamp(timeMs, 0, this.durationMs);
    
    return clampedTime * this.frameUnits / 1000;
  }

  unitsToTimeMs(units: number): number {
    const timeMs = units * 1000 / this.frameUnits;

    return clamp(timeMs, 0, this.durationMs);
  }

  /**
   * Fixes order of all track indexes.
   */
  private _reindexTracks(): void {
    this._tracks.forEach((track, index) => {
      track.index = index;
    });
  }

  private _getPreviousZoomIndex(): number {
    const lastLevel = TIMELINE_ZOOM_LEVELS[TIMELINE_ZOOM_LEVELS.length - 1];
    const isLastIndex = this.currentZoom === lastLevel;
    const nextZoomIndex = this._getNextZoomIndex();
    const previousZoomIndex = nextZoomIndex - (isLastIndex ? 1 : 2);

    // Limit zoom to the first default level.
    return Math.max(0, previousZoomIndex);
  }

  private _getNextZoomIndex(): number {
    const zoomLevels = TIMELINE_ZOOM_LEVELS;

    const nextZoomIndex = findIndex(zoomLevels, (level) => {
      return level.zoom > this.currentZoom.zoom;
    });

    // Limit zoom to the last default level.
    return Math.min(zoomLevels.length - 1, nextZoomIndex);
  }
}
