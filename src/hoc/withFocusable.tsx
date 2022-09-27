import { ForwardedRef, forwardRef, HTMLProps, useEffect, useState } from 'react';

export const withFocusable = (Component: React.FC): React.FC => {
  const FocusedComponent =  forwardRef<HTMLElement, HTMLProps<HTMLElement>>((
    props: HTMLProps<HTMLElement>, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const [selected, setSelected] = useState(false);

    const select = (event: MouseEvent) => {
      if (ref instanceof Function || !ref?.current) return;
      
      const targetPath = (event as any)?.path as HTMLElement[];

      if (event.target !== ref.current && !targetPath?.includes(ref.current)) {
        setSelected(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', select);
  
      return () => document.removeEventListener('mousedown', select);
    }, []);

    return (
      <Component 
        ref={ref}
        onMouseDown={() => setSelected(true)}
        className={selected ? 'focused' : ''}
        {...props} 
      />
    );
  });

  FocusedComponent.displayName = 'Focused Component';

  return FocusedComponent;
};
