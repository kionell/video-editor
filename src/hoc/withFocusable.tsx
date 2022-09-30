import { ForwardedRef, forwardRef, useEffect, useState } from 'react';

export const withFocusable = <T,>(Component: React.FC<T>) => {
  const FocusedComponent =  forwardRef<HTMLElement, T>((
    props: T, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const [selected, setSelected] = useState(false);

    const unfocusElement = (event: MouseEvent) => {
      if (ref instanceof Function || !ref?.current) return;
      
      const targetPath = event.composedPath();

      if (event.target !== ref.current && !targetPath?.includes(ref.current)) {
        setSelected(false);
      }
    };

    const focusElement = () => setSelected(true);
  
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      ref.current.addEventListener('mousedown', focusElement);
      document.addEventListener('mousedown', unfocusElement);
  
      return () => {
        document.removeEventListener('mousedown', unfocusElement);
        ref.current?.removeEventListener('mousedown', focusElement);
      };
    }, []);

    return (
      <Component 
        ref={ref}
        className={selected ? 'focused' : ''}
        {...props} 
      />
    );
  });

  FocusedComponent.displayName = 'Focused Component';

  return FocusedComponent;
};
