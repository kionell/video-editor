/**
 * A timeline zoom level state.
 */
export interface ITimelineZoomState {
  /**
   * The number of frames between each long line.
   */
  unit: number;

  /**
   * Current zoom value.
   */
  zoom: number;

  /**
   * How many segments to draw for timeline ruler.
   */
  segments: number;
}
