import { BaseElement } from '../../Elements';
import { TimelineTrack } from '../../Timeline/TimelineTrack';

export type TimingState = Map<RenderTiming, BaseElement | null>;

export class RenderTiming {
  startTimeMs: number;
  endTimeMs: number;

  constructor(start: number, end: number) {
    this.startTimeMs = start;
    this.endTimeMs = end;
  }
}

class RenderTimingList {
  private _timings: TimingState = new Map();

  updateTimings(current: BaseElement): void {
    const newTimings: Map<RenderTiming, BaseElement> = new Map();
    const deleteTimings: RenderTiming[] = [];

    const addCurrent = () => {
      newTimings.set(
        new RenderTiming(current.startTimeMs, current.endTimeMs),
        current,
      );
    };

    this._timings.forEach((previous, timing) => {
      if (this._fullyInside(current, timing)) {
        const timing1 = new RenderTiming(previous.startTimeMs, current.startTimeMs);
        const timing2 = new RenderTiming(current.startTimeMs, current.endTimeMs);
        const timing3 = new RenderTiming(current.endTimeMs, previous.endTimeMs);

        newTimings.set(timing1, previous);
        newTimings.set(timing2, current);
        newTimings.set(timing3, previous);
        deleteTimings.push(timing);

        return;
      }

      if (this._overlapsStartTime(current, timing)) {
        const timing1 = new RenderTiming(previous.startTimeMs, current.startTimeMs);

        // This timing already stretched to the end of the current element.
        const timing2 = new RenderTiming(current.startTimeMs, current.endTimeMs);

        newTimings.set(timing1, previous);
        newTimings.set(timing2, current);
        deleteTimings.push(timing);

        return;
      }

      if (this._fullyCovers(current, timing)) {
        deleteTimings.push(timing);

        return;
      }

      if (this._overlapsEndTime(current, timing)) {
        const timing1 = new RenderTiming(current.endTimeMs, previous.endTimeMs);

        newTimings.set(timing1, previous);
        deleteTimings.push(timing);
      }

      // if (this._fullyOutside(current, timing))
    });

    if (!this._timings.size) addCurrent();

    deleteTimings.forEach((timing) => this._timings.delete(timing));
    newTimings.forEach((el, timing) => this._timings.set(timing, el));
  }

  finish(): TimingState {
    const entries = [...this._timings.entries()]
      .sort((a, b) => a[0].startTimeMs - b[0].startTimeMs);

    const emptySpace: [RenderTiming, BaseElement][] = [];

    entries.reduce((previous, current, i) => {
      if (i === entries.length - 1) return;

      // Our first element can start at non-zero time.
      const previousTime = previous?.[0].startTimeMs ?? 0;
      const currentTime = current[0].startTimeMs;

      // We need to push empty space to our video.
      if (currentTime - previousTime > 0) {
        emptySpace.push([
          new RenderTiming(previousTime, currentTime),
          null,
        ]);
      }

      return current;
    }, null);

    // We need to sort it again because our order may change.
    return new Map(entries.sort((a, b) => a[0].startTimeMs - b[0].startTimeMs));
  }

  private _overlapsStartTime(element: BaseElement, timing: RenderTiming): boolean {
    return timing.startTimeMs <= element.startTimeMs
      && timing.endTimeMs > element.startTimeMs;
  }

  private _overlapsEndTime(element: BaseElement, timing: RenderTiming): boolean {
    return timing.startTimeMs < element.endTimeMs
      && timing.endTimeMs >= element.endTimeMs;
  }

  private _fullyInside(element: BaseElement, timing: RenderTiming): boolean {
    return this._overlapsStartTime(element, timing)
      && this._overlapsEndTime(element, timing);
  }

  private _fullyCovers(element: BaseElement, timing: RenderTiming): boolean {
    return timing.startTimeMs > element.startTimeMs
      && timing.endTimeMs < element.endTimeMs;
  }
}

export function getTimingState(tracks: TimelineTrack[]): TimingState {
  const timings = new RenderTimingList();

  /**
   * We should reverse this array as we are stacking elements 
   * from last tracks to first track.
   */
  const reversed = [...tracks].reverse();

  reversed.forEach((track) => {
    track.elements.forEach((element) => {
      timings.updateTimings(element);
    });
  });

  return timings.finish();
}
