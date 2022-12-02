import { BASE_TIMELINE_ELEMENT_DURATION_MS, PREVIEW_FRAME_WIDTH, TIMELINE_OFFSET_X } from '../../constants';
import { BaseElement } from '../Elements/BaseElement';
import { CategoryName } from '../Enums/Category';
import { MediaType } from '../Enums/MediaType';
import { UploadedFile } from '../Files/UploadedFile';
import { ITimelineZoomState } from '../State/ITimelineZoomState';
import { TimelineTrack } from '../Timeline/TimelineTrack';
import { TIMELINE_ZOOM_LEVELS } from '../Timeline/TimelineZoom';
import { convertUploadedFileToElement, getFileFromDraggable } from './Files';
import { clamp } from './Math';
import { findIndex } from './Search';

export function getAllowedSettings(type: MediaType): CategoryName[] {
  const categories: Set<CategoryName> = new Set([
    'Transform',
    'Volume',
    'Speed',
    'Fade',
    'Filters',
    'Adjust',
  ]);

  switch (type) {
    case MediaType.Audio: {
      categories.delete('Transform');
      categories.delete('Filters');
      categories.delete('Adjust');
      break;
    }

    case MediaType.Image: {
      categories.delete('Volume');
      categories.delete('Speed');
      break;
    }
  }

  return [...categories];
}

export function getWidthFromDraggable(draggable: HTMLElement, files: UploadedFile[], zoom = 1): number {
  if (draggable.classList.contains('general-item')) {
    const file = getFileFromDraggable(draggable, files);
    const fileDurationMs = (file?.duration ?? 0) * 1000;

    const durationMs = fileDurationMs || BASE_TIMELINE_ELEMENT_DURATION_MS;

    return timeMsToUnits(durationMs, zoom);
  }

  if (draggable.classList.contains('timeline-element')) {
    return draggable.offsetWidth;
  }

  return 0;
}

export function getElementFromDraggable(draggable: HTMLElement, files: UploadedFile[]): BaseElement | null {
  if (draggable.classList.contains('general-item')) {
    const file = getFileFromDraggable(draggable, files);

    return convertUploadedFileToElement(file);
  }

  return null;
}

/**
 * Searches for a track by its index.
 * @param index Target index of a track.
 * @returns Found timeline track or null.
 */
export function getTrackByIndex(tracks: TimelineTrack[], index: number): TimelineTrack | null {
  if (index < 0 || index >= tracks.length) {
    return null;
  }

  return tracks[index];
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

export function getPreviousZoomLevel(currentZoom: ITimelineZoomState): ITimelineZoomState {
  console.log(TIMELINE_ZOOM_LEVELS[getPreviousZoomIndex(currentZoom)]);

  return TIMELINE_ZOOM_LEVELS[getPreviousZoomIndex(currentZoom)];
}

export function getNextZoomLevel(currentZoom: ITimelineZoomState): ITimelineZoomState {
  console.log(TIMELINE_ZOOM_LEVELS[getNextZoomIndex(currentZoom)]);

  return TIMELINE_ZOOM_LEVELS[getNextZoomIndex(currentZoom)];
}

export function getFitZoomLevel(totalLengthMs: number, scrollX = 0, zoom = 1): ITimelineZoomState {
  const getVisibleWidth = () => {
    const scrollOffset = TIMELINE_OFFSET_X - scrollX;
    const clampedScrollOffset = Math.max(0, scrollOffset);

    const trackpad = document.querySelector('.timeline-trackpad') as HTMLElement;
    const offsetWidth = trackpad?.offsetWidth ?? document.body.offsetWidth;

    // Use 1 to prevent NaN because of dividing by 0.
    return Math.max(1, offsetWidth - clampedScrollOffset);
  };

  const getFullWidth = () => {
    if (typeof totalLengthMs === 'number') {
      return timeMsToUnits(totalLengthMs, zoom);
    }

    return calculateTimelineWidth(totalLengthMs, zoom);
  };

  const multiplier = getVisibleWidth() / getFullWidth();
  const targetZoom = zoom * multiplier;

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

export function getPreviousZoomIndex(currentZoom: ITimelineZoomState): number {
  const lastLevel = TIMELINE_ZOOM_LEVELS.at(-1);
  const isLastIndex = currentZoom === lastLevel;
  const nextZoomIndex = getNextZoomIndex(currentZoom);
  const previousZoomIndex = nextZoomIndex - (isLastIndex ? 1 : 2);

  // Limit zoom to the first default level.
  return Math.max(0, previousZoomIndex);
}

export function getNextZoomIndex(currentZoom: ITimelineZoomState): number {
  const nextZoomIndex = findIndex(TIMELINE_ZOOM_LEVELS, (level) => {
    return level.zoom > currentZoom.zoom;
  });

  // Limit zoom to the last default level.
  return Math.min(TIMELINE_ZOOM_LEVELS.length - 1, nextZoomIndex);
}

export function timeMsToUnits(timeMs: number, zoom = 1): number {
  const zoomedFrameWidth = PREVIEW_FRAME_WIDTH * zoom;
  const frames = timeMs * (60 / 1000);

  return frames * zoomedFrameWidth;
}

export function unitsToTimeMs(units: number, zoom = 1): number {
  const zoomedFrameWidth = PREVIEW_FRAME_WIDTH * zoom;

  const frames = units / zoomedFrameWidth;
  const frameInterval = 1000 / 60;

  return frames * frameInterval;
}

export function calculateTimelineWidth(totalLengthMs: number, zoom = 1): number {
  return timeMsToUnits(totalLengthMs, zoom);
}
