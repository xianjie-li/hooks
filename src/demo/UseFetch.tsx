import React from 'react';

import { useFetch, useCustomEvent, customEventEmit } from '../index';

function mock<D>(success: boolean, data: D, ms = 1800) {
  return (arg: any) => {
    console.log(123, ms);
    return new Promise<D>((resolve, reject) => {
      setTimeout(() => {
        success ? resolve(data) : reject(new Error('发生错误了!!!'));
      }, ms);
    });
  };
}

const UseFetch = () => {
  type P = {
    page: number;
    sort: number;
  }

  type D = {
    name: string;
    age: number;
  }

  const [dep, setDep] = React.useState(0);
  const [name, setName] = React.useState('lxj');

  // useFetch(
  //   mock(true, { name: 'lxj', age: Math.random() }, 1500),
  //   // @ts-ignore
  //   // mock(false, { code: 110, msg: '发生错误啦！' }),
  //   {
  //     inputs: [dep],
  //   },
  // );

  const res = useFetch(
    mock(true, { name: 'lxj', age: Math.random() }, 1000),
    // @ts-ignore
    // mock(false, { code: 110, msg: '发生错误啦！' }),
    {
      pass: true,
      inputs: [dep],
      cacheKey: 'test1',
      isPost: true,
      // initData: ({ name: 'xxx' }),
      search: '?name=' + name,
      initPayload: { page: 1, sort: 5 },
      initExtraData: {
        meta: 123,
      },
      // pollingInterval: 2000,
      onSuccess(result, isUpdate) {
        // console.log('onSuccess', result, isUpdate);
      },
      onError(err) {
        console.log('onError', err);
      },
      onComplete() {
        console.log('onComplete');
      },
      onTimeout() {
        console.log('onTimeout');
      },
    },
  );

  console.log(res);

  useCustomEvent('update', () => {
    res.update();
  }, []);

  return (
    <div>
      <div>loading: {res.loading ? 'loading...' : 'false'}</div>
      <div>timeout: {res.timeout ? 'timeout' : 'false'}</div>
      <div>error: {JSON.stringify(res.error)}</div>
      <div>data: {JSON.stringify(res.data)}</div>
      <div>payload: {JSON.stringify(res.payload)}</div>
      <div>extraData: {JSON.stringify(res.extraData)}</div>
      <div>search: {res.search}</div>

      <div>method:</div>
      <div>
        <button
          type="button"
          onClick={() => {
            res.setPayload((arg: P) => ({
              page: arg.page + 1,
            }));
          }}
        >setPayload
        </button>
        <button
          type="button"
          onClick={() => {
            setName(Math.random().toFixed(5));
          }}
        >setSearch
        </button>
        <button
          type="button"
          onClick={() => {
            res.update();
          }}
        >update
        </button>
        <button
          type="button"
          onClick={() => {
            res.send({
              page: Math.random(),
            // sort: 4321432,
            });
          }}
        >send
        </button>
        <button
          type="button"
          onClick={() => {
            res.setData({
              name: 'lxj',
              age: Math.floor(Math.random() * 18),
            });
          }}
        >setData
        </button>
        <button
          type="button"
          onClick={() => {
            res.setExtraData({
              meta: Math.random(),
            });
          }}
        >setExtraData
        </button>
        <button
          type="button"
          onClick={() => {
            setDep(prev => prev + 1);
          }}
        >dep change
        </button>
        <button
          type="button"
          onClick={() => {
            customEventEmit('update');
          }}
        >trigger
        </button>
      </div>
    </div>
  );
};

export default UseFetch;
