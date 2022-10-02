import { forwardRef, useEffect } from 'react';

export const withDraggable = <T,>(Component: React.FC<T>) => {
  const makeDraggable = (element: HTMLElement) => {
    element.style.cursor = 'grab';

    const startDragging = (event: DragEvent) => {
      const targetElement = event.target as HTMLElement;
      
      element.style.opacity = '0.5';
      
      // If we are trying to drag using resizable control element.
      if (targetElement.className.includes('edge')) return;

      document.addEventListener('dragend', stopDragging);
    };

    const stopDragging = (event: DragEvent) => {
      event.stopImmediatePropagation();

      // Make element fully visible after drag ends.
      element.style.opacity = '1';
      element.style.cursor = 'grab';

      document.removeEventListener('dragend', stopDragging);
    };

    element.addEventListener('dragstart', startDragging);
  };

  const DraggableComponent = forwardRef<HTMLElement, T>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current);
    }, []);

    return <Component ref={ref} draggable {...props} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};
