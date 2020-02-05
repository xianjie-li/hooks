import { useState, useEffect, useCallback } from 'react';
import { useSelf } from './useSelf';
import { useIsInitMount } from './useIsInitMount';
import { useSessionSetState } from './useSessionSetState';
import { useSessionState } from './useSessionState';

import { placeHolderFn } from './util';

import { isFunction } from '@lxjx/utils';

export interface UseFetchOptions<Payload, Data, ExtraData> {
  /** true | 一个boolean或function，为false时，会阻止请求，为function时，取它的返回值，当函数内部抛出错误时，pass会被设置为false。可以用来实现串行请求。(不会阻止手动设置data等或payload操作) */
  pass?: boolean | (() => boolean);
  /** [] | 类似useEffect(fn, inputs)，当依赖数组内的值发生改变时，重新进行请求, 确保长度不会发生改变，传入引用类型时请先memo */
  inputs?: any[];
  /** {} | data的初始值, 可用于搭配redux来获取初始状态, 当存在有效缓存时，缓存会覆盖此项(使用redux也就没用理由使用缓存了) */
  initData?: Data | (() => Data);
  /** true | 标记为post请求，将会跳过初始化时的请求、缓存 */
  isPost?: boolean;
  /** {} | 初始化载荷, 当存在有效缓存时，缓存会覆盖此项 */
  initPayload?: Payload;
  /** {} | 指定extraData的初始值, 当存在有效缓存时，缓存会覆盖此项 */
  initExtraData?: ExtraData;
  /** 传递给请求方法的查询，传递此项时，Payload会被忽略, 并且每次search发生改变时都会自动发起更新请求 */
  search?: string;
  /** 8000 | 超时时间(ms) */
  timeout?: number;
  /** 轮询间隔，传递后会开启轮询并以指定的ms进行轮询(ms必须大于500才会生效, 需要进行轮询开关是，可以传递小于500的值或null) */
  pollingInterval?: number;
  /** 用于缓存的key，传递后，会将状态缓存到session中，下次加载时将读取缓存数据作为初始值 */
  cacheKey?: string;
  /** 成功回调, 第二个参数在当次请求是在payload没有改变的情况下触发时为true */
  onSuccess?: (result: Data, isUpdate: boolean) => void;
  /** 错误回调 */
  onError?: (error: any) => void;
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

export const useFetch = <
  Payload extends object = any,
  Data extends object = any,
  ExtraData extends object = any
  >(
    method: (...arg: any[]) => Promise<Data>, // 一个Promise return函数或async函数，resolve的结果会作为data，失败时会将reject的值设置为error, timeout 由 useFetch 内部进行处理
    options = {} as UseFetchOptions<Payload, Data, ExtraData>, // 配置当前的useFetch
  ) => {
  const {
    pass = true,
    inputs = [],
    isPost = false,
    initData,
    initPayload,
    initExtraData,
    search: _search,
    timeout = 8000,
    pollingInterval,
    cacheKey,
    onSuccess = placeHolderFn,
    onError = placeHolderFn,
    onComplete = placeHolderFn,
    onTimeout = placeHolderFn,
  } = options;

  const isCache = !!cacheKey && !isPost; // 包含用于缓存的key并且非isPost时，缓存才会生效

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
    lastFetch: Date.now(), // 对上一次请求的时间进行标记，用于处理轮询等状态
  });

  const isInit = useIsInitMount();

  const [force, forceUpdate] = useState(0);

  const [payload, setPayload, setOverPayload] = useSessionSetState<Payload>(`${cacheKey}_FETCH_PAYLOAD`, initPayload, { disable: !isCache });

  const [extraData, setExtraData] = useSessionSetState<ExtraData>(`${cacheKey}_FETCH_EXTRA`, initExtraData, { disable: !isCache });

  const [search, setSearch] = useSessionState(`${cacheKey}_FETCH_SEARCH`, _search, { disable: !isCache });
  // 同步props _search 到 state search
  useEffect(() => {
    setSearch(_search);
    // eslint-disable-next-line
  }, [_search]);

  /* 常用关联值存一个state减少更新 */
  const [state, setState] = useSessionSetState<{
    data: Data | undefined;
    loading: boolean;
    error: any;
    timeout: boolean;
  }>(`${cacheKey}_FETCH_STATES`, {
    data: initData instanceof Function ? initData() : initData,
    loading: false,
    error: undefined,
    timeout: false,
  }, { disable: !isCache });

  /* 轮询处理 */
  useEffect(function intervalHandle() {
    let timer: number;

    if (pollingInterval && pollingInterval > 500) {
      timer = window.setInterval(() => {
        const now = Date.now();
        const last = self.lastFetch;
        const reFetch = (now - last) >= pollingInterval;
        reFetch && _update();
      }, pollingInterval);
    }

    return () => {
      timer && clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [pollingInterval]);

  /* 将inputs改变标记为isUpdate */
  useEffect(function flagUpdate() {
    if (!isInit) {
      self.isUpdate = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...inputs]);

  useEffect(function fetchHandle() {
    let ignore = false;
    let timer: any;
    const _isUpdate = self.isUpdate;
    self.isUpdate = false;

    // 初始化时，如果isPost则跳过
    if (isInit && isPost) {
      return;
    }

    async function fetcher() {
      setState({ ...getResetState('loading', true) });
      self.lastFetch = Date.now();

      timer = setTimeout(() => {
        ignore = true;
        onTimeout();
        setState({ ...getResetState('timeout', true) });
      }, timeout);

      try {
        // search存在时取search
        const response: Data = await method((search !== undefined && search) ? search : payload);
        if (ignore) return;
        setState({ ...getResetState('data', response) });
        onSuccess(response, _isUpdate);
      } catch (err) {
        if (ignore) return;
        setState({ ...getResetState('error', err) });
        onError(err);
      } finally {
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
      timer && clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, search, isPass, force, ...inputs]);

  /* 返回一个将互斥的状态还原的对象，并通过键值设置某个值 */
  function getResetState(key: string, value: any) {
    return {
      loading: false,
      error: undefined,
      timeout: false,
      [key]: value,
    };
  }

  const memoSetState = useCallback(_setState, [setState]);
  function _setState(patch: any) {
    setState(({ data }) => {
      const _patch = isFunction(patch) ? patch(data) : patch;
      return { data: { ...data, ..._patch } };
    });
  }

  const update = useCallback(_update, [isPass]);
  function _update() {
    if (!isPass) return;
    self.isUpdate = true;
    forceUpdate((p) => ++p);
  }

  const send = useCallback(_send, [update]);
  function _send(_payload?: Payload) {
    if (!isPass) return;
    _payload
      ? setOverPayload(_payload)
      : update();
  }

  return {
    ...state,
    payload,
    setPayload,
    setOverPayload,
    update,
    send,
    setData: memoSetState,
    extraData,
    setExtraData,
  } as UseFetchReturns<Payload, Data, ExtraData>;
};
