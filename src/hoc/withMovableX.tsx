import { forwardRef, useEffect, MouseEventHandler } from 'react';

interface MovableProps {
  onMoveX?: MouseEventHandler;
}

export const withMovableX = <P, >(Component: React.FC<P>) => {
  const makeMovableX = (element: HTMLElement, props: P & MovableProps) => {
    let offsetX = 0;

    const startMoving: MouseEventHandler = (event) => {
      offsetX = element.offsetLeft - event.pageX;
      element.style.position = 'absolute';

      document.addEventListener('mousemove', moveElement as any);
      document.addEventListener('mouseup', stopMoving as any);

      if (props.onMoveX) {
        document.addEventListener('mousemove', props.onMoveX as any);
      }
    };

    const moveElement: MouseEventHandler = (event) => {
      element.style.left = Math.max(0, (event.pageX + offsetX)) + 'px';
    };

    const stopMoving: MouseEventHandler = () => {
      document.removeEventListener('mousemove', moveElement as any);
      document.removeEventListener('mouseup', stopMoving as any);

      if (props.onMoveX) {
        document.removeEventListener('mousemove', props.onMoveX as any);
      }
    };

    element.addEventListener('mousedown', startMoving as any);
  };

  const MovableXComponent = forwardRef<HTMLElement, P & MovableProps>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      makeMovableX(ref.current, props);
    }, []);

    return <Component ref={ref} {...props} />;
  });

  MovableXComponent.displayName = 'Movable X Component';

  return MovableXComponent;
};
