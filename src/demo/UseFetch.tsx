import React from 'react';

import { useFetch, useCustomEvent, customEventEmit } from '../index';

function mock<D>(success: boolean, data: D, ms = 1800) {
  return (arg: any) => {
    // console.log('arg:::', arg);
    return new Promise<D>((resolve, reject) => {
      setTimeout(() => {
        success ? resolve(data) : reject(data);
      }, ms);
    })
  }
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

  const res = useFetch<P, D, any>(
    mock(true, { name: 'lxj', age: 18 }, 1500),
    // @ts-ignore
    // mock(false, { code: 110, msg: '发生错误啦！' }),
    { page: 1, sort: 5 },
    {
      pass: true,
      // initFetch: false,
      inputs: [dep],
      extraData: {
        meta: 123
      },
      onSuccess(res, isUpdate) {
        console.log('onSuccess', res, isUpdate);
      },
      onError(err) {
        console.log('onError', err);
      },
      onComplete() {
        console.log('onComplete');
      },
      onTimeout() {
        console.log('onTimeout');
      }
    }
  );

  useCustomEvent('update', () => {
    res.update();
  }, []);

  console.log(res);

  return (
    <div>
      <div>loading: {res.loading ? 'loading...' : 'false'}</div>
      <div>timeout: {res.timeout ? 'timeout' : 'false'}</div>
      <div>error: {JSON.stringify(res.error)}</div>
      <div>data: {JSON.stringify(res.data)}</div>
      <div>payload: {JSON.stringify(res.payload)}</div>
      <div>extraData: {JSON.stringify(res.extraData)}</div>

      <div>method:</div>
      <div>
        <button onClick={() => {
          res.setPayload((arg: P) => ({
            page: arg.page + 1
          }));
        }}>setPayload</button>
        <button onClick={() => {
          res.update();
        }}>update</button>
        <button onClick={() => {
          res.send({
            page: 123123,
            // sort: 4321432,
          });
        }}>send</button>
        <button onClick={() => {
          res.setData({
            name: 'lxj',
            age: Math.floor(Math.random() * 18),
          });
        }}>setData</button>
        <button onClick={() => {
          res.setExtraData({
            phone: Math.random(),
            address: 'china',
          });
        }}>setExtraData</button>
        <button onClick={() => {
          setDep(prev => prev + 1);
        }}>dep change</button>
        <button onClick={() => {
          customEventEmit('update');
        }}>trigger</button>
      </div>
    </div>
  );
};

export default UseFetch;
