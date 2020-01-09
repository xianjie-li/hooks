import { useState, useEffect, useCallback } from 'react';
import { useSelf } from './useSelf';
import { useSetState } from './useSetState';
import { useIsInitMount } from './useIsInitMount';

import { AnyObject, placeHolderFn } from './util';

import { isFunction } from '@lxjx/utils';

export interface UseFetchOptions<Data> {
  /** 一个boolean或function，为false时，会阻止请求，为function时，取它的返回值，当函数内部抛出错误时，pass会被设置为false。可以用来实现串行请求。(即使阻止请求依然会设置payload) */
  pass?: boolean | (() => boolean);
  /** 类似effect(fn, inputs)，当依赖数组内的值发生改变时，重新进行请求, 确保长度不会发生改变，传入引用类型时请先memo */
  inputs?: any[]
  /** 是否在初次加载时进行请求，默认true */
  initFetch?: boolean;
  /** 指定extraData的初始值. */
  extraData?: object;
  /** 超时时间，默认8000ms */
  timeout?: number;
  /** 成功回调, 第二个参数在当次请求是在payload没有改变的情况下触发时为true */
  onSuccess?: (res: Data, isUpdate: boolean) => void;
  /** 错误回调 */
  onError?: (err: any) => void;
  /** 无论成功与否都会调用。注意，在旧的请求被新的请求覆盖掉时，不会触发。 */
  onComplete?: () => void;
  /** 请求超时的回调 */
  onTimeout?: () => void;
}


/* note: 互斥状态，与其他互斥状态不会共存，例如，当error存在时，同为互斥状态的timeout和loading会被还原为他们的初始值 */
export interface UseFetchReturns<Payload, Data, ExtraData> {
  /** method方法resolve时，data为它resolve的值 */
  data: Data;
  /** 正在进行请求。该状态为互斥状态 */
  loading: boolean;
  /** method方法reject时，error为它reject的值。该状态为互斥状态 */
  error: any;
  /** 当请求超时会将它设置为true。该状态为互斥状态 */
  timeout: boolean;
  /** 当前用于请求的payload */
  payload: Payload;
  /** 设置payload并触发请求, 使用方式同类组件的setState() */
  setPayload: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
  /** 设置payload并触发请求, 它会覆盖掉原有状态 */
  setOverPayload: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
  /** 使用当前的payload更新请求 */
  update: () => void;
  /** 以指定Payload覆盖并发起请求，如果Payload未传，则与update()等效 */
  send: (patch: Partial<Payload> | ((payload: Payload) => Partial<Payload>)) => void;
  /** 存放额外数据，用于实现分页等功能 */
  extraData: ExtraData;
  /** 手动设置当前的data, 使用方式同类组件的setState() */
  setData: (patch: Partial<Data> | ((data: Data) => Partial<Data>)) => void;
  /** 设置extraData, 使用方式同类组件的setState() */
  setExtraData: (patch: Partial<ExtraData> | ((prevState: ExtraData) => Partial<ExtraData>)) => void;
}

export const useFetch = <Payload extends AnyObject, Data, ExtraData extends AnyObject>(
  method: (...arg: any[]) => Promise<Data>, // 一个Promise return函数或async函数，resolve的结果会作为data，失败时会将reject的值设置为error, timeout 由 useFetch 内部进行处理
  initPayload = {} as Payload, // 初始化的请求参数
  options = {} as UseFetchOptions<Data>, // 配置当前的useFetch
) => {
  const {
    pass = true,
    inputs = [],
    initFetch = true,
    extraData = {},
    timeout = 8000,
    onSuccess = placeHolderFn,
    onError = placeHolderFn,
    onComplete = placeHolderFn,
    onTimeout = placeHolderFn,
  } = options;

  /* pass规则：为函数时取返回值，函数内部报错时取false，否则直接取pass的值 */
  let isPass = pass;
  if (isFunction(pass)) {
    try {
      isPass = pass();
    } catch (err) {
      isPass = false;
    }
  }

  const self = useSelf({
    isUpdate: false,
  });

  const isInit = useIsInitMount();

  const [force, forceUpdate] = useState(0);

  const [payload, setPayload, setOverPayload] = useSetState(initPayload);

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

  /* 将inputs改变标记为isUpdate*/
  useEffect(function flagUpdate() {
    self.isUpdate = true;
  }, [...inputs]);

  useEffect(function fetchHandle() {
    // 初始化时，如果initFetch为false则跳过
    if (isInit && !initFetch) {
      return;
    }

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
        const response: Data = await method(payload);
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

    if (isPass) {
      fetcher().then();
    } else {
      self.isUpdate = false;
    }

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [payload, isPass, force, ...inputs]);

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

  const update = useCallback(_update, [isPass]);
  function _update() {
    if (!isPass) return;
    self.isUpdate = true;
    forceUpdate((p) => ++p);
  }

  const send = useCallback(_send, [update]);
  function _send(payload?: Payload) {
    payload
      ? setOverPayload(payload)
      : update();
  }

  return {
    ...state,
    payload,
    setPayload,
    setOverPayload,
    update,
    send,
    setData: _setState,
    setExtraData: _setExtraData,
  } as UseFetchReturns<Payload, Data, ExtraData>;
};
