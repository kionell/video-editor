import { ForwardedRef, forwardRef, HTMLProps, useEffect } from 'react';

type ClickProps = HTMLProps<HTMLElement> & {
  listener?: (event: MouseEvent) => void;
};

export const withClickable = <T extends ClickProps>(Component: React.FC<T>) => {
  const DraggableComponent = forwardRef<HTMLElement, T>((
    props: T, 
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
