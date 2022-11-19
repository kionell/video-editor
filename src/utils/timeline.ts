import { BASE_TIMELINE_ELEMENT_DURATION_MS } from '../constants';
import { IFileState } from '../models/IFileState';
import { Timeline } from '../models/Timeline/Timeline';

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
