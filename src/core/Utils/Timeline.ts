import { BASE_TIMELINE_ELEMENT_DURATION_MS } from '../../constants';
import { IFileState } from '../State/IFileState';
import { ITimelineZoomState } from '../State/ITimelineZoomState';
import { Timeline } from '../Timeline/Timeline';
import { TimelineTrack } from '../Timeline/TimelineTrack';
import { TIMELINE_ZOOM_LEVELS } from '../Timeline/TimelineZoom';
import { findIndex } from './Search';

export function getWidthFromDraggable(draggable: HTMLElement, timeline: Timeline, files: IFileState): number {
  if (draggable.classList.contains('general-item')) {
    const parentElement = draggable.parentElement as HTMLElement;
    const labelElement = parentElement.querySelector<HTMLElement>('.general-item__label');

    if (!labelElement) return 0;

    const file = files.list.find((f) => f.name === labelElement.innerText);

    if (!file) return 0;

    const duration = (file.duration * 1000) || BASE_TIMELINE_ELEMENT_DURATION_MS;

    return timeline.timeMsToUnits(duration);
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
export function getTrackByIndex(timeline: Timeline, index?: number): TimelineTrack | null {
  if (typeof index !== 'number') return null;

  if (index < 0 || index >= timeline.totalTracks) {
    return null;
  }

  return timeline.tracks[index];
}

export function getPreviousZoomLevel(timeline: Timeline): ITimelineZoomState {
  return TIMELINE_ZOOM_LEVELS[getPreviousZoomIndex(timeline)];
}

export function getNextZoomLevel(timeline: Timeline): ITimelineZoomState {
  return TIMELINE_ZOOM_LEVELS[getNextZoomIndex(timeline)];
}

export function getPreviousZoomIndex(timeline: Timeline): number {
  const lastLevel = TIMELINE_ZOOM_LEVELS[TIMELINE_ZOOM_LEVELS.length - 1];
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
