import { ForwardedRef, forwardRef, useEffect } from 'react';

export const withStretchableX = <T, >(Component: React.FC<T>) => {
  type ResizeCallback = () => void;

  const resizeElement = (target: HTMLElement, edge: HTMLElement, left: boolean): ResizeCallback => {
    let previousCursorX = 0;
    let cursorMoveOffsetX = 0;

    let startClickX = 0;
    let startX1 = 0;
    let startX2 = 0;

    const initinalWidth = target.offsetWidth;

    const startResizing = (event: MouseEvent) => {
      startClickX = event.pageX;
      startX1 = target.offsetLeft;
      startX2 = startX1 + target.offsetWidth;

      previousCursorX = startClickX;

      document.addEventListener('mousemove', resizeElement);
      document.addEventListener('mouseup', stopResizing);
    };

    const resizeElement = (event: MouseEvent) => {
      if (left) {
        // (->) min width has been reached.
        if (startX2 - event.pageX + (startClickX - startX1) < edge.offsetWidth * 2) {
          target.style.left = startX2 - edge.offsetWidth * 2 + 'px';
          target.style.width = edge.offsetWidth * 2 + 'px';

          return;
        }

        // <-(_____________) initial width has been reached.
        if (startX2 - event.pageX + (startClickX - startX1) > initinalWidth) {
          target.style.left = startX2 - initinalWidth + 'px';
          target.style.width = initinalWidth + 'px';

          return;
        }
      }
      else {
        // (<-) min width has been reached.
        if (startX1 + edge.offsetWidth * 2 > event.pageX + (startX2 - startClickX)) {
          target.style.left = startX1 + 'px';
          target.style.width = edge.offsetWidth * 2 + 'px';

          return;
        }

        // (_____________)-> initial width has been reached.
        if (startX1 + initinalWidth < event.pageX + (startX2 - startClickX)) {
          target.style.left = startX1 + 'px';
          target.style.width = initinalWidth + 'px';

          return;
        }
      }

      cursorMoveOffsetX = event.pageX - previousCursorX;

      // Default case when we can actually resize element.
      if (left) {
        target.style.left = target.offsetLeft + cursorMoveOffsetX + 'px';
        target.style.width = target.offsetWidth - cursorMoveOffsetX + 'px';
      }
      else {
        target.style.width = target.offsetWidth + cursorMoveOffsetX + 'px';
      }

      previousCursorX = event.pageX;
    };

    const stopResizing = () => {
      document.removeEventListener('mousemove', resizeElement);
      document.removeEventListener('mouseup', stopResizing);
    };

    edge.addEventListener('mousedown', startResizing);

    // Callback for removing event listener when component is unmounted.
    return () => {
      edge.removeEventListener('mousedown', startResizing);
    };
  };

  const makeStretchableX = (element: HTMLElement): ResizeCallback[] => {
    const leftEdges = [...element.getElementsByClassName('edge-left')];
    const rightEdges = [...element.getElementsByClassName('edge-right')];

    const callbacks: ResizeCallback[] = [];

    leftEdges.forEach((edge) => {
      callbacks.push(resizeElement(element, edge as HTMLElement, true));
    });

    rightEdges.forEach((edge) => {
      callbacks.push(resizeElement(element, edge as HTMLElement, false));
    });

    return callbacks;
  };

  const StretchableXComponent = forwardRef<HTMLElement, T>((
    props: T,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      const callbacks = makeStretchableX(ref.current);

      return () => callbacks.forEach((cb) => cb());
    }, []);

    return <Component ref={ref} {...props} />;
  });

  StretchableXComponent.displayName = 'Stretchable X Component';

  return StretchableXComponent;
};
