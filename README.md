<h1 align="center" style="color: #61dafb;">hooks</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">📌</h1>

<p align="center">一些不与react-use功能重叠的hooks</p>

<p align="center">some hooks that don't overlap with the react use function</p>



> Use Your Imagination



## state

### `useSelf`

> function component of 'this'

`const self = useSelf(init = {})`

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

`const [state, setState] = useSyncState(initState = {})`

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





## effect



## fetch

### `useFetch`

> Hooks style data fetch

`const bonus = useFetch(requestMethod, defaultParams?, pass?, options?);`

**bonus**：

  	**data** - when requestMethod resolve，data is the resolve value
 	 **loading** - boolean, when fetching. `mutually exclusive`
 	 **error** -  when requestMethod reject，data is the reject value. `mutually exclusive`
  	**timeout** - boolean, when timeout. `mutually exclusive`
 	 **params**: - object, current params
	  **setParams** - set params and fetch again, api like class component setState()
	  **setData** - manually set data, api like class component setState()
 	 **update** - trigger fetch with current params
	  **extraData**: - extra state，save data other than data。
  	**setExtraData** - set extraData,  api like class component setState()

**options:**

​	  **inputs**? -  any[],  // like effect(fn, inputs)，when inputs item change，update fetch, ensure that the length does not change, reference type need memo before.
 	 **extraData**? - object = {}, init extraData
​	  **key**? - string,  used to globally trigger updates via fetchTrigger()
  	**timeout**? - number = 8000, 超时时间(ms)
  	**onSuccess**? -  (res: Data, isUpdate: boolean) => void, success callback, second parameter is true when the request is triggered for update () or fetchTrigger(key)
  	**onError**? - (err: any) => void, error callback
  	**onComplete**? - fetch finish callback. note that when an old request is overwritten by a new request, it is not triggered
 	 **onTimeout**? - timeout callback.



```jsx
// declare request function
function getGoodsList(params) {
    return new Promise((resolve, reject) => {
        xx(params)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    })
}

import { useFetch, fetchTrigger } from '@lxjx/hooks';

function Test() {
    const { match } = props;
    const defaultParam =  page: 1, id: match.id };
    const { data, loading, error, timeout, update, setParams } = 
        useFetch(getGoodsList, defaultParam, !!match.id, {
            inputs: [match.id], // refetch when match.id change
            key: 'GOODS_LIST',
        })

    return (
        <div>
            {loading && 'loading...'}
            {timeout && 'timeout'}
            {error && (error.message || 'error')}
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
            
//  update fetch anywhere via key
fetchTrigger('GOODS_LIST');
   
//  update with params
fetchTrigger('GOODS_LIST', ({ page }) => ({ page: page + 1 }));
```





## lifecycles

