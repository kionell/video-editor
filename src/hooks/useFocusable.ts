import Sister, { SisterEventListener } from 'sister';
import { Ref, useEffect } from 'react';
import { PositionEvent } from '../core/Utils/Position';

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
  unfocusClasses?: string[];
  shiftClasses?: string[];
}

export function useFocusable(ref: Ref<HTMLElement>, props?: FocusableProps): void {
  const makeFocusable = (element: HTMLElement, props?: FocusableProps) => {
    const emitter = new Sister();

    const shouldUnfocus = (event: PositionEvent) => {
      const unfocusClasses = props.unfocusClasses;
      const shiftClasses = props.shiftClasses;

      if (!unfocusClasses && !shiftClasses) return true;

      const targetElement = event.target as HTMLElement;

      const isUnfocusAllowed = unfocusClasses.some((key) => {
        return targetElement.classList.contains(key);
      });

      const isShiftPress = event.shiftKey && shiftClasses.some((key) => {
        return targetElement.classList.contains(key);
      });

      return isUnfocusAllowed && !isShiftPress;
    };

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

    const onOutsideClick = (event: PositionEvent) => {
      event.stopPropagation();

      if (!element.classList.contains('focused')) {
        return;
      }

      if (!element.contains(event.target as HTMLElement) && shouldUnfocus(event)) {
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
    };

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
