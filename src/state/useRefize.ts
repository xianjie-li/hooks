import { AnyObject } from '@lxjx/utils';
import { useRef } from 'react';

export function useRefize<T extends AnyObject>(refState: T): T {
  const ref = useRef({});

  ref.current = Object.assign(ref.current, refState);

  return ref.current as T;
}
