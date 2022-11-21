import { Ref, useEffect } from 'react';
import { createPositionTracker, IPositionTrackerState } from '../core/Utils/Position';

export function useResizable(ref: Ref<HTMLElement>): void {
  const makeResizable = (element: HTMLElement) => {
    const tracker = createPositionTracker();

    let targetElement: HTMLElement;
    let position: IPositionTrackerState;
    let initialStyle: CSSStyleDeclaration;
    let initialWidth: number;
    let initialHeight: number;
    let initialTop: number;
    let initialLeft: number;

    const startResizing = (event: MouseEvent) => {
      targetElement = event.target as HTMLElement;

      if (!targetElement.className.includes('resizer')) return;

      event.preventDefault();
      event.stopPropagation();

      position = tracker.start(event);
      initialStyle = window.getComputedStyle(element);
      initialWidth = parseFloat(initialStyle.width);
      initialHeight = parseFloat(initialStyle.height);
      initialTop = parseFloat(initialStyle.top);
      initialLeft = parseFloat(initialStyle.left);

      document.addEventListener('mousemove', resizeElement);
      document.addEventListener('mouseup', stopResizing);
    };

    const resizeElement = (event: MouseEvent) => {
      position = tracker.update(event);

      if (targetElement.classList.contains('resizer-left')) {
        element.style.left = initialLeft + position.relativeX + 'px';
        element.style.width = initialWidth - position.relativeX + 'px';
      }

      if (targetElement.classList.contains('resizer-top')) {
        element.style.top = initialTop + position.relativeY + 'px';
        element.style.height = initialHeight - position.relativeY + 'px';
      }

      if (targetElement.classList.contains('resizer-right')) {
        element.style.width = initialWidth + position.relativeX + 'px';
      }

      if (targetElement.classList.contains('resizer-bottom')) {
        element.style.height = initialHeight + position.relativeY + 'px';
      }
    };

    const stopResizing = () => {
      document.removeEventListener('mousemove', resizeElement);
      document.removeEventListener('mouseup', stopResizing);
    };

    element.addEventListener('mousedown', startResizing);

    // Callback for removing event listener when component is unmounted.
    return () => {
      element.removeEventListener('mousedown', startResizing);
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeResizable(ref.current);
  }, []);
}
