import {
  useState, useCallback,
  SetStateAction, Dispatch,
} from 'react';

const BASE_KEY = 'HOOKS_SESSION_STATE_CACHE';

function setSessionState(key: string, beCache: any) {
  window.sessionStorage.setItem(`${BASE_KEY}_${key.toUpperCase()}`, JSON.stringify(beCache));
}

function getSessionState(key: string) {
  const cache = window.sessionStorage.getItem(`${BASE_KEY}_${key.toUpperCase()}`);
  return cache === null ? cache : JSON.parse(cache);
}

/**
 * 与useState一致，区别是会在缓存和加载对值进行sessionStorage存取
 * */
function useSessionState<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
function useSessionState<S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useSessionState<S>(key: string, initialState?: any) {
  const [state, setState] = useState<S>(() => {
    const cache = getSessionState(key);
    if (cache !== null) { // null以外的值都视为缓存
      return cache;
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
        setSessionState(key, patchRes);
        return patchRes;
      });
    } else {
      setSessionState(key, patch);
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
