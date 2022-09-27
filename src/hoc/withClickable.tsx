import { ForwardedRef, forwardRef, HTMLProps, useEffect } from 'react';

interface ClickProps {
  onPress?: (event: MouseEvent) => void;
}

export const withClickable = (Component: React.FC) => {
  const DraggableComponent = forwardRef<HTMLElement, HTMLProps<HTMLElement>>((
    props: HTMLProps<HTMLElement> & ClickProps, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      const listener = props.onPress ?? null;

      if (listener) {
        ref.current.addEventListener('click', listener);
      }
  
      return () => {
        if (listener) { 
          ref.current?.removeEventListener('click', listener);
        }
      };
    }, []);

    return <Component ref={ref} {...props} />;
  });

  DraggableComponent.displayName = 'Clickable Component';

  return DraggableComponent;
};
