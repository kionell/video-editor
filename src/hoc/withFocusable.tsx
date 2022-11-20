import { forwardRef, useEffect } from 'react';
import Sister, { SisterEventListener } from 'sister';

type FocusableEventType = 'focus' | 'blur';

export interface FocusableState {
  type: FocusableEventType;
  target: HTMLElement;
  isFocused: boolean;
}

export type FocusableCallback = (state: FocusableState) => void;

interface FocusableProps {
  focusCallback?: FocusableCallback;
  blurCallback?: FocusableCallback;
}

export const withFocusable = <T, >(Component: React.FC<T>) => {
  const FocusedComponent = forwardRef<HTMLElement, T & FocusableProps>((props, ref) => {
    useEffect(() => {
      if (ref instanceof Function || !ref?.current) return;

      const makeFocusable = (element: HTMLElement, props: T & FocusableProps) => {
        const emitter = new Sister();

        const focusElement = (event: MouseEvent) => {
          event.stopPropagation();

          if (element.classList.contains('focused')) {
            return;
          }

          element.classList.add('focused');

          document.addEventListener('mousedown', unfocusElement);

          emitter.trigger<FocusableEventType, FocusableState>('focus', {
            type: 'focus',
            target: element,
            isFocused: true,
          });
        };

        const unfocusElement = (event: MouseEvent) => {
          event.stopPropagation();

          if (!element.classList.contains('focused')) {
            return;
          }

          if (!element.contains(event.target as HTMLElement)) {
            element.classList.remove('focused');

            document.removeEventListener('mousedown', unfocusElement);

            emitter.trigger<FocusableEventType, FocusableState>('blur', {
              type: 'blur',
              target: element,
              isFocused: false,
            });
          }
        };

        element.addEventListener('mousedown', focusElement);

        let focusCallbackListener: SisterEventListener | null = null;
        let blurCallbackListener: SisterEventListener | null = null;

        if (props.focusCallback) {
          focusCallbackListener = emitter.on('focus', props.focusCallback);
        }

        if (props.blurCallback) {
          blurCallbackListener = emitter.on('blur', props.blurCallback);
        }

        return () => {
          document.removeEventListener('mousedown', focusElement);

          if (focusCallbackListener) {
            emitter.off(focusCallbackListener);
          }

          if (blurCallbackListener) {
            emitter.off(blurCallbackListener);
          }
        };
      };

      return makeFocusable(ref.current, props);
    }, []);

    return <Component {...props} ref={ref} />;
  });

  FocusedComponent.displayName = 'Focused Component';

  return FocusedComponent;
};
