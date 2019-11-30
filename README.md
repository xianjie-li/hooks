<h1 align="center" style="color: #61dafb;">hooks</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">📌</h1>


<p align="center">Use Your Imagination</p>

<br>
<br>
<!-- TOC -->

- [state](#state)
  - [`useSelf`](#useself)
  - [`useSyncState`](#usesyncstate)
  - [`useSetState`](#usesetstate)
  - [`useFormState`](#useformstate)
  - [`useIsInitMount`](#useisinitmount)
- [`effect`](#effect)
- [fetch](#fetch)
  - [`useFetch`](#usefetch)
- [UI](#ui)
  - [`useBreakPoint`](#usebreakpoint)
  - [`lifecycles`](#lifecycles)
- [other](#other)
  - [`useCustomEvent`](#usecustomevent)
- [awesome hooks](#awesome-hooks)

<!-- /TOC -->
<br>
<br>

## state

### `useSelf`

> 函数组件的 "this"

`const self = useSelf(init?)`

init: object, 默认为 {}

```js
const self = useSelf({
    name: 'lxj',
    age: 18
});

useEffect(() => {
    self.name = self.name.split('').reverse().join('');
    // get changes now
    console.log(self.name);
}, []);
```

<br>

<br>

### `useSyncState`

> 使用this.setState的useSelf, 与self的另一个区别是，变更可以同步到视图。

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
    // 由于它类似实例的特性，变更后的state可以马上获取到
    console.log(syncState.name);
}, []);

useEffect(() => {
    // 即使deps为[]获取到的状态也是实时的
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

> 实现类型this.setState的api

`const [state, setState, setOverState] = useSetState(init?);`

需要额外说明的是setOverState，它会使用传入的state覆盖当前的state而不是合并

<br>

<br>

### `useFormState`

用于便捷的实现受控/非受控组件。

`const [state, setState] = useFormState(props, defaultValue?)`

* 如果组件接收value，组件的状态在value更改时实时同步
* 如果接收defaultValue，则将状态转为内部管理, 并在state改变时通过onChange进行通知
* setState调用时，如果有defaultValue直接在内部设置状态，如果有value则不会更新内部状态而是使用onChange对调用组件进行通知, onChange会在每次setState时调用，无论它是什么类型的表单



<br>

<br>

### `useIsInitMount`

> 当组件是初次mount时，返回true

`const isInitMount = useIsInitMount()`

<br>

<br>

## `effect`

> no data

<br>

<br>

## fetch

### `useFetch`

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

## UI

### `useBreakPoint`

> 使用 react-use 的 createBreakpoint预设的一组断点，与bootstrap的断点配置相同

```jsx
const bp = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200,
}

const Demo = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === "xl") return <div> XL </div>;
  else if (breakpoint == "lg") return <div> LoL</div>;
  else if (breakpoint == "sm") return <div> Sexyy</div>;
  else return <div> Wth</div>;
};
```

<br>
<br>

### `lifecycles`

> no data

<br>
<br>

## other

### `useCustomEvent`

> 为组件绑定一个自定义事件，可以在任何地方触发它

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

[@umijs/hooks](https://hooks.umijs.org/zh-cn) React Hooks Library