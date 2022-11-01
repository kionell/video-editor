export interface ITimelineElement {
  /**
   * Current offset from the start of a track (from 0 ms).
   */
  offsetMs: number;

  /**
   * Length of the segment trimmed from the start of this element.
   */
  startTrimMs: number;

  /**
   * Length of the segment trimmed from the end of this element.
   */
  endTrimMs: number;

  /**
   * Time at which this element starts.
   */
  startTimeMs: number;

  /**
   * Time at which this element ends.
   */
  endTimeMs: number;

  /**
   * Duration of this element.
   */
  durationMs: number;
}