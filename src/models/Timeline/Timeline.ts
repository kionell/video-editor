import { immerable } from 'immer';
import { findIndex } from '../../utils/search';
import { AudioElement } from '../Elements/AudioElement';
import { ImageElement } from '../Elements/ImageElement';
import { TextElement } from '../Elements/TextElement';
import { VideoElement } from '../Elements/VideoElement';
import { MediaType } from '../Enums/MediaType';
import { ITimeline } from './ITimeline';
import { TimelineTrack } from './TimelineTrack';

/**
 * A timeline.
 */
export class Timeline implements ITimeline {
  [immerable] = true;
  
  private static DEFAULT_ZOOM_LEVELS = [
    0.1, 0.2, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5,
  ];

  private _tracks: TimelineTrack[] = [];
	
  /**
   * Current time of the playback in milliseconds.
   */
  currentTimeMs = 0;

  /**
   * Current zoom of this timeline.
   */
  currentZoom = 1;

  /**
   * Current scroll position of this timeline.
   */
  currentScroll = 0;

  /**
   * Whether the snap mode is activated or not.
   */
  snapMode = false;

  getPreviousZoom(): number {
    return Timeline.DEFAULT_ZOOM_LEVELS[this._getPreviousZoomIndex()];
  }

  getNextZoom(): number {
    return Timeline.DEFAULT_ZOOM_LEVELS[this._getNextZoomIndex()];
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
    const index = Math.max(0, Math.min(toIndex, this.totalLength - 1));

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
    return this._tracks.reduce((ms, t) => Math.min(ms, t.startTimeMs), Infinity);
  }

	get endTimeMs(): number {
    return this._tracks.reduce((ms, t) => Math.max(ms, t.endTimeMs), -Infinity);
  }

	get durationMs(): number {
    return this.endTimeMs - this.startTimeMs;
  }

  get totalLength(): number {
    return this.endTimeMs;
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
    // Previous zoom is 2 positions behind next zoom.
    const previousZoomIndex = this._getNextZoomIndex() - 2;

    // Limit zoom to the first default level.
    return Math.max(0, previousZoomIndex);
  }

  private _getNextZoomIndex(): number {
    const zoomLevels = Timeline.DEFAULT_ZOOM_LEVELS;

    const nextZoomIndex = findIndex(zoomLevels, (zoom) => {
      return zoom > this.currentZoom;
    });

    // Limit zoom to the last default level.
    return Math.min(zoomLevels.length - 1, nextZoomIndex);
  }
}
