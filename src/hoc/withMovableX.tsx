import { forwardRef, useEffect, MouseEventHandler } from 'react';

export const withMovableX = <P, >(Component: React.FC<P>) => {
  const makeMovableX = (element: HTMLElement) => {
    let offsetX = 0;

    const startMoving: MouseEventHandler = (event) => {
      offsetX = element.offsetLeft - event.pageX;
      element.style.position = 'absolute';

      document.addEventListener('mousemove', moveElement as any);
      document.addEventListener('mouseup', stopMoving as any);
    };

    const moveElement: MouseEventHandler = (event) => {
      element.style.left = Math.max(0, (event.pageX + offsetX)) + 'px';
    };

    const stopMoving: MouseEventHandler = () => {
      document.removeEventListener('mousemove', moveElement as any);
      document.removeEventListener('mouseup', stopMoving as any);
    };

    element.addEventListener('mousedown', startMoving as any);
  };

  const MovableXComponent = forwardRef<HTMLElement, P>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeMovableX(ref.current);
    }, []);

    return <Component ref={ref} {...props} />;
  });

  MovableXComponent.displayName = 'Movable X Component';

  return MovableXComponent;
};
