import { ForwardedRef, forwardRef, HTMLProps, useEffect, useState } from 'react';

type ToggleProps = HTMLProps<HTMLElement> & { togglable?: boolean };

export const withTogglable = (Component: React.FC) => {
  const TogglableComponent = forwardRef<HTMLElement, ToggleProps>((
    props: ToggleProps, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const [ isToggled, setToggled ] = useState(false);

    const toggleButton = () => props.togglable && setToggled(!isToggled);

    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      ref.current.addEventListener('click', toggleButton);

      return () => {
        ref.current?.removeEventListener('click', toggleButton);
      };
    }, []);

    return (
      <Component 
        ref={ref} 
        className={isToggled ? 'toggled' : ''}
        {...props} 
      />
    );
  });

  TogglableComponent.displayName = 'Togglable Component';

  return TogglableComponent;
};
