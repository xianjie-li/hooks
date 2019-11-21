import { useState, useCallback } from 'react';

/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */
export const useSetState = <T extends object>(
  initialState: T = {} as T
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void, (state: T | ((prevState: T) => T)) => void] => {
  const [state, set] = useState<T>(initialState);
  const setState = useCallback(
    patch => {
      set(prevState => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
    },
    [set]
  );

  return [state, setState, set];
};
