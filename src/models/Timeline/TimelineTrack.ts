import { immerable } from 'immer';
import { findIndex } from '../../utils/search';
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

  private _elements: T[] = [];

  constructor(index: number, type?: MediaType) {
    this.index = index;
    this.type = type ?? this.type;
  }

  /**
   * Adds a new element to this timeline track.
   * @param element Element to add.
   */
  addElement(element: T): void {
    this._elements.push(element);

    this._fixTimeOffsets();
  }

  /**
   * Removes an existing element from this timeline track.
   * @param element Element to remove.
   */
  removeElement(element: T): void {
    const index = this._elements.findIndex((el) => el === element);

    this._elements.splice(index, 1);
  }

  /**
   * Removes an existing element from this timeline track by current time.
   * @param time Current time of the track.
   */
  removeElementAtTime(time: number): void {
    const element = this.getElementAtTime(time);

    if (element) this.removeElement(element);
  }

  /**
   * Searches for an element which is played at the specified time.
   * @param time Time in milliseconds.
   * @returns Found element or null.
   */
  getElementAtTime(time: number): T | null {
    const predicate = (element: T) => {
      return element.startTimeMs >= time && element.endTimeMs <= time;
    };

    const index = findIndex(this._elements, predicate);

    return index >= 0 ? this._elements[index] : null;
  }

  /**
   * Moves target element to another point of time.
   * @param element Target element.
   * @param toMs Target time.
   */
  moveElementToTime(element: T, toMs: number): void {
    element.offsetMs = Math.max(0, toMs);

    this._fixTimeOffsets();
  }

  /**
   * Moves an existing element from one point of time to another.
   * @param fromMs Source time.
   * @param toMs Target time.
   */
  moveElementFromTimeToTime(fromMs: number, toMs: number): void {
    // There are no elements outside of track's total length.
    if (fromMs < 0 || fromMs > this.totalLength) return;

    const element = this.getElementAtTime(fromMs);

    if (!element) return;

    this.moveElementToTime(element, toMs);
  }

  /**
   * Whether this timeline track is focused or not.
   */
  get isFocused(): boolean {
    return this._elements.some((e) => e.isFocused);
  }

  get focusedElements(): T[] {
    return this._elements.filter((e) => e.isFocused);
  }

  get elements(): T[] {
    return this._elements;
  }

  get firstElement(): T | null {
    return this._elements[0] ?? null;
  }

  get lastElement(): T | null {
    return this._elements[this._elements.length - 1] ?? null;
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

  /**
   * Removes intersection between elements.
   */
  private _fixTimeOffsets(): void {
    this._elements.sort((a, b) => a.startTimeMs - b.startTimeMs);

    // There is no sense to change offsets when there are 1 element or less.
    if (this._elements.length <= 1) return;

    // Min starting time of each next element.
    let nextMinTime = this._elements[0].endTimeMs;

    this._elements.forEach((element, index) => {
      if (index === 0) return;

      const difference = element.startTimeMs - nextMinTime;

      // This means that our current element intersects with previous element.
      if (difference < 0) element.offsetMs -= difference;

      nextMinTime = element.endTimeMs;
    });
  }
}
