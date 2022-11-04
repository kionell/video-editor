import { forwardRef, useEffect } from 'react';

export const withMovableX = <T,>(Component: React.FC<T>) => {
  const makeMovableX = (element: HTMLElement) => {
    let offsetX = 0;

    const startMoving = (event: MouseEvent) => {
      offsetX = element.offsetLeft - event.pageX;
      element.style.position = 'absolute';
      
      document.addEventListener('mousemove', moveElement);
      document.addEventListener('mouseup', stopMoving);
    };

    const moveElement = (event: MouseEvent) => {
      element.style.left = Math.max(0, (event.pageX + offsetX)) + 'px';
    };

    const stopMoving = () => {
      document.removeEventListener('mousemove', moveElement);
      document.removeEventListener('mouseup', stopMoving);
    };

    element.addEventListener('mousedown', startMoving);
  };

  const MovableXComponent = forwardRef<HTMLElement, T>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeMovableX(ref.current);
    }, []);

    return <Component ref={ref} {...props} />;
  });

  MovableXComponent.displayName = 'Movable X Component';

  return MovableXComponent;
};
