import { BaseSyntheticEvent } from 'react';

type DebounceCallback = (...args: any) => void;
type DebounceFunc = (event: Event | BaseSyntheticEvent, timeout?: number) => void;

export function useDebounce(cb: DebounceCallback): DebounceFunc {
  let timer: number;

  return (event, timeout = 0) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(cb, timeout, event);
  };
}
