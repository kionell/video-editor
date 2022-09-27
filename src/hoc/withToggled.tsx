import React, { HTMLProps, useEffect, useRef } from 'react';

export const withToggled = (Component: React.FC): React.FC => {
  const makeDraggable = (element: HTMLElement) => {
    let offsetX = 0, offsetY = 0;

    const dragMouseDown = (event: MouseEvent) => {
      event.preventDefault();

      offsetX = element.offsetLeft - event.pageX;
      offsetY = element.offsetTop - event.pageY;

      document.addEventListener('mousemove', elementDrag);
      document.addEventListener('mouseup', closeDragElement);
    };

    const elementDrag = (event: MouseEvent) => {
      event.preventDefault();

      element.style.left = (event.pageX + offsetX) + 'px';
      element.style.top = (event.pageY + offsetY) + 'px';
    };

    const closeDragElement = () => {
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    };

    element.addEventListener('mousedown', dragMouseDown);
    element.style.position = 'absolute';
  };

  const DraggableComponent: React.FC = (props: HTMLProps<HTMLElement>) => {
    const componentRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!componentRef.current) return;

      makeDraggable(componentRef.current);
    }, []);

    return <Component ref={componentRef} {...props} />;
  };

  return DraggableComponent;
};