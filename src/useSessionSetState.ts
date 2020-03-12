import { useCallback } from 'react';
import {
  useSessionState,
  UseSessionStateOptions,
} from './useSessionState';

import { SetState } from './useSetState';

/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */
export const useSessionSetState = <T extends object = any>(
  key: string,
  initialState = {} as (() => T) | T,
  options?: UseSessionStateOptions,
): [T, SetState<T>, SetState<T>] => {
  const [state, set] = useSessionState<T>(key, initialState, options);
  const setState = useCallback(
    patch => {
      set(prevState => ({ ...prevState, ...(patch instanceof Function ? patch(prevState) : patch) }));
    },
    [set],
  );

  return [state, setState, set as SetState<T>];
};
