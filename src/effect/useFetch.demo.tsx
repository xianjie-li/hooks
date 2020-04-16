import React, { useState } from 'react';
import { useFetch } from './useFetch';

function mockFn(delay = 1500, isSuccess = false, res?: any) {
  return function(...arg: any) {
    console.log(arg, 11);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        isSuccess ? resolve(res || delay) : reject(res || delay);
      }, delay);
    });
  };
}

const useFetchDemo = () => {
  const [count, setCount] = useState(0);

  const {
    send,
    data,
    payload,
    loading,
    error,
    timeout,
    cancel,
    arg,
  } = useFetch(mockFn(1000, true, { name: 'lxj', age: Math.random() }), {
    // deps: [count],
    // arg: count,
    initData: {},
    // manual: true,
    // stale: false,
    cacheKey: 'use_fetch_demo',
    // debounceInterval: 2000,
    // pollingInterval: 2000,
    // onSuccess(data, isUpdate) {
    //   console.log(data, isUpdate);
    // },
    // onError(err) {
    //   console.log('onError', err);
    // },
    // onComplete() {
    //   console.log('onComplete');
    // },
  });

  function sendPromise() {
    send(Math.random())
      .then(([err, res]) => console.log('resolve', [err, res]))
      .finally(() => console.log('finally'));
  }

  return (
    <div>
      <div>useFetchDemo</div>
      <button onClick={send}>send</button>
      <button onClick={() => send(Math.random())}>send by newPayload</button>
      <button onClick={() => setCount(prev => prev + 1)}>
        change deps {count}
      </button>
      <button onClick={cancel}>cancel</button>
      <button onClick={sendPromise}>sendPromise</button>
      <div>data: {JSON.stringify(data)}</div>
      <div>payload: {JSON.stringify(payload)}</div>
      <div>loading: {loading.toString()}</div>
      <div>error: {JSON.stringify(error)}</div>
      <div>timeout: {timeout.toString()}</div>
      <div>arg: {arg}</div>
    </div>
  );
};

export default useFetchDemo;
