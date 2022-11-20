import { Ref, useEffect } from 'react';
import { createPositionTracker } from '../core/Utils/Position';
import Sister, { SisterEventListener } from 'sister';

type DraggableEventType = 'start' | 'move' | 'end';

export interface DraggableState {
  type: DraggableEventType;
  offsetX: number;
  offsetY: number;
  target: HTMLElement;
  handle: HTMLElement;
}

export type DraggableCallback = (state: DraggableState) => void;

export interface DraggableProps {
  dragStartCallback?: DraggableCallback;
  dragMoveCallback?: DraggableCallback;
  dragEndCallback?: DraggableCallback;
}

export function useDraggable(ref: Ref<HTMLElement>, props: DraggableProps): void {
  const makeClone = (element: HTMLElement): HTMLElement => {
    const cloned = element.cloneNode(true) as HTMLElement;

    cloned.style.position = 'fixed';
    cloned.style.zIndex = '9999';
    cloned.style.width = element.offsetWidth + 'px';
    cloned.style.height = element.offsetHeight + 'px';
    cloned.style.pointerEvents = 'none';
    cloned.classList.add('dragging');

    element.parentNode?.insertBefore(cloned, element);

    return cloned;
  }

  const makeDraggable = (element: HTMLElement, props: DraggableProps) => {
    const tracker = createPositionTracker();
    const emitter = new Sister();

    let clone: HTMLElement;
    let position: ReturnType<typeof tracker.update>;

    let firstMove = true;
    let startDisplay: string;
    let startOpacity: string;

    element.draggable = true;
    element.style.userSelect = 'none';
    element.style.cursor = 'grab';

    const translate = (x: number, y: number) => {
      clone.style.left = x + 'px';
      clone.style.top = y + 'px';
    };

    const onDragStart = (event: DragEvent | TouchEvent) => {
      clone = makeClone(element);
      tracker.start(event);

      startOpacity = element.style.opacity;
      element.style.opacity = '0';

      document.addEventListener('dragover', onDragMove, false);
      document.addEventListener('drop', onDrop, false);

      element.addEventListener('dragend', onDragEnd, false);
      element.addEventListener('touchmove', onDragMove, false);
      element.addEventListener('touchend', onDragEnd, false);

      position = tracker.update(event);

      translate(
        position.startPageX - position.startOffsetX,
        position.startPageY - position.startOffsetY,
      );

      emitter.trigger('start', {
        type: 'start',
        offsetX: position.offsetX,
        offsetY: position.offsetY,
        target: element,
        handle: clone,
      });
    };

    const onDragMove = (event: DragEvent | TouchEvent) => {
      event.preventDefault();

      position = tracker.update(event);

      if (firstMove) {
        startDisplay = element.style.display;
        element.style.display = 'none';

        firstMove = false;
      }

      if (!position.isChanged || position.isOutside) {
        return;
      }

      translate(
        position.startPageX - position.startOffsetX + position.relativeX,
        position.startPageY - position.startOffsetY + position.relativeY,
      );

      emitter.trigger('move', {
        type: 'move',
        offsetX: position.offsetX,
        offsetY: position.offsetY,
        target: element,
        handle: clone,
      });
    }

    const onDrop = (event: DragEvent | TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
    }

    const onDragEnd = () => {
      clone.parentNode?.removeChild(clone);

      element.style.display = startDisplay;
      element.style.opacity = startOpacity;
      element.style.cursor = 'grab';

      document.removeEventListener('dragover', onDragMove, false);
      document.removeEventListener('drop', onDrop, false);

      element.removeEventListener('dragend', onDragEnd, false);
      element.removeEventListener('touchmove', onDragMove, false);
      element.removeEventListener('touchend', onDragEnd, false);

      emitter.trigger('end', {
        type: 'end',
        offsetX: position.offsetX,
        offsetY: position.offsetY,
        target: element,
        handle: clone,
      });

      firstMove = true;
    };

    let startCallbackListener: SisterEventListener | null = null;
    let moveCallbackListener: SisterEventListener | null = null;
    let endCallbackListener: SisterEventListener | null = null;

    if (props.dragStartCallback) {
      startCallbackListener = emitter.on('start', props.dragStartCallback);
    }

    if (props.dragMoveCallback) {
      moveCallbackListener = emitter.on('move', props.dragMoveCallback);
    }

    if (props.dragEndCallback) {
      endCallbackListener = emitter.on('end', props.dragEndCallback);
    }

    element.addEventListener('dragstart', onDragStart, false);
    element.addEventListener('touchstart', onDragStart, false);

    return () => {
      if (startCallbackListener) {
        emitter.off(startCallbackListener);
      }

      if (moveCallbackListener) {
        emitter.off(moveCallbackListener);
      }

      if (endCallbackListener) {
        emitter.off(endCallbackListener);
      }

      element.removeEventListener('dragstart', onDragStart, false);
      element.removeEventListener('touchstart', onDragStart, false);
    }
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeDraggable(ref.current, props);
  }, []);
}
