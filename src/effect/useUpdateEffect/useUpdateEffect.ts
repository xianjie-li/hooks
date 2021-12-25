import { useEffect, useRef } from 'react';

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const r = useRef(0);

  useEffect(() => {
    if (r.current !== 0) return effect();
    r.current += 1;
  }, deps);
};
