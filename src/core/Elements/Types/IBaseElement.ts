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
}
