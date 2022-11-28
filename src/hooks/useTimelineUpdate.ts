import { EffectCallback, useEffect, useRef } from 'react';
import { useAppSelector } from './useAppSelector';
import { Timeline } from '../core/Timeline/Timeline';
import { BaseElement } from '../core/Elements';

export function useTimelineUpdate(cb: EffectCallback): void {
  const timeline = useAppSelector((state) => state.timeline);
  const previous = useRef<Timeline>();

  const checkSameFocused = (current: Timeline, previous: Timeline) => {
    if (!current || !previous) return false;

    const currentFocused = current.focusedTracks;
    const previousFocused = previous.focusedTracks;

    if (currentFocused.length !== previousFocused.length) {
      return false;
    }

    return currentFocused.every((track, i) => {
      return track.uniqueId === previousFocused[i].uniqueId;
    });
  };

  const checkUpdated = (current: Timeline, previous: Timeline) => {
    if (!current || !previous) return false;

    const currentTracks = current.tracks;
    const previousTracks = previous.tracks;

    if (currentTracks.length !== previousTracks.length) {
      return true;
    }

    return currentTracks.some((currentTrack, i) => {
      const currentElements = currentTrack.elements;
      const previousElements = previousTracks[i].elements;

      if (currentElements.length !== previousElements.length) {
        return true;
      }

      currentElements.some((currentElement, j) => {
        const previousElement = previousElements[j] as BaseElement; // Why any?

        return currentElement.startTimeMs !== previousElement.startTimeMs
          || currentElement.endTimeMs !== previousElement.endTimeMs;
      });
    });
  };

  useEffect(() => {
    /**
     * We should ignore all focus/blur updates as they doesn't actually update timeline.
     * All other actions are allowed and should be checked separately.
     */
    const isUpdated = checkSameFocused(timeline, previous.current)
      || checkUpdated(timeline, previous.current);

    previous.current = timeline;

    if (isUpdated) return cb();
  }, [timeline.tracks]);
}
