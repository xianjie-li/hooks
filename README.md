<h1 align="center" style="color: #61dafb;">hooks</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">📌</h1>
<p align="center">Use Your Imagination</p>


<!-- TOC -->

- [state](#state)
  - [`useSyncState`](#usesyncstate)
  - [`useSetState`](#usesetstate)
  - [`useFormState`](#useformstate)
  - [`useIsInitMount`](#useisinitmount)
  - [`useSessionState`](#usesessionstate)
  - [`useSessionSetState`](#usesessionsetstate)
- [effect](#effect)
  - [`useThrottle`](#usethrottle)
- [lifecycles](#lifecycles)
- [fetch](#fetch)
  - [`useFetch`](#usefetch)
- [UI](#ui)
  - [`useBreakPoint`](#usebreakpoint)
  - [`useScroll`](#usescroll)
  - [`useLockBodyScroll`](#uselockbodyscroll)
- [Router](#router)
  - [`useQuery`](#usequery)
- [other](#other)
  - [`useCustomEvent`](#usecustomevent)
- [awesome hooks](#awesome-hooks)

<!-- /TOC -->

## state
> 用于函数组件的 "this"

`const self = useSelf(init?)`

init: object, 默认为 {}

```js
const self = useSelf({
    name: 'lxj',
    age: 18
});

useEffect(() => {
    self.name = self.name.split('').reverse().join('');
    // 值变更后马上获取变更
    console.log(self.name);
}, []);
```

<br>

<br>

### `useSyncState`

> 与类组件的this.setState用法类似，不支持更新完成的回调，但是可以在setState后立即同步获取到变更(类似useSelf)

`const [state, setState] = useSyncState(init?)`

```jsx
const [syncState, setSyncState] = useSyncState({
    name: 'lxj',
    age: 18,
});

useEffect(() => {
    setState({
        name: 'jxl',
    });
    // or 
    setState(({ age }) => ({
        age: age + 1,
    }));
    // 由于它类似this的特性，变更后的state可以马上获取到
    console.log(syncState.name);
}, []);

useEffect(() => {
    // 即使deps为[]获取到的状态也是最新的
    console.log(syncState.name);
}, []);

// state变更会同步到视图
return (
	<div>{syncState.name}</div>
)
```

<br>

<br>

### `useSetState`

> 与类组件的this.setState用法类似，不支持更新完成的回调

`const [state, setState, setOverState] = useSetState(init?);`

需要额外说明的是setOverState，它会使用传入的state覆盖当前的state而不是合并，与useState的set表现一致

<br>

<br>

### `useFormState`

> 快捷的实现统一接口的受控、非受控组件

`const [state, setState] = useFormState(props, defaultValue)`

* 如果组件接收value，则该组件为受控组件，需要在onChange中同步value的值
* 如果接收defaultValue，则将状态转为内部管理,  并在state改变时通过onChange进行通知
* value和defaultValue都不存在时，组件使用useFormState的defaultValue参数并且在内部管理状态

一个input组件的简单示例

```tsx
interface FormLike<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

const CustomInput: React.FC<FormLike<string>> = (props) => {
  const [state, setState] = useFormState(props, '');

  return (
    <input
      type="text"
      value={state}
      onChange={({ target }) => {
        setState(prev => {
          console.log(prev, target.value);
          return target.value;
        });
      }}
    />
  );
};
```

使用方式

```tsx
// 受控
const [value, setValue] = useState();

<CustomInput value={value} onChang={v => setValue(value)} />

// 非受控
<CustomInput defaultValue="123" onChang={v => console.log(v)} />

<CustomInput onChang={v => console.log(v)} />
```

<br>

<br>

### `useIsInitMount`

> 当组件是初次mount时，返回true

`const isInitMount = useIsInitMount()`

<br>

<br>

### `useSessionState`

> 与useState表现一致，但是它会将state缓存到Session中，页面刷新或组件重载时使用缓存值作为初始值

```ts
const [value, setValue] = useSessionState('cache-key', 123);
```



💡 当需要在组件外更新缓存值时，可以使用额外的工具函数(该方法也可用于useSessionSetState)

```ts
import {
  setSessionState,
  getSessionState,
} from '@lxjx/hooks';

setSessionState('cache-key', 345);
getSessionState('cache-key');
```



根据条件决定是否启用缓存，关闭后，与普通useState用法一样

```ts
useSessionState('cache-key', 123, { disable: false });
```



### `useSessionSetState`

> 同useSessionState，但是其维护一个对象，与useSetState用法一致

<br>

<br>

## effect

### `useThrottle`

> 一个更符合直觉的节流hook

```ts
const caller = useThrottle<FnType>(ms?, {
  leading?: boolean;
  trailing?: boolean;                    
})
```

**FnType?** - 待调用的函数类型

**ms?** - 300 | 节流时间

**option?** - 其他配置

**option.leading**? - 指定调用在节流开始前

**option.trailing?** - 指定调用在节流开始前



**示例**

```ts
function Demo() {
    const caller = useThrottle<typeof handle>();
    
    function handle(position: Position) {
        log(position);
    }
    
    function onScroll({ x, y }) {
        caller(handle, { x, y }); // 声明了`<typeof handle>` 后类型检测是可用的
    }
    
    return (
    	<Scroll onScroll={onScroll}>something</Scroll>
    )
}
```



**💡 其他**

* 相对于 [react-use](https://github.com/streamich/react-use/blob/master/docs/useThrottle.md) 和 [umijs/hooks](https://hooks.umijs.org/side-effect/use-throttle-fn) ， 这种节流的方式不用考虑deps依赖值的改变和闭包的影响
* 如果需要，同一个caller可以用于多个不同的函数，它们共享同一个hook配置
* 参数与lodash完全一致😘



<br>

<br>

## lifecycles



## fetch

### `useFetch`

> 通过hooks来进行颠覆性的数据请求

```ts
const bonus = useFetch(requestMethod, options?);
```



**requestMethod**: 

一个Promise返回函数或async函数, 用于请求异步数据，该函数的执行结果决定了返回的结果。



**options**：

```ts
export interface UseFetchOptions<Payload, Data, ExtraData> {
  /** true | 一个boolean或function，为false时，会阻止请求，为function时，取它的返回值，当函数内部抛出错误时，pass会被设置为false。可以用来实现串行请求。(不会阻止手动设置data等或payload操作) */
  pass?: boolean | (() => boolean);
  /** [] | 类似useEffect(fn, inputs)，当依赖数组内的值发生改变时，重新进行请求, 确保长度不会发生改变，传入引用类型时请先memo */
  inputs?: any[];
  /** {} | data的初始值, 可用于搭配redux来获取初始状态, 当存在有效缓存时，缓存会覆盖此项(使用redux也就没用理由使用缓存了) */
  initData?: Data | (() => Data);
  /** true | 是否初始化时进行请求 */
  initFetch?: boolean;
  /** {} | 初始化载荷, 当存在有效缓存时，缓存会覆盖此项 */
  initPayload?: Payload;
  /** {} | 指定extraData的初始值, 当存在有效缓存时，缓存会覆盖此项 */
  initExtraData?: ExtraData;
  /** 8000 | 超时时间(ms) */
  timeout?: number;
  /** 用于缓存的key，传递后，会将状态缓存到session中，下次加载时将读取缓存数据作为初始值 */
  cacheKey?: string;
  /** 成功回调, 第二个参数在当次请求是在payload没有改变的情况下触发时为true(即通过update等操作执行更新请求时) */
  onSuccess?: (result: Data, isUpdate: boolean) => void;
  /** 错误回调 */
  onError?: (error: any) => void;
  /** 无论成功与否都会调用。注意，在旧的请求被新的请求覆盖掉时，不会触发。 */
  onComplete?: () => void;
  /** 请求超时的回调 */
  onTimeout?: () => void;
}
```



**returns**： (互斥状态表示，同类型状态中只能同时有一个为存在)

```ts
export interface UseFetchReturns<Payload, Data, ExtraData> {
  /** undefined | method方法resolve时，data为它resolve的值 */
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
```



**fetch data**

```jsx
// 创建requestMethod, 可以使用任何你喜欢的请求库
function getGoodsList(params) {
    return new Promise((resolve, reject) => {
        fetch(params)
          .then((res) => resolve(res.json()))
          .catch((err) => reject(err));
    })
}

import { useFetch, fetchTrigger } from '@lxjx/hooks';

function Test() {
    const { match } = props;
    const initPayload = { page: 1, id: match.id };
    const { data, loading, error, timeout, update, setParams } = 
        useFetch(getGoodsList, {
            initPayload,
            pass: !!match.id, // 只有存在match.id时才发起请求
            inputs: [match.id], // match.id改变时重新发起请求
            cacheKey: 'GOOD_LIST', // 对状态进行缓存，增强用户体验
        })
    return (
        <div>
            {/* 处理请求的各种状态，实际使用时，可以单独提出一个处理这些状态的组件来简化流程处理 */}
            {loading && 'loading...'}
            {timeout && <div>
                timeout
                <span onClick={() => update()}>retry</span>				
            </div>}
            {error && <div>
                {error.message || 'error'} 
                <span onClick={() => update()}>retry</span>				
            </div>}
            {data && JSON.stringify(data)}
            <div>
                {/* 设置setPayload并发起更新请求  */}
                <button onClick={() => {
                  res.setPayload((arg: P) => ({
                    page: arg.page + 1
                  }));
                }}>setPayload</button>
                {/* 单纯的以当前状态发起更新 */}
                <button onClick={() => {
                  update();
                }}>update</button>
            </div>
        <div>
    )
}
```

<br>

**post**

```jsx
const { data, loading, error, send } = useFetch(getGoodsList, {
    initFetch: false, // 使用post请求的关键是设置initFetch为false，使useFetch完全手动触发
    onSuccess(res, isUpdate) {
        console.log('onSuccess', res, isUpdate);
    },
    onError(err) {
        console.log('onError', err);
    },
})

function submitHandle() {
    // 发起请求
    send({
        name: 'xxx',
        age: 'xxx',
        like: ['xx1', 'xx2']
    });
}
```

<br>
<br>

## UI

### `useBreakPoint`

> 使用 react-use 的 createBreakpoint预设的一组断点，断点值参考antd 与 bootstrap

```jsx
const bp = {
  'xs': 0, // xs的命中范围为0 - 575, 后面的断点以此类推
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200,
  'xxl': 1600,
}

const Demo = () => {
  const bp = useBreakpoint();

  if (bp.xl) return <div> XL </div>;
  else if (bp.lg) return <div> LoL</div>;
  else if (bp.sm) return <div> Sexyy</div>;
  else return <div> xs</div>;
};
```

<br>
<br>

### `useScroll`

> 获取、设置滚动条位置，支持滚动到点、滚动到元素、增值滚动

```tsx
const { get, set, scrollToElement, ref } = 
      useScroll<HTMLDivElement>(option?: UseScrollOptions);
                                                     
return (
	<div ref={ref}>...</div>             
)
```



**get** - 获取滚动位置信息

```ts
function get(): UseScrollMeta;

interface UseScrollMeta {
  /** 滚动元素 */
  el: HTMLElement;
  /** x轴位置 */
  x: number;
  /** y轴位置 */
  y: number;
  /** 可接受的x轴滚动最大值 */
  xMax: number;
  /** 可接受的y轴滚动最大值 */
  yMax: number;
  /** 元素高度 */
  height: number;
  /** 元素宽度 */
  width: number;
  /** 元素总高度 */
  scrollHeight: number;
  /** 元素总宽度 */
  scrollWidth: number;
  /** 滚动条位于最底部 */
  touchBottom: boolean;
  /** 滚动条位于最右侧 */
  touchRight: boolean;
  /** 滚动条位于最顶部 */
  touchTop: boolean;
  /** 滚动条位于最左侧 */
  touchLeft: boolean;
}
```



**set** - 设置滚动条位置

```ts
function set(options: UseScrollSetArg);

interface UseScrollSetArg {
  /** 指定滚动的x轴 */
  x?: number;
  /** 指定滚动的y轴 */
  y?: number;
  /** 以当前滚动位置为基础进行增减滚动 */
  raise?: boolean;
  /** 为true时阻止动画 */
  immediate?: boolean;
}
```



**scrollToElement** - 滚动到指定元素

```ts
// selector - 滚动到以该选择器命中的第一个元素
function scrollToElement(selector: string): void;
// element - 滚动到指定元素
function scrollToElement(element: HTMLElement): void;
```



**ref** - 默认使用`document.documentElement`作为滚动元素，可以通过这个属性自行指定滚动元素

```tsx
const { set, ref } = useScroll<HTMLDivElement>();

return (
	<div ref={ref}>...</div>
)
```



**option** - 其他选项

```ts
useScroll(option?: UseScrollOptions)

interface UseScrollOptions {
  /** 直接以指定dom作为滚动元素，优先级高于default，低于ref */
  el?: HTMLElement;
  /** 对外派发滚动时间 */
  onScroll?(meta: UseScrollMeta): void;
  /** 100 | 配置了onScroll时，设置throttle时间, 单位(ms) */
  throttleTime?: number;
  /** 0 | 滚动偏移值, 使用scrollToElement时，会根据此值进行修正 */
  offset?: number;
  /** y轴的偏移距离，优先级高于offset */
  offsetX?: number;
  /** x轴的偏移距离，优先级高于offset */
  offsetY?: number;
}
```



### `useLockBodyScroll`

> 基于react-use的useLockBodyScroll，隐藏时会对body滚动条所占位置进行修正，防止页面抖动

```js
const [bool, set] = useToggle(false);

useLockBodyScroll(bool);
```

💡 函数签名与react-use完全相同



<br>
<br>

## Router

### `useQuery`

> 于便捷的获取或设置react-router v5的query string

使用场景：

1. 需要获取query对象时
2. 需要将state同步到url用于分享时

```ts
// location.search = '?name=lxj';
const { search, queryObject, set, coverSet } = useQuery<{ 
    name: string; 
    age: string;
}>();

log(search); // ?name=lxj

log(queryObject); // { name: 'lxj' }

// 设置查询值
set({ name: 'jxl', age: '18' }) // ?name=jxl&age=18

// 只设置某个值
set({ name: 'lxj'}) // ?name=lxj&age=18

// 覆盖掉其它所有查询并设置a
coverSet({ name: 'a' }); // ?name=a
```

<br>
<br>

## other

### `useCustomEvent`

> 为组件绑定一个自定义事件，可以在组件外的任何地方触发它

```ts
import { useCustomEvent, customEventEmit } from '@lxjx/hooks';

// component1
useCustomEvent('event1', (payload) => {
    console.log(payload); // { param1: 'xxxx' }
});

// other component
const emit = useCustomEvent(); // emit === customEventEmit

emit('event1', { param1: 'xxxx' });
```

<br>
<br>

## awesome hooks
[react-use](https://github.com/streamich/react-use) React Hooks — 👍

[@umijs/hooks](https://hooks.umijs.org/zh-cn) React Hooks Libraryts