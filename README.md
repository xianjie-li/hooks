<h1 align="center" style="color: #61dafb;">hooks</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">📌</h1>


<p align="center">Use Your Imagination</p>

<br>
<br>
<!-- TOC -->

- [state](#state)
  - [`useSelf`](#useself)
  - [`useSyncState`](#usesyncstate)
- [fetch](#fetch)
  
  - [`useFetch`](#usefetch)
  
  
- [awesome hooks](#awesome-hooks)

<!-- /TOC -->
<br>
<br>

## state

### `useSelf`

> function component of 'this'

`const self = useSelf(init?})`

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

### `useSyncState`

> like useSelf, but it can synchronize views。

`const [state, setState] = useSyncState(initState?)`

setState: `((state) => Partial<state> | Partial<state>) => void`

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
    // get changes now
    console.log(syncState.name);
}, []);

// view will be update
return (
	<div>{syncState.name}</div>
)
```

<br>

<br>

## fetch

### `useFetch`

> Hooks style data fetch

`const bonus = useFetch(requestMethod, initPayload?, options?);`

**requestMethod**: 

a Promise return function



**initPayload**:

initialize payload



**bonus**：

| key                | desc                                                         |
| ------------------ | ------------------------------------------------------------ |
| **data**           | when requestMethod resolve，data is the resolve value        |
| **loading**        | `boolean`  when fetching                                     |
| **error**          | when requestMethod reject，data is the reject value.         |
| **timeout**        | `boolean` when timeout.                                      |
| **payload**        | `object`  current payload                                    |
| **setPayload**     | set payload and fetch again, api like class component setState() |
| **setOverPayload** | set payload and fetch again. api like useState => [state, setState] |
| **setData**        | manually set data, api like class component setState()       |
| **update**         | trigger fetch with current payload                           |
| **extraData**      | extra state，save data other than data                       |
| **setExtraData**   | set extraData,  api like class component setState()          |
| **send**           | Overwrite with the specified Payload and initiate the request. If Payload is not passed, it is equivalent to update(). |



**options:**

| option          | desc                                                         |
| --------------- | ------------------------------------------------------------ |
| **pass** = true | `boolan = false,function ` fetch when it is true. When it is a function, use return value. The function internally throws an error and takes false. |
| **inputs**      | `any[] = []`,  like effect(fn, inputs)，when inputs item change，update fetch, ensure that the length does not change, reference type need memo before. |
| **extraData**   | `object = {}`, init extraData                                |
| **timeout**     | `number = 8000`, 超时时间(ms)                                |
| **onSuccess**   | (res: Data, isUpdate: boolean) => void, success callback, second parameter is true when the request is triggered for update () or inputs change |
| **onError**     | (err: any) => void, error callback                           |
| **onComplete**  | fetch finish callback. note that when an old request is overwritten by a new request, it is not triggered |
| **onTimeout**   | timeout callback.                                            |



fetch data

```jsx
// declare request function 
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
            pass: !!match.id, // request only match.id exists
            inputs: [match.id], // refetch when match.id change
            key: 'GOODS_LIST',
        })
    
    // can be updated outside of the component
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
                {/* set params and update  */}
                <button onClick={() => {
                  res.setParams((arg: P) => ({
                    page: arg.page + 1
                  }));
                }}>setParams</button>
                {/* update  */}
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
    initFetch: false,
    onSuccess(res, isUpdate) {
        console.log('onSuccess', res, isUpdate);
    },
    onError(err) {
        console.log('onError', err);
    },
})

function submitHandle() {
    send({
        name: 'xxx',
        age: 'xxx',
        like: ['xx1', 'xx2']
    });
}
```



<br>
<br>

## other

### `useCustomEvent`

> subscription or trigger a custom event

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


