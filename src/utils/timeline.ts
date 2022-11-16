import { IFileState } from '../models/IFileState';
import { Timeline } from '../models/Timeline/Timeline';

export function getWidthFromDraggable(draggable: HTMLElement, timeline: Timeline, files: IFileState): number {
  if (draggable.classList.contains('general-item')) {
    const parentElement = draggable.parentElement as HTMLElement;
    const labelElement = parentElement.querySelector<HTMLElement>('.general-item__label');

    if (!labelElement) return 0;

    const file = files.list.find((f) => f.name === labelElement.innerText);

    if (!file) return 0;

    return timeline.timeMsToUnits(file.duration * 1000);
  }

  if (draggable.classList.contains('timeline-element')) {
    return draggable.offsetWidth;
  }

  return 0;
}
