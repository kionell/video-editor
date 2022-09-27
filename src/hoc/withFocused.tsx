import { forwardRef, HTMLProps, useEffect, useState } from 'react';

export const withFocused = (Component: React.FC): React.FC => {
  const FocusedComponent =  forwardRef<HTMLElement, HTMLProps<HTMLElement>>((props, ref) => {
    const [selected, setSelected] = useState(false);

    const select = (e: Event) => {
      if (ref instanceof Function || !ref?.current) return;
      
      if (e.target !== ref.current) {
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