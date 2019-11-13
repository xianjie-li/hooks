import React from 'react';
import { useSetState } from 'react-use';
import { isFunction } from '@lxjx/utils';

const { useRef, useEffect, useState } = React;

import { Optional } from 'utility-types';

type AnyObject = {
  [key: string]: any;
};

/* ------------------------------------------------------------------------ */

/** 返回类似类组件的this的实例属性 */
export function useSelf<T extends object>(init = {} as T) {
  const self = useRef<T>(init);
  return self.current as T;
}

/* ------------------------------------------------------------------------ */

/**
 * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
 * 1. 在setState之后，可以立即通过`state.xx`获取新的值
 * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
 * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
 * */
export function useSyncState<T extends object>(init = {} as T) {
  const [count, update] = useState(0);
  const self = useSelf<T>(init);

  function setSelf(patch: Partial<T> | ((prevState: T) => Partial<T>)): void {
    if (typeof patch === 'function') {
      setHandle(patch(self));
    } else {
      setHandle(patch);
    }
  }

  function setHandle<Y>(patch: Y) {
    // 编译设置新值
    for (const [key, value] of Object.entries(patch)) {
      (self as any)[key] = value;
    }
    // 触发更新
    update(prev => prev + 1);
  }

  return [self, setSelf] as const;
}


/* ------------------------------------------------------------------------ */


interface UseFetchOptions {
  inputs?: any[];
  ExtraData?: object;
  key?: string;
  pass?: boolean | (() => boolean);
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
  onComplete?: ([res, err]: [any, any]) => void;
  onTimeout?: () => void;
}

interface UseFetchReturns<Params, Data, ExtraData> {
  data: Data;
  loading: boolean;
  error: any;
  timeout: boolean;
  params: Params;
  setParams: (patch: Partial<Params> | ((params: Params) => Partial<Params>)) => void;
  setData: (patch: Partial<Data> | ((data: Data) => Partial<Data>)) => void;
  update: () => void;
  extraData: ExtraData;
  setExtraData: (patch: Partial<ExtraData> | ((prevState: ExtraData) => Partial<ExtraData>)) => void;
}

export const useFetch = <Params extends AnyObject, Data, ExtraData extends AnyObject>(
  method: (...arg: any[]) => Promise<Data>,
  defaultParams?: Params,
  pass = true as boolean | (() => boolean),
  options = {} as UseFetchOptions,
) => {
  const {} = options;

  /* pass规则：为函数时取返回值，函数内部报错时取false，否则直接取pass的值 */
  let isPass = false;
  if (isFunction(pass)) {
    try {
      isPass = (pass as () => boolean)();
    } catch(err) {
      isPass = false;
    }
  } else {
    isPass = pass as boolean;
  }

  const [force, forceUpdate] = useState(0);

  const [state, setState] = useSetState<{
    data: Data | undefined;
    loading: boolean;
    error: any;
    timeout: boolean;
    extraData: object;
  }>({
    data: undefined,
    loading: false,
    error: undefined,
    timeout: false,
    extraData: {},
  });

  const [params, setParams] = useSetState(defaultParams);

  useEffect(() => {
    let ignore = false;

    async function fetcher() {
      setState({
        loading: true,
        error: undefined,
        timeout: false,
      });
      try {
        const response: Data = await method(params);
        if (ignore) return;
        setState({
          data: response,
          loading: false,
          error: undefined,
          timeout: false,
        });
      } catch (err) {
        if (ignore) return;
        setState({
          loading: false,
          error: err,
          timeout: false,
        });
      } finally {

      }
    }

    isPass && fetcher();

    return () => {
      ignore = true;
    };
  }, [params, isPass, force]);

  function _setState(patch: any) {
    setState(({ data }) => {
      const _patch = isFunction(patch)
        ? patch(data)
        : patch;
      return { data: { ...data, ..._patch } };
    });
  }

  function _setExtraData(patch: any) {
    setState(({ extraData }) => {
      const _patch = isFunction(patch)
        ? patch(extraData)
        : patch;
      return { extraData: { ...extraData, ..._patch } };
    });
  }

  function update() {
    if (!isPass) return;
    forceUpdate((p) => ++p);
  }

  return {
    ...state,
    params,
    setParams,
    setData: _setState,
    update,
    setExtraData: _setExtraData,
  } as UseFetchReturns<Params, Data, ExtraData>;
};


/* ------------------------------------------------------------------------ */
