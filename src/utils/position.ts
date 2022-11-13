interface IEventPosition {
  pageX: number;
  pageY: number;
  offsetX: number;
  offsetY: number;
}

interface IPositionTrackerState {
  startPageX: number;
  startPageY: number;
  startOffsetX: number;
  startOffsetY: number;
  pageX: number;
  pageY: number;
  offsetX: number;
  offsetY: number;
  isOutside: boolean;
  isChanged: boolean;
}

interface IPositionTracker {
  update(event: DragEvent | TouchEvent): IPositionTrackerState;
}

export function createPositionTracker(event: DragEvent | TouchEvent): IPositionTracker {
  const state: IPositionTrackerState = {
    startPageX: 0,
    startPageY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0,
    isOutside: false,
    isChanged: false,
  };

  let eventPosition = getPosition(event);
  let lastPageX = eventPosition.pageX;
  let lastPageY = eventPosition.pageY;

  state.startPageX = eventPosition.pageX;
  state.startPageY = eventPosition.pageY;
  state.startOffsetX = eventPosition.offsetX;
  state.startOffsetY = eventPosition.offsetY;

  return {
    update(event: DragEvent | TouchEvent): IPositionTrackerState {
      eventPosition = getPosition(event);

      state.pageX = eventPosition.pageX;
      state.pageY = eventPosition.pageY;
      state.offsetX = eventPosition.pageX - state.startPageX;
      state.offsetY = eventPosition.pageY - state.startPageY;

      const scrollLeft = document.documentElement.scrollLeft;
      const scrollTop = document.documentElement.scrollTop;

      state.isOutside = state.pageX === scrollLeft
        && state.pageY === scrollTop;

      state.isChanged = lastPageX !== eventPosition.pageX
        || lastPageY !== eventPosition.pageY;

      lastPageX = eventPosition.pageX;
      lastPageY = eventPosition.pageY;

      return state;
    },
  };
}

function getPosition(event: DragEvent | TouchEvent): IEventPosition {
  const touchEvent = event as TouchEvent;
  const dragEvent = event as DragEvent;

  const source = touchEvent.touches ? touchEvent.touches[0] : dragEvent;

  if (touchEvent.touches && touchEvent.target) {
    const target = touchEvent.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    return {
      pageX: source.pageX,
      pageY: source.pageY,
      offsetX: source.pageX - rect.left,
      offsetY: source.pageY - rect.top,
    };
  }

  if (dragEvent.dataTransfer) {
    return {
      pageX: dragEvent.pageX,
      pageY: dragEvent.pageY,
      offsetX: dragEvent.offsetX,
      offsetY: dragEvent.offsetY,
    }
  }

  return {
    pageX: source.pageX,
    pageY: source.pageY,
    offsetX: 0,
    offsetY: 0,
  }
}
