import { BaseSyntheticEvent } from 'react';

type DebounceCallback = (...args: any) => void;
type DebounceFunc = (event: Event | BaseSyntheticEvent) => void;

export function useDebounce(cb: DebounceCallback, timeout = 15): DebounceFunc {
  let timer: number;

  return (event) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(cb, timeout, event);
  };
}
