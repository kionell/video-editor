import { forwardRef, HTMLProps, useEffect } from 'react';

export const withDraggable = (Component: React.FC) => {
  const makeDraggable = (element: HTMLElement) => {
    let offsetX = 0, offsetY = 0;

    const dragMouseDown = (event: DragEvent) => {
      offsetX = element.offsetLeft - event.pageX;
      offsetY = element.offsetTop - event.pageY;
      
      element.style.position = 'absolute';
      document.addEventListener('dragover', elementDrag);
      document.addEventListener('dragend', closeDragElement);
    };

    const elementDrag = (event: DragEvent) => {
      // event.preventDefault();

      element.style.left = (event.pageX + offsetX) + 'px';
      element.style.top = (event.pageY + offsetY) + 'px';
    };

    const closeDragElement = (event: DragEvent) => {
      // element.style.position = 'relative';

      // element.parentNode?.removeChild(element);

      // const targetElement = event.target as HTMLElement;

      // targetElement?.parentElement?.parentElement?.appendChild(element);

      document.removeEventListener('dragover', elementDrag);
      document.removeEventListener('dragend', closeDragElement);
    };

    element.addEventListener('dragstart', dragMouseDown);
  };

  const DraggableComponent = forwardRef<HTMLElement, HTMLProps<HTMLElement>>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current);
    }, []);

    return <Component ref={ref} draggable {...props} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};