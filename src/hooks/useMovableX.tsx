import { useEffect, Ref } from 'react';

export function useMovableX(ref: Ref<HTMLElement>): void {
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

    return () => {
      element.removeEventListener('mousedown', startMoving);
    }
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeMovableX(ref.current);
  }, []);
}
