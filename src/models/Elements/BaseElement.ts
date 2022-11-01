import { immerable } from 'immer';
import { ITimelineElement } from './ITimelineElement';

/**
 * Any media instance that can be placed on a timeline track.
 */
export abstract class BaseElement implements ITimelineElement {
  [immerable] = true;
  
  /**
   * Default duration of the file in ms.
   */
  static DEFAULT_DURATION = 4000;
  
  /**
   * Current offset from the start of a track (from 0 ms).
   */
	offsetMs = 0;

  /**
   * Length of the segment trimmed from the start of this element.
   */
	startTrimMs = 0;

  /**
   * Length of the segment trimmed from the end of this element.
   */
	endTrimMs = 0;

  protected _durationMs?: number;

  constructor(options: Partial<BaseElement>) {
    Object.assign(this, options);
  }

  /**
   * Time at which this element starts.
   */
	get startTimeMs(): number {
    return Math.max(0, this.offsetMs + this.startTrimMs);
  }

  /**
   * Time at which this element ends.
   */
	get endTimeMs(): number {
    return Math.max(0, this.startTimeMs + this.durationMs - this.endTrimMs);
  }

  /**
   * Duration of this element.
   */
	get durationMs(): number {
    return Math.max(0, this._durationMs ?? BaseElement.DEFAULT_DURATION);
  }

  set durationMs(value: number) {
    this._durationMs = Math.max(0, value);
  }
}
