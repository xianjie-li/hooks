<h1 align="center" style="color: #61dafb;">hooks</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">📌</h1>
<p align="center">Use Your Imagination</p>
<br>
<br>
[TOC]
<br>
<br>

<!-- TOC -->

- [state](#state)
  - [`useSelf`](#useself)
  - [`useSyncState`](#usesyncstate)
  - [`useSetState`](#usesetstate)
  - [`useFormState`](#useformstate)
  - [`useIsInitMount`](#useisinitmount)
  - [`useSessionState`](#usesessionstate)
  - [`useSessionSetState`](#usesessionsetstate)
  - [`useSessionSetState`](#usesessionsetstate)
- [effect](#effect)
- [lifecycles](#lifecycles)
- [fetch](#fetch)
  - [`useFetch`](#usefetch)
- [UI](#ui)
  - [`useBreakPoint`](#usebreakpoint)
- [Router](#router)
  - [`useQuery`](#usequery)
- [other](#other)
  - [`useCustomEvent`](#usecustomevent)
- [awesome hooks](#awesome-hooks)

<!-- /TOC -->

## .1. state

### .1.1. `useSelf`

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

### .1.2. `useSyncState`

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

### .1.3. `useSetState`

> 与类组件的this.setState用法类似，不支持更新完成的回调

`const [state, setState, setOverState] = useSetState(init?);`

需要额外说明的是setOverState，它会使用传入的state覆盖当前的state而不是合并，与useState的set表现一致

<br>

<br>

### .1.4. `useFormState`

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

### .1.5. `useIsInitMount`

> 当组件是初次mount时，返回true

`const isInitMount = useIsInitMount()`

<br>

<br>

### .1.6. `useSessionState`

> 与useState表现一致，但是它会将state缓存到Session中，页面刷新或组件重载时使用缓存值作为初始值

```ts
const [value, setValue] = useSessionState('cache-key', 123);
```



^ 当需要在组件外更新缓存值时，可以使用额外的工具函数(该方法也可用于useSessionSetState)

```ts
import {
  setSessionState,
  getSessionState,
} from '@lxjx/hooks';

setSessionState('cache-key', 345);
getSessionState('cache-key');
```



### .1.7. `useSessionSetState`

> 同useSessionState，但是其维护一个对象，与useSetState用法一致



<br>

<br>

### .1.8. `useSessionSetState`

<br>

<br>

## .2. effect

> no data

<br>

<br>

## .3. lifecycles



## .4. fetch

### .4.1. `useFetch`

> 非常符合hooks风格的API请求方式

`const bonus = useFetch(requestMethod, initPayload?, options?);`

**requestMethod**: 

一个Promise返回函数或async函数, 用于请求异步数据，该函数的执行结果决定了bonus的结果。



**initPayload**:

初始化载荷



**bonus**：

| key                | desc                                                         | default  |
| ------------------ | ------------------------------------------------------------ | -------- |
| **data**           | 当requestMethod resolve后，data 会被赋值给resolve的值        | undefind |
| **loading**        | `boolean`  正在请求                                          | false    |
| **error**          | 当requestMethod reject后，error 会被赋值给reject的值         | undefind |
| **timeout**        | `boolean` 是否超时, false                                    | false    |
| **payload**        | `object`  当前用于请求的payload                              | {}       |
| **setPayload**     | 设置payload并重新触发请求，api与this.setState相似            |          |
| **setOverPayload** | 覆盖设置payload并重新触发请求                                |          |
| **setData**        | 手动设置data，api与this.setState相似                         |          |
| **update**         | 使用当前的payload重新发起一次请求                            |          |
| **extraData**      | data之外的另一个数据源                                       |          |
| **setExtraData**   | 设置extraData，api与this.setState相似                        |          |
| **send**           | 使用传入的payload覆盖当前payload并发起请求. 如果参数为空则与update等效 |          |



**options:**

| option         | desc                                                         | default |
| -------------- | ------------------------------------------------------------ | ------- |
| **pass**       | `boolan | function` 当它为true时才会发起请求.如果是一个函数，取函数返回值，当该函数抛出错误时，取false | true    |
| **inputs**     | `any[]`,  类似useEffect(fn, de)，当它的内部元素发生改变时会重新进行请求， 确保运行时长度不会发生改变，传入引用类型的数据前先memo | []      |
| **extraData**  | `object`, 初始化extraData                                    | {}      |
| **timeout**    | `number`,  超时时间(ms)                                      | 8000    |
| **onSuccess**  | (res: Data, isUpdate: boolean) => void,  成功回调，当该次请求是通过update ()或inputs更变触发时，第二个参数为true |         |
| **onError**    | (err: any) => void, 错误回调                                 |         |
| **onComplete** | 请求结束回调                                                 |         |
| **onTimeout**  | 超时回调                                                     |         |



fetch data

```jsx
// 创建requestMethod, 可以使用任何你喜欢的请求库
function getGoodsList(params) {
    return new Promise((resolve, reject) => {
        fetch(params)
          .then((res) => resolve(res.json()))
          .catch((err) => reject(err));
    })
}

import { useFetch, fetchTrigger, useCustomEvent, customEventEmit } from '@lxjx/hooks';

function Test() {
    const { match } = props;
    const defaultParam =  page: 1, id: match.id };
    const { data, loading, error, timeout, update, setParams } = 
        useFetch(getGoodsList, defaultParam, {
            pass: !!match.id, // 只有存在match.id时发起请求
            inputs: [match.id], // match.
        })
    
    // 当需要在组件外发更新请求时，可以通过自定义事件
    useCustomEvent('update', () => {
    	res.update();
  	}, []);

    return (
        <div>
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
                {/* 设置setPayload并发起请求  */}
                <button onClick={() => {
                  res.setPayload((arg: P) => ({
                    page: arg.page + 1
                  }));
                }}>setPayload</button>
                {/* 更新 */}
                <button onClick={() => {
                  update();
                }}>update</button>
            </div>
        <div>
    )
}
            
//  update fetch anywhere via cutstom event
customEventEmit('update');
```

<br>

post

```jsx
const { data, loading, error, send } = useFetch(getGoodsList, {}, {
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

## .5. UI

### .5.1. `useBreakPoint`

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

## .6. Router

### .6.1. `useQuery`

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

## .7. other

### .7.1. `useCustomEvent`

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

## .8. awesome hooks
[react-use](https://github.com/streamich/react-use) React Hooks — 👍

[@umijs/hooks](https://hooks.umijs.org/zh-cn) React Hooks Libraryts