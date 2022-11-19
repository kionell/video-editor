interface IEventPosition {
  pageX: number;
  pageY: number;
  offsetX: number;
  offsetY: number;
  targetX: number;
  targetY: number;
}

type PositionEvent = MouseEvent | DragEvent | TouchEvent;

export interface IPositionTracker {
  start(event: PositionEvent): IPositionTrackerState;
  update(event: PositionEvent): IPositionTrackerState;
}

export interface IPositionTrackerState extends IEventPosition {
  startPageX: number;
  startPageY: number;
  startOffsetX: number;
  startOffsetY: number;
  startTargetX: number;
  startTargetY: number;
  relativeX: number;
  relativeY: number;
  isOutside: boolean;
  isChanged: boolean;
}

export function createPositionTracker(): IPositionTracker {
  const state: IPositionTrackerState = {
    startPageX: 0,
    startPageY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    startTargetX: 0,
    startTargetY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0,
    targetX: 0,
    targetY: 0,
    relativeX: 0,
    relativeY: 0,
    isOutside: false,
    isChanged: false,
  };

  let lastPageX: number | null = null;
  let lastPageY: number | null = null;

  return {
    start(event: PositionEvent): IPositionTrackerState {
      const eventPosition = getPosition(event);

      state.startPageX = eventPosition.pageX;
      state.startPageY = eventPosition.pageY;
      state.startOffsetX = eventPosition.offsetX;
      state.startOffsetY = eventPosition.offsetY;
      state.startTargetX = eventPosition.targetX;
      state.startTargetY = eventPosition.targetY;

      return this.update(event);
    },
    update(event: PositionEvent): IPositionTrackerState {
      const eventPosition = getPosition(event);

      state.pageX = eventPosition.pageX;
      state.pageY = eventPosition.pageY;
      state.offsetX = eventPosition.offsetX;
      state.offsetY = eventPosition.offsetY;
      state.targetX = eventPosition.targetX;
      state.targetY = eventPosition.targetY;
      state.relativeX = eventPosition.pageX - state.startPageX;
      state.relativeY = eventPosition.pageY - state.startPageY;

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

function getPosition(event: PositionEvent): IEventPosition {
  const touchEvent = event as TouchEvent;
  const positionEvent = event as DragEvent | MouseEvent;

  const source = touchEvent.touches
    ? touchEvent.touches[0]
    : positionEvent;

  const target = event.target as HTMLElement;
  const rect = target?.getBoundingClientRect() ?? null;

  return {
    pageX: source.pageX,
    pageY: source.pageY,
    offsetX: source.pageX - (rect?.left ?? 0),
    offsetY: source.pageY - (rect?.top ?? 0),
    targetX: (rect?.left ?? 0),
    targetY: (rect?.top ?? 0),
  };
}
