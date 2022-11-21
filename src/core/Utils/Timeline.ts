import { BASE_TIMELINE_ELEMENT_DURATION_MS, TIMELINE_OFFSET_X } from '../../constants';
import { BaseElement } from '../Elements/BaseElement';
import { IFileState } from '../State/IFileState';
import { ITimelineZoomState } from '../State/ITimelineZoomState';
import { Timeline } from '../Timeline/Timeline';
import { TimelineTrack } from '../Timeline/TimelineTrack';
import { TIMELINE_ZOOM_LEVELS } from '../Timeline/TimelineZoom';
import { convertUploadedFileToElement, getFileFromDraggable } from './Files';
import { clamp } from './Math';
import { findIndex } from './Search';

export function getWidthFromDraggable(draggable: HTMLElement, timeline: Timeline, files: IFileState): number {
  if (draggable.classList.contains('general-item')) {
    const file = getFileFromDraggable(draggable, files);
    const fileDurationMs = (file?.duration ?? 0) * 1000;

    const durationMs = fileDurationMs || BASE_TIMELINE_ELEMENT_DURATION_MS;

    return timeline.timeMsToUnits(durationMs);
  }

  if (draggable.classList.contains('timeline-element')) {
    return draggable.offsetWidth;
  }

  return 0;
}

/**
 * Searches for a track by its index.
 * @param index Target index of a track.
 * @returns Found timeline track or null.
 */
export function getTrackByIndex(timeline: Timeline, index: number): TimelineTrack | null {
  if (index < 0 || index >= timeline.totalTracks) {
    return null;
  }

  return timeline.tracks[index];
}

/**
 * Searches for an element which is played at the specified time.
 * @param time Time in milliseconds.
 * @returns Found element or null.
 */
export function getElementAtTime<T extends BaseElement>(track: TimelineTrack<T>, time: number): T | null {
  const predicate = (element: T) => {
    return time >= element.startTimeMs && time < element.endTimeMs;
  };

  const index = findIndex(track.elements, predicate);

  return index >= 0 ? track.elements[index] : null;
}

export function getPreviousZoomLevel(timeline: Timeline): ITimelineZoomState {
  return TIMELINE_ZOOM_LEVELS[getPreviousZoomIndex(timeline)];
}

export function getNextZoomLevel(timeline: Timeline): ITimelineZoomState {
  return TIMELINE_ZOOM_LEVELS[getNextZoomIndex(timeline)];
}

export function getFitZoomLevel(timeline: Timeline, totalLengthMs?: number): ITimelineZoomState {
  const getVisibleWidth = () => {
    const scrollOffset = TIMELINE_OFFSET_X - timeline.currentScroll.left;
    const clampedScrollOffset = Math.max(0, scrollOffset);

    const trackpad = document.querySelector('.timeline-trackpad') as HTMLElement;
    const offsetWidth = trackpad?.offsetWidth ?? document.body.offsetWidth;

    // Use 1 to prevent NaN because of dividing by 0.
    return Math.max(1, offsetWidth - clampedScrollOffset);
  };

  const getFullWidth = () => {
    if (typeof totalLengthMs === 'number') {
      return timeline.timeMsToUnits(totalLengthMs);
    }

    return timeline.width;
  };

  const multiplier = getVisibleWidth() / getFullWidth();
  const targetZoom = timeline.currentZoom.zoom * multiplier;

  const fitZoomIndex = findIndex(TIMELINE_ZOOM_LEVELS, (level) => {
    return level.zoom > targetZoom;
  });

  const clampedIndex = clamp(fitZoomIndex, 0, TIMELINE_ZOOM_LEVELS.length - 1);

  return {
    ...TIMELINE_ZOOM_LEVELS[clampedIndex],
    zoom: targetZoom,
    unit: 1 / targetZoom,
  };
}

export function getPreviousZoomIndex(timeline: Timeline): number {
  const lastLevel = TIMELINE_ZOOM_LEVELS.at(-1);
  const isLastIndex = timeline.currentZoom === lastLevel;
  const nextZoomIndex = getNextZoomIndex(timeline);
  const previousZoomIndex = nextZoomIndex - (isLastIndex ? 1 : 2);

  // Limit zoom to the first default level.
  return Math.max(0, previousZoomIndex);
}

export function getNextZoomIndex(timeline: Timeline): number {
  const nextZoomIndex = findIndex(TIMELINE_ZOOM_LEVELS, (level) => {
    return level.zoom > timeline.currentZoom.zoom;
  });

  // Limit zoom to the last default level.
  return Math.min(TIMELINE_ZOOM_LEVELS.length - 1, nextZoomIndex);
}
