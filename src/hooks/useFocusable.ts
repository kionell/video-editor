import { Ref, useEffect } from 'react';
import Sister, { SisterEventListener } from 'sister';

type FocusableEventType = 'focus' | 'blur';

export interface FocusableState {
  type: FocusableEventType;
  target: HTMLElement;
  isFocused: boolean;
}

export type FocusableCallback = (state: FocusableState) => void;

export interface FocusableProps {
  focusCallback?: FocusableCallback;
  blurCallback?: FocusableCallback;
}

export function useFocusable(ref: Ref<HTMLElement>, props?: FocusableProps): void {
  const makeFocusable = (element: HTMLElement, props?: FocusableProps) => {
    const emitter = new Sister();

    const onElementClick = () => {
      if (element.classList.contains('focused')) {
        return;
      }

      document.addEventListener('mousedown', onOutsideClick);

      emitter.trigger<FocusableEventType, FocusableState>('focus', {
        type: 'focus',
        target: element,
        isFocused: true,
      });
    };

    const onOutsideClick = (event: MouseEvent) => {
      event.stopPropagation();

      if (!element.classList.contains('focused')) {
        return;
      }

      if (!element.contains(event.target as HTMLElement)) {
        unfocusElement();
      }
    };

    const unfocusElement = () => {
      document.removeEventListener('mousedown', onOutsideClick);

      emitter.trigger<FocusableEventType, FocusableState>('blur', {
        type: 'blur',
        target: element,
        isFocused: false,
      });
    }

    element.addEventListener('mousedown', onElementClick);

    if (element.classList.contains('focused')) {
      document.addEventListener('mousedown', onOutsideClick);
    }

    let focusCallbackListener: SisterEventListener | null = null;
    let blurCallbackListener: SisterEventListener | null = null;

    if (props?.focusCallback) {
      focusCallbackListener = emitter.on('focus', props.focusCallback);
    }

    if (props?.blurCallback) {
      blurCallbackListener = emitter.on('blur', props.blurCallback);
    }

    return () => {
      element.removeEventListener('mousedown', onElementClick);
      document.removeEventListener('mousedown', onOutsideClick);

      if (focusCallbackListener) {
        emitter.off(focusCallbackListener);
      }

      if (blurCallbackListener) {
        emitter.off(blurCallbackListener);
      }
    };
  };

  useEffect(() => {
    if (ref instanceof Function || !ref?.current) return;

    return makeFocusable(ref.current, props);
  }, []);
}
