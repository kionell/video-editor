import { ForwardedRef, forwardRef, HTMLProps, useEffect } from 'react';

type ClickProps = HTMLProps<HTMLElement> & {
  listener?: (event: MouseEvent) => void;
};

export const withClickable = (Component: React.FC) => {
  const DraggableComponent = forwardRef<HTMLElement, ClickProps>((
    props: ClickProps, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      const listener = props.listener ?? null;

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
