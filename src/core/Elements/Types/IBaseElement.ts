/**
 * A base timeline element.
 */
export interface IBaseElement {
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
   * Start time of this element including starting trim and offset.
   */
  startTimeMs: number;

  /**
   * Ending time of this element including end trim.
   */
  endTimeMs: number;

  /**
   * Trimmed duration of the element.
   */
  durationMs: number;
}
