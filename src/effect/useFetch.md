---
title: useFetch
---

# useFetch

通过更`hook`的方式对数据请求状态进行管理

## 示例

<code src="./useFetch.demo.tsx" />

## API

```ts
const bonus = useFetch(method, options?);
```

**method** - 一个 Promise return 函数或 async 函数, 当不为函数时不会走请求流程, 可藉此实现串连请求

**options** - 配置

```ts
UseFetchOptions<Data, Payload> {
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
```

**bonus**

```ts
UseFetchReturns<Data, Payload> {
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
```
