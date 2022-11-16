import { forwardRef, useEffect } from 'react';
import { createPositionTracker } from '../utils/position';
import Sister from 'sister';

type DraggableEventType = 'start' | 'move' | 'end';

export interface DraggableState {
  type: DraggableEventType;
  offsetX: number;
  offsetY: number;
  target: HTMLElement;
  handle: HTMLElement;
  draggingOver: HTMLElement;
}

export type DraggableCallback = (state: DraggableState) => void;

interface DraggableProps {
  dragStartCallback?: DraggableCallback;
  dragMoveCallback?: DraggableCallback;
  dragEndCallback?: DraggableCallback;
}

export const withDraggable = <T, >(Component: React.FC<T>) => {
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
  };

  const makeDraggable = (element: HTMLElement, props: T & DraggableProps) => {
    const emitter = new Sister();

    let clone: HTMLElement;
    let tracker: ReturnType<typeof createPositionTracker>;
    let position: ReturnType<typeof tracker.update>;

    element.draggable = true;
    element.style.userSelect = 'none';
    element.style.cursor = 'grab';

    const translate = (x: number, y: number) => {
      clone.style.left = x + 'px';
      clone.style.top = y + 'px';
    };

    const onDragStart = (event: DragEvent | TouchEvent) => {
      tracker = createPositionTracker(event);
      clone = makeClone(element);

      element.style.cursor = 'grabbing !important';
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

    const onDrop = (event: DragEvent) => {
      event.stopPropagation();
      event.preventDefault();
    }

    const onDragEnd = () => {
      clone.parentNode?.removeChild(clone);

      element.style.opacity = '1';
      element.style.cursor = 'grab';

      element.removeEventListener('drag', onDragMove);
      element.removeEventListener('dragend', onDragEnd);

      emitter.trigger('end', {
        type: 'end',
        offsetX: position.offsetX,
        offsetY: position.offsetY,
        target: element,
        handle: clone,
      });
    };

    element.addEventListener('dragstart', onDragStart, false);
    element.addEventListener('touchstart', onDragStart, false);

    if (props.dragStartCallback) {
      emitter.on('start', props.dragStartCallback);
    }

    if (props.dragMoveCallback) {
      emitter.on('move', props.dragMoveCallback);
    }

    if (props.dragEndCallback) {
      emitter.on('end', props.dragEndCallback);
    }
  };

  const DraggableComponent = forwardRef<HTMLElement, T & DraggableProps>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current, props);
    }, []);

    return <Component {...props} ref={ref} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};
