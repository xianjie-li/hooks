---
title: useFetch
---

# useFetch

通过更`hook`的方式来进行数据请求

## 核心特性

- 自动/手动
- 自动请求状态管理(加载/超时/错误/请求结果)
- SWR/数据缓存
- 轮询
- 节流/防抖
- 竞态
- 取消请求
- more...

## 示例

<code src="./useFetch.demo.tsx" />

## 基础示例

<code src="./useFetch/Base.tsx" />

## 节流/防抖

<code src="./useFetch/ThrottleDebounce.tsx" />

## API

```ts
const bonus = useFetch(method, options?);
```

**method** - 一个 Promise return 函数或 async 函数, 当不为函数时不会走请求流程, 可藉此实现串连请求

**options** - 配置

```ts
interface UseFetchOptions<Data, Payload> {
  /** [] | 类似useEffect(fn, deps)，当依赖数组内的值发生改变时，会以当前参数进行更新请求, 请勿传入未memo的引用类型值 */
  deps?: any[];
  /** 当查询方法依赖简单类型参数时使用，在变更时发起更新请求并作为参数传入查询方法。传递此项时，Payload会被忽略 */
  arg?: string | number | boolean;
  /** false | 只能通过send来触发请求 */
  manual?: boolean;
  /** 10000 | 超时时间 */
  timeout?: number;
  /** 初始data, 支持 `T => T` 方式取值 */
  initData?: (() => Data) | Data;
  /** 初始payload, 在不存在arg时，作为参数传递给请求方法，否则传入arg, 支持 `T => T` 方式取值 */
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
  /** true | 当存在缓存数据时，是否进行swr(stale-while-revalidate)请求 */
  stale?: boolean;
  /** 节流间隔时间，传入时，开启节流, 只有初始化时的配置会生效 */
  throttleInterval?: number;
  /** 防抖间隔时间，传入时，开启防抖, 只有初始化时的配置会生效, 当存在throttleInterval时，此配置不会生效 */
  debounceInterval?: number;
  /** 轮询间隔, 大于500时生效 */
  pollingInterval?: number;
}
```

**bonus**

```ts
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
  /**
   * 以新参数发起请求/发起更新(无参数或为合成事件)/存在arg配置时时payload参数无效,
   * 如果该次请求有效，返回一个必定resolve数组的Promise，数组值1为reject的结果(不为null说明该次请求发生了错误)，数组值2为resolve的结果 */
  send: (
    newPayload?: Payload | React.SyntheticEvent | undefined
  ) => Promise<[any, Data]>;
}
```
