import { immerable } from 'immer';
import { BaseElement } from '../Elements/BaseElement';
import { MediaType } from '../Enums/MediaType';

/**
 * A timeline track.
 */
export class TimelineTrack<T extends BaseElement = BaseElement> {
  [immerable] = true;

  /**
   * Index of timeline track on the timeline track area.
   */
  index: number;

  /**
   * A unique ID for this timeline track.
   */
  uniqueId = crypto.randomUUID();

  /**
   * Type of this media.
   */
  type: MediaType = MediaType.Unknown;

  readonly elements: T[] = [];

  constructor(index: number, type?: MediaType) {
    this.index = index;
    this.type = type ?? this.type;
  }

  /**
   * Whether this timeline track is focused or not.
   */
  get isFocused(): boolean {
    return this.elements.some((e) => e.isFocused);
  }

  get focusedElements(): T[] {
    return this.elements.filter((e) => e.isFocused);
  }

  get firstElement(): T | null {
    return this.elements[0] ?? null;
  }

  get lastElement(): T | null {
    return this.elements.at(-1) ?? null;
  }

  get startTimeMs(): number {
    return this.firstElement?.startTimeMs ?? 0;
  }

  get endTimeMs(): number {
    return this.lastElement?.endTimeMs ?? 0;
  }

  get durationMs(): number {
    return this.endTimeMs - this.startTimeMs;
  }

  get totalLength(): number {
    return this.endTimeMs;
  }
}
