import { forwardRef, HTMLProps, useEffect } from 'react';

export const withDraggable = (Component: React.FC) => {
  const makeDraggable = (element: HTMLElement) => {
    let offsetX = 0, offsetY = 0;

    element.style.cursor = 'grab';

    const startDragging = (event: MouseEvent) => {
      event.stopPropagation();

      const targetElement = event.target as HTMLElement;
      
      // If we are trying to drag using resizable control element.
      if (targetElement.className.includes('edge')) return;
      
      offsetX = element.offsetLeft - event.pageX;
      offsetY = element.offsetTop - event.pageY;

      element.style.position = 'relative';
      element.style.cursor = 'grabbing';
      element.style.zIndex = '1';

      document.addEventListener('mousemove', dragElement);
      document.addEventListener('mouseup', stopDragging);
    };

    const dragElement = (event: MouseEvent) => {
      // Lower element opacity during drag and change cursor type.
      element.style.opacity = '0.5';

      element.style.left = (event.pageX + offsetX) + 'px';
      element.style.top = (event.pageY + offsetY) + 'px';
    };

    const stopDragging = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;
      const parentNode = targetElement?.parentNode;

      // Make element fully visible after drag ends.
      element.style.opacity = '1';
      element.style.cursor = 'grab';
      element.style.zIndex = '0';

      // Reset element position
      element.style.position = '';
      element.style.left = '0px';
      element.style.top = '0px';

      // element.parentNode?.removeChild(element);
      // parentNode?.appendChild(element);

      document.removeEventListener('mousemove', dragElement);
      document.removeEventListener('mouseup', stopDragging);
    };

    element.addEventListener('mousedown', startDragging);
  };

  const DraggableComponent = forwardRef<HTMLElement, HTMLProps<HTMLElement>>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeDraggable(ref.current);
    }, []);

    return <Component ref={ref} {...props} />;
  });

  DraggableComponent.displayName = 'Draggable Component';

  return DraggableComponent;
};
