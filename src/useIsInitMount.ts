import { useEffect, useRef } from 'react';
import { useSelf } from './useSelf';

export function useIsInitMount(): boolean {
  const count = useRef(0);
  const isInit = count.current === 0;
  useEffect(() => {
    count.current++;
  }, []);

  return isInit;
}
