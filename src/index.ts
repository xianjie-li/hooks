import React from 'react';
import { useSetState } from 'react-use';
import { isFunction } from '@lxjx/utils';

const { useRef, useEffect, useState } = React;

import { Optional } from 'utility-types';
import { isArray } from 'util';

/* -----------------------------------工具---------------------------------- */

type AnyObject = {
  [key: string]: any;
};

const placeHolderFn = () => undefined;

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


interface UseFetchOptions<Data> {
  inputs?: any[] // 类似effect(fn, inputs)，当依赖数组内的值发生改变时，重新进行请求, 确保长度不会发生改变，传入引用类型时请先memo
  extraData?: object; // 指定extraData的初始值.
  readonly key?: string; // 用于通过fetchTrigger全局触发更新, 只能在初始化时绑定，任何后续的变动都会被忽略
  timeout?: number; // 超时时间，默认8000ms
  onSuccess?: (res: Data, isUpdate: boolean) => void; // 成功回调, 第二个参数在当次请求为update()触发时为true
  onError?: (err: any) => void; // 错误回调
  onComplete?: () => void; // 无论成功与否都会调用。注意，在旧的请求被新的请求覆盖掉时，不会触发。
  onTimeout?: () => void; // 请求超时的回调
}


/* * 互斥状态，与其他互斥状态不会共存，例如，当error存在时，同为互斥状态的timeout和loading会被还原为他们的初始值 */
interface UseFetchReturns<Params, Data, ExtraData> {
  data: Data; // method方法resolve时，data为它resolve的值
  loading: boolean; // 正在进行请求。该状态为互斥状态
  error: any; // method方法reject时，error为它reject的值。该状态为互斥状态
  timeout: boolean; // 当请求超时会将它设置为true。该状态为互斥状态
  params: Params; // 当前用于请求的params
  setParams: (patch: Partial<Params> | ((params: Params) => Partial<Params>)) => void; // 设置params并触发请求, 使用方式同类组件的setState()
  setData: (patch: Partial<Data> | ((data: Data) => Partial<Data>)) => void; // 手动设置当前的data, 使用方式同类组件的setState()
  update: () => void; // 使用当前的params更新请求
  extraData: ExtraData; // 存放额外数据，用于实现分页等功能
  setExtraData: (patch: Partial<ExtraData> | ((prevState: ExtraData) => Partial<ExtraData>)) => void; // 设置extraData, 使用方式同类组件的setState()
}


interface UseFetchMetas {
  [key: string]: {
    update: () => void;
    setParams: any;
    flag: number;
  }[]
}


/* 对传递key的useFetch的update进行绑定，使其能在任何地方进行更新 */
const useFetchMetas: UseFetchMetas = {};

/* 可在注册useFetch的组件外对配置了option.key的useFetch进行一次更新请求，传递params时，使用传入的params合并后进行更新请求 */
export const fetchTrigger = (key: string, params?: AnyObject) => {
  const triggers = useFetchMetas[key];
  if (!triggers || !Array.isArray(triggers)) return;
  if (triggers.length === 0) return;
  triggers.forEach(meta => {
    params ? meta.setParams(params) : meta.update();
  })
};

export const useFetch = <Params extends AnyObject, Data, ExtraData extends AnyObject>(
  method: (...arg: any[]) => Promise<Data>, // 一个Promise return函数或async函数，resolve的结果会作为data，失败时会将reject的值设置为error, timeout 由 useFetch 内部进行处理
  defaultParams?: Params, // 初始化的请求参数
  pass = true as boolean | (() => boolean), // 一个boolean或function，为false时，会跳过该次请求，为function时，取它的返回值，当函数内部抛出错误时，pass会被设置为false。可以用来实现串行请求。
  options = {} as UseFetchOptions<Data>, // 配置当前的useFetch
) => {
  const {
    inputs = [],
    extraData = {},
    timeout = 8000,
    onSuccess = placeHolderFn,
    onError = placeHolderFn,
    onComplete = placeHolderFn,
    onTimeout = placeHolderFn,
    key,
  } = options;

  /* pass规则：为函数时取返回值，函数内部报错时取false，否则直接取pass的值 */
  let isPass = false;
  if (isFunction(pass)) {
    try {
      isPass = (pass as () => boolean)();
    } catch (err) {
      isPass = false;
    }
  } else {
    isPass = pass as boolean;
  }

  const [force, forceUpdate] = useState(0);

  const [params, setParams] = useSetState(defaultParams);

  const self = useSelf({
    isUpdate: false,
  });

  /* 关联值存一个state减少更新 */
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
    extraData: extraData,
  });

  /* fetch handle */
  useEffect(() => {
    let ignore = false;
    let timer: any;
    let _isUpdate = self.isUpdate; // 缓存,使状态只作用于当前effect周期

    async function fetcher() {
      setState({ ...getResetState('loading', true) });

      timer = setTimeout(() => {
        ignore = true;
        onTimeout();
        setState({ ...getResetState('timeout', true) });
      }, timeout);

      try {
        const response: Data = await method(params);
        if (ignore) return;
        setState({ ...getResetState('data', response) });
        onSuccess(response, _isUpdate);
      } catch (err) {
        if (ignore) return;
        setState({ ...getResetState('error', err) });
        onError(err);
      } finally {
        self.isUpdate = false;
        !ignore && onComplete();
        clearTimeout(timer);
      }
    }

    isPass && fetcher();

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [params, isPass, force, ...inputs]);

  /* 当存在key时，存储update和setParams到meta对象中, 用于实现trigger */
  useEffect(() => {
    const flag = Math.random(); // 用于移除

    if (key) {
      if (!Array.isArray(useFetchMetas[key])) {
        useFetchMetas[key] = [];
      }
      useFetchMetas[key].push({
        update,
        setParams,
        flag,
      });
    }

    return () => {
      /* 移除meta数据 */
      if (!key) return;
      const index = useFetchMetas[key].findIndex(item => item.flag === flag);
      useFetchMetas[key].splice(index, 1);
    };
  }, []);

  /* 返回一个将互斥的状态还原的对象，并通过键值设置某个值 */
  function getResetState(key: string, value: any) {
    return {
      loading: false,
      error: undefined,
      timeout: false,
      [key]: value,
    };
  }

  function _setState(patch: any) {
    setState(({ data }) => {
      const _patch = isFunction(patch) ? patch(data) : patch;
      return { data: { ...data, ..._patch } };
    });
  }

  function _setExtraData(patch: any) {
    setState(({ extraData }) => {
      const _patch = isFunction(patch) ? patch(extraData) : patch;
      return { extraData: { ...extraData, ..._patch } };
    });
  }

  function update() {
    if (!isPass) return;
    self.isUpdate = true;
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
