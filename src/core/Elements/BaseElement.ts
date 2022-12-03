import { immerable } from 'immer';
import { BASE_TIMELINE_ELEMENT_DURATION_MS } from '../../constants';
import { MediaType } from '../Enums/MediaType';

/**
 * Any media instance that can be placed on a timeline track.
 */
export abstract class BaseElement {
  [immerable] = true;

  /**
   * Default duration of the file in ms.
   */
  static DEFAULT_DURATION = BASE_TIMELINE_ELEMENT_DURATION_MS;

  /**
   * Whether this timeline element is focused or not.
   */
  isFocused = false;

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

  /**
   * Media type of this element.
   */
  type: MediaType = MediaType.Unknown;

  /**
   * A unique ID for this element.
   */
  uniqueId = crypto.randomUUID();

  protected _totalDurationMs: number | null = null;

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
    return Math.max(0, this.startTimeMs + this.totalDurationMs - this.endTrimMs);
  }

  /**
   * Duration of this element.
   */
  get durationMs(): number {
    return this.endTimeMs - this.startTimeMs;
  }

  get totalDurationMs(): number {
    return Math.max(0, this._totalDurationMs ?? BaseElement.DEFAULT_DURATION);
  }

  set totalDurationMs(value: number) {
    this._totalDurationMs = Math.max(0, value);
  }

  equals(other: BaseElement): boolean {
    return this.uniqueId === other.uniqueId;
  }

  get isChanged(): boolean {
    return this.offsetMs !== 0
      || this.startTrimMs !== 0
      || this.endTrimMs !== 0;
  }
}
