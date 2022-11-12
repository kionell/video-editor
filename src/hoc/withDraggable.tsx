import { forwardRef, useEffect } from 'react';

export const withDraggable = <T, >(Component: React.FC<T>) => {
  const makeClone = (element: HTMLElement): HTMLElement => {
    const cloned = element.cloneNode(true) as HTMLElement;

    cloned.style.position = 'fixed';
    cloned.style.cursor = 'grabbing';
    cloned.style.zIndex = '9999';
    cloned.style.width = element.offsetWidth + 'px';
    cloned.style.height = element.offsetHeight + 'px';
    cloned.style.pointerEvents = 'none';

    element.parentNode?.insertBefore(cloned, element);

    return cloned;
  };

  const makeDraggable = (element: HTMLElement) => {
    let clone: HTMLElement;
    let dragClickOffsetX: number;
    let dragClickOffsetY: number;
    let lastDragX: number;
    let lastDragY: number;

    element.draggable = true;
    element.style.userSelect = 'none';
    element.style.cursor = 'grab';

    const translate = (x: number, y: number) => {
      clone.style.left = x + 'px';
      clone.style.top = y + 'px';
    };

    const onDragStart = (event: DragEvent) => {
      clone = makeClone(element);

      dragClickOffsetX = event.offsetX;
      dragClickOffsetY = event.offsetY;

      translate(event.x - dragClickOffsetX, event.y - dragClickOffsetY);

      element.style.opacity = '0';

      element.addEventListener('drag', onDrag);
      element.addEventListener('dragend', onDragEnd);
    };

    const onDrag = (event: DragEvent) => {
      let dragX = event.x;
      let dragY = event.y;

      if (dragX === 0 && dragY === 0) {
        dragX = lastDragX;
        dragY = lastDragY;
      }

      if (dragX === lastDragX && dragY === lastDragY) {
        return;
      }

      translate(dragX - dragClickOffsetX, dragY - dragClickOffsetY);

      lastDragX = dragX;
      lastDragY = dragY;
    }

    const onDragEnd = () => {
      clone.parentNode?.removeChild(clone);

      element.style.opacity = '1';

      element.removeEventListener('drag', onDrag);
      element.removeEventListener('dragend', onDragEnd);
    };

    element.addEventListener('dragstart', onDragStart);
  };

  const DraggableComponent = forwardRef<HTMLElement, T>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current);
    }, []);

    return <Component {...props} ref={ref} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};
