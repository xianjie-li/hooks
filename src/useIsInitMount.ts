import { useEffect, useRef } from 'react';

export function useIsInitMount(): boolean {
  const count = useRef(0);
  const isInit = count.current === 0;
  useEffect(() => {
    count.current++;
  }, []);

  return isInit;
}
