import {
  useState, useCallback,
  SetStateAction, Dispatch,
} from 'react';

const BASE_KEY = 'USE_SESSION_STATE_CACHE';

function setSessionState(key: string, beCache: any) {
  window.sessionStorage.setItem(`${BASE_KEY}_${key.toUpperCase()}`, JSON.stringify(beCache));
}

function getSessionState(key: string) {
  const cache = window.sessionStorage.getItem(`${BASE_KEY}_${key.toUpperCase()}`);
  return cache === null ? cache : JSON.parse(cache);
}

export interface UseSessionStateOptions {
  /** false | 是否启用缓存 */
  disable?: boolean;
}

/**
 * 与useState一致，区别是会在缓存和加载对值进行sessionStorage存取
 * */
function useSessionState<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
function useSessionState<S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useSessionState<S>(key: string, initialState: S | (() => S), option?: UseSessionStateOptions): [S, Dispatch<SetStateAction<S>>];
function useSessionState<S>(key: string, initialState?: any, option?: any) {
  const { disable = false } = option || {};

  const [state, setState] = useState<S>(() => {
    if (!disable) {
      const cache = getSessionState(key);
      if (cache !== null) { // null以外的值都视为缓存
        return cache;
      }
    }

    if (initialState instanceof Function) {
      return initialState();
    }
    return initialState;
  });

  const _setState: typeof setState = useCallback((patch) => {
    if (patch instanceof Function) {
      setState(prev => {
        const patchRes = patch(prev);
        !disable && setSessionState(key, patchRes);
        return patchRes;
      });
    } else {
      !disable && setSessionState(key, patch);
      setState(patch);
    }
    // eslint-disable-next-line
  }, [setState]);

  return [state, _setState];
}

export {
  useSessionState,
  setSessionState,
  getSessionState,
};
