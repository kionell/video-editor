import { forwardRef, useEffect } from 'react';

export const withDraggable = <T, >(Component: React.FC<T>) => {
  const makeDraggable = (element: HTMLElement) => {
    let offsetX = 0, offsetY = 0;

    const startDragging = (event: MouseEvent) => {
      event.stopImmediatePropagation();

      element.style.cursor = 'grab';

      offsetX = element.offsetLeft - event.pageX;
      offsetY = element.offsetTop - event.pageY;

      const targetElement = event.target as HTMLElement;

      if (!targetElement.classList.contains('dragging')) {
        targetElement.classList.add('dragging');
      }

      // If we are trying to drag using resizable control element.
      if (targetElement.classList.contains('edge')) return;

      document.addEventListener('mouseover', dragElement);
      document.addEventListener('mouseup', stopDragging);
    };

    const dragElement = (event: MouseEvent) => {
      // Lower element opacity during drag and change cursor type.
      element.style.opacity = '0.5';

      element.style.left = (event.pageX + offsetX) + 'px';
      element.style.top = (event.pageY + offsetY) + 'px';
    };

    const stopDragging = (event: MouseEvent) => {
      event.stopImmediatePropagation();

      // Make element fully visible after drag ends.
      element.style.opacity = '1';
      element.style.cursor = 'pointer';

      const targetElement = event.target as HTMLElement;

      if (targetElement.classList.contains('dragging')) {
        targetElement.classList.remove('dragging');
      }

      document.removeEventListener('mouseover', dragElement);
      document.removeEventListener('mouseup', stopDragging);
    };

    element.addEventListener('mousedown', startDragging);
  };

  const DraggableComponent = forwardRef<HTMLElement, T>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current);
    }, []);

    return <Component ref={ref} {...props} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};
