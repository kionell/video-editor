/**
 * Audio bounds for current step.
 */
export class AudioBounds {
  /**
   * Min audio level.
   */
  min: number;

  /**
   * Max audio level.
   */
  max: number;

  constructor(min = 1, max = -1) {
    this.min = min;
    this.max = max;
  }
}
