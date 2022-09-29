import { ForwardedRef, forwardRef, HTMLProps, useEffect, useState } from 'react';

export const withFocusable = (Component: React.FC): React.FC => {
  const FocusedComponent =  forwardRef<HTMLElement, HTMLProps<HTMLElement>>((
    props: HTMLProps<HTMLElement>, 
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
