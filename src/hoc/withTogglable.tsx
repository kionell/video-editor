import { ForwardedRef, forwardRef, HTMLProps, useState } from 'react';

type ToggleProps = HTMLProps<HTMLElement> & { togglable?: boolean };

export const withTogglable = (Component: React.FC) => {
  const TogglableComponent = forwardRef<HTMLElement, ToggleProps>((
    props: ToggleProps, 
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const [ isToggled, setToggled ] = useState(false);

    const toggleButton = () => props.togglable && setToggled(!isToggled);

    return (
      <Component 
        ref={ref}
        onClick={toggleButton}
        className={isToggled ? 'toggled' : ''}
        {...props}
      />
    );
  });

  TogglableComponent.displayName = 'Togglable Component';

  return TogglableComponent;

};