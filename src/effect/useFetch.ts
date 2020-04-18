import { isEmpty, isFunction, isObject, __GLOBAL__ } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelf } from '../state/useSelf';
import { useSetState } from '../state/useSetState';
import { useStorageState } from '../state/useStorageState';
import { SetStateBase } from '../type';
import { useFn } from './useFn';

const GLOBAL = __GLOBAL__ as Window;

interface UseFetchOptions<Data, Payload> {
  /** [] | 类似useEffect(fn, deps)，当依赖数组内的值发生改变时，重新进行请求 */
  deps?: any[];
  /** 当查询方法依赖简单类型参数时使用，在变更时发起更新请求并作为参数传入查询方法。传递此项时，Payload会被忽略 */
  arg?: string | number | boolean;
  /** false | 只能通过send来触发请求 */
  manual?: boolean;
  /** 8000 | 超时时间 */
  timeout?: number;
  /** 初始data, 支持 `T => T` 方式取值 */
  initData?: (() => Data) | Data;
  /** 初始payload, 支持 `T => T` 方式取值 */
  initPayload?: (() => Payload) | Payload;
  /** 成功回调, 当为更新请求(通过无参调用send, arg，deps等配置发起请求)时，此项为true */
  onSuccess?: (result: Data, isUpdate: boolean) => void;
  /** 错误回调， error为请求函数中抛出的错误 */
  onError?: (error: any) => void;
  /** 无论成功与否都会调用。在旧的请求被新的请求覆盖掉时，不会触发。 */
  onComplete?: () => void;
  /** 请求超时的回调 */
  onTimeout?: () => void;
  /** 用于缓存的key，传递后，会将(payload, data, arg)缓存到session中，下次加载时将读取缓存数据作为初始值 */
  cacheKey?: string;
  /** true | 在存在缓存数据时，是否进行swr(stale-while-revalidate)请求 */
  stale?: boolean;
  /** 节流时间，传入时，开启节流, 只有初始化时的配置会生效 */
  throttleInterval?: number;
  /** 节流时间，传入时，开启防抖, 只有初始化时的配置会生效, 当存在throttleInterval时，此配置不会生效 */
  debounceInterval?: number;
  /** 轮询间隔, 大于500时生效 */
  pollingInterval?: number;
}

interface UseFetchReturns<Data, Payload> {
  /** 是否正在请求 */
  loading: boolean;
  /** method方法reject时，error为它reject的值。 */
  error: any;
  /** 请求超时设置为true */
  timeout: boolean;
  /** method方法resolve的值或initData */
  data: Data | undefined;
  /** 当前用于请求的payload */
  payload: Payload | undefined;
  /** 请求函数依赖的参数，一般代替payload使用 */
  arg: string | number | boolean | undefined;
  /** 设置当前的data */
  setData: SetStateBase<Data>;
  /** 取消请求 */
  cancel: () => void;
  /** 轮询的开关状态，轮询还依赖于pollingInterval配置，只有两者同时有效时才会开启轮询 */
  polling: boolean;
  /** 设置轮询开关状态 */
  setPolling: ((prev: boolean) => boolean) | boolean;
  /** 以新参数发起请求/发起更新(无参数)/存在arg时会以arg代替payload, 如果该次请求有效，返回一个必定resolve数组的Promise，数组值1为执行错误，数组值2为请求结果 */
  send: (newPayload?: Payload | undefined) => Promise<[any, Data]>;
}

/** 简单的判断是否为合成事件 */
function isSyntheticEvent(arg: any) {
  if (!arg) return false;

  if (
    isObject(arg) &&
    'nativeEvent' in arg &&
    'target' in arg &&
    'type' in arg
  ) {
    return true;
  }
  return false;
}

function useFetch<Data = any, Payload = any>(
  /** 一个Promise return函数或async函数, 当不为函数时不会走请求流程 */
  method?: ((...arg: any[]) => Promise<Data>) | any,
  options = {} as UseFetchOptions<Data, Payload>
) {
  const self = useSelf({
    /** 请求的唯一标示，在每一次请求开始前更新，并作为请求有效性的凭据 */
    fetchID: 0,
    /** 完成请求次数 */
    fetchCount: 0,
    /** 超时计时器 */
    timeoutTimer: 0,
    /** 处理轮询状态 */
    lastFetch: Date.now(),
  });
  const {
    initData,
    initPayload,
    deps = [],
    arg,
    manual = false,
    timeout = 10000,
    onSuccess,
    onError,
    onComplete,
    onTimeout,
    cacheKey,
    stale = true,
    throttleInterval,
    debounceInterval,
    pollingInterval,
  } = options;

  const isCache = !!cacheKey; // 包含用于缓存的key并且非isPost时，缓存才会生效

  const [state, setState] = useSetState({
    loading: !manual && isFunction(method),
    error: undefined as any,
    timeout: false,
  });

  const [payload, setPayload] = useStorageState(
    `${cacheKey}_FETCH_PAYLOAD`,
    initPayload,
    {
      disabled: !isCache,
    }
  );

  const [data, setData] = useStorageState(`${cacheKey}_FETCH_DATA`, initData, {
    disabled: !isCache,
  });

  // 将arg映射到内部，用于缓存
  const [innerArg, setInnerArg] = useStorageState(
    `${cacheKey}_FETCH_ARG`,
    arg,
    {
      disabled: !isCache,
    }
  );

  const [polling, setPolling] = useState(true);

  useUpdateEffect(() => {
    setInnerArg(arg!);
  }, [arg]);

  const fetchHandel = useFn(
    async function _fetchHandel(args: any, isUpdate = false) {
      const shouldFetch = isFunction(method);
      if (!shouldFetch) {
        return;
      }

      self.lastFetch = Date.now();

      const cID = Math.random();
      self.fetchID = cID;

      // 清除上一个计时器
      self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
      self.timeoutTimer = GLOBAL.setTimeout(() => {
        cancel();
        onTimeout?.();
        setState({
          ...getResetState('timeout', true),
        });
      }, timeout);

      // 记录当前计时器
      const cTimeoutTimer = self.timeoutTimer;

      // 减少更新次数
      if (!state.loading) {
        setState({
          ...getResetState('loading', true),
        });
      }

      try {
        const res = await method(args);
        if (cID !== self.fetchID) return;
        setState({
          ...getResetState('loading', false),
        });
        setData(res);
        onSuccess?.(res, isUpdate);
        return [undefined, res];
      } catch (err) {
        if (cID !== self.fetchID) return;
        setState({
          ...getResetState('error', err),
        });
        onError?.(err);
        return [err, undefined];
      } finally {
        // 清理当前计时器
        cTimeoutTimer && GLOBAL.clearTimeout(cTimeoutTimer);

        if (cID !== self.fetchID) return;
        onComplete?.();
        self.fetchCount++;
      }
    },
    fn => {
      if (throttleInterval) {
        return _throttle(fn, throttleInterval, { trailing: false }); //对于请求，应该禁止尾随调用
      }

      if (debounceInterval) {
        return _debounce(fn, debounceInterval);
      }

      return fn;
    }
  );

  /** 手动发起请求，传入payload时会以传入值进行替换 */
  const send = useFn((newPayload?: Payload) => {
    const isUpdate = isSyntheticEvent(newPayload) || newPayload === undefined;
    return fetchHandel(getActualPayload(newPayload), isUpdate);
  });

  /** 执行一些自动触发请求的操作 */
  useEffect(() => {
    if (manual) return;
    // 初次请求时，如果有数据且禁用了stale，取消请求
    if (!stale && self.fetchCount === 0 && !isEmpty(data)) {
      setState({
        loading: false,
      });
      return;
    }
    fetchHandel(getActualPayload(), self.fetchCount !== 0);
  }, [innerArg, ...deps]);

  /** 轮询处理 */
  useEffect(
    function intervalHandle() {
      let timer: number;

      if (polling && pollingInterval && pollingInterval > 500) {
        timer = GLOBAL.setInterval(() => {
          const now = Date.now();
          const last = self.lastFetch;
          const reFetch = now - last >= pollingInterval;
          reFetch && send();
        }, pollingInterval);
      }

      return () => {
        timer && clearInterval(timer);
      };
    },
    [pollingInterval, polling]
  );

  /** 接受可选的新payload，并根据条件返回传递给fetchHandel的参数(使用arg或payload) */
  function getActualPayload(newPayload?: Payload) {
    // 包含arg，使用当前arg更新
    if ('arg' in options) {
      return arg;
    }

    // 参数为合成事件或未传，视为更新请求，使用当前payload进行更新请求
    if (isSyntheticEvent(newPayload) || newPayload === undefined) {
      return payload;
    }

    // 包含新的payload，更新payload值并使用新的payload更新请求
    setPayload(newPayload); // 同步新的payload
    return newPayload;
  }

  /** 返回一个将互斥的状态还原的对象，并通过键值覆盖设置某个值 */
  function getResetState(key?: string, value?: any) {
    const resetState: any = {
      loading: false,
      error: undefined,
      timeout: false,
    };

    if (key) {
      resetState[key] = value;
    }

    return resetState;
  }

  /** 取消请求 */
  function cancel() {
    self.fetchID = 0; // 超时后阻止后续赋值操作
    self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
    setState({
      loading: false,
    });
  }

  return ({
    ...state,
    send,
    data,
    payload,
    arg: innerArg,
    setData,
    cancel,
    polling,
    setPolling,
  } as any) as UseFetchReturns<Data, Payload>;
}

export { useFetch };
