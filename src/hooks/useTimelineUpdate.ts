import { EffectCallback, useEffect, useRef } from 'react';
import { useAppSelector } from './useAppSelector';
import { BaseElement } from '../core/Elements';
import { selectFocusedTracks, selectTracks } from '../store/Selectors';
import { TimelineTrack } from '../core/Timeline/TimelineTrack';

export function useTimelineUpdate(cb: EffectCallback): void {
  const focusedTracks = useAppSelector(selectFocusedTracks);
  const tracks = useAppSelector(selectTracks);

  const previousFocused = useRef<TimelineTrack[]>();
  const previousTracks = useRef<TimelineTrack[]>();

  const checkSameFocused = (current: TimelineTrack[], previous: TimelineTrack[]) => {
    if (!current || !previous) return false;

    if (current.length !== previous.length) {
      return false;
    }

    return current.every((track, i) => {
      return track.uniqueId === previous[i].uniqueId;
    });
  };

  const checkUpdated = (current: TimelineTrack[], previous: TimelineTrack[]) => {
    if (!current || !previous) return false;

    if (current.length !== previous.length) {
      return true;
    }

    return current.some((currentTrack, i) => {
      const currentElements = currentTrack.elements;
      const previousElements = previousTracks.current[i].elements;

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
    const isUpdated = checkSameFocused(focusedTracks, previousFocused.current)
      || checkUpdated(tracks, previousTracks.current);

    previousFocused.current = focusedTracks;
    previousTracks.current = tracks;

    if (isUpdated) return cb();
  }, [tracks]);
}
