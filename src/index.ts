import React from 'react';
const { useRef, useEffect, useState } = React;

import { Optional } from 'utility-types';

type AnyObject = {
  [key: string]: any;
}

/** 返回类似类组件的this的实例属性 */
export function useSelf<T>(init?: T) {
  const self = useRef<AnyObject>(init || {});
  return self.current as T;
}

/** 与useEffect参数一致，区别是不会在初次渲染时触发 */
export function useUpdate(didUpdate: () => (void | (() => (void | undefined))), source?: any[]): void {
  const self = useSelf<{
    updated: boolean
  }>({ updated: false });

  useEffect(() => {
    if(self.updated) {
      return didUpdate();
    }
    self.updated = true;
  }, source)
}

export function useLegacyState<T>(init: T & object) {
  const [state, setState] = useState<T>(init);
  function _setState(SetStateAction: ((prev: T) => Optional<T & object>) | T): void {
    if(typeof SetStateAction === 'function') {
      setState((prev: T) => ({
        ...prev,
        ...(SetStateAction as ((prev: T) => Optional<T & object>))(prev),
      }));
    } else {
      setState((prev: T) => ({...prev, ...SetStateAction}));
    }
  }
  return [state, _setState] as const;
}
