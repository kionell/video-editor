import { ITimelineTrack } from './ITimelineTrack';

export interface ITimeline {
  /**
   * Current time of the playback in milliseconds.
   */
  currentTimeMs: number;

  /**
   * Current zoom of this timeline.
   */
  currentZoom: number;

  /**
   * Current scroll position of this timeline.
   */
  currentScroll: number;

  /**
   * Whether the snap mode is activated or not.
   */
  snapMode: boolean;

  /**
   * Tracks of this timeline.
   */
  tracks: ITimelineTrack[];
}
