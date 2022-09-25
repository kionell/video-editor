import { 
  DependencyList, 
  EffectCallback, 
  useLayoutEffect,
  useRef,
} from 'react';

export function useUpdateEffect(cb: EffectCallback, deps?: DependencyList): void {
  const effectRan = useRef(false);
  
  useLayoutEffect(() => {
    if (effectRan.current) cb();

    return () => {
      effectRan.current = true;
    };
  }, deps);
}