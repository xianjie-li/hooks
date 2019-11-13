import React from 'react';

import { useFetch } from '../index';

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

  const res = useFetch<P, D, any>(
    mock(true, { name: 'lxj', age: 18 }),
    // @ts-ignore
    // mock(false, { code: 110, msg: '发生错误啦！' }),
    { page: 1, sort: 5 },
    true,
  );

  console.log(res);

  return (
    <div>
      <div>loading: {res.loading ? 'loading...' : 'false'}</div>
      <div>timeout: {res.timeout ? 'timeout' : 'false'}</div>
      <div>error: {JSON.stringify(res.error)}</div>
      <div>data: {JSON.stringify(res.data)}</div>
      <div>params: {JSON.stringify(res.params)}</div>
      <div>extraData: {JSON.stringify(res.extraData)}</div>

      <div>method:</div>
      <div>
        <button onClick={() => {
          res.setParams((arg: P) => ({
            page: arg.page + 1
          }));
        }}>setParams</button>
        <button onClick={() => {
          res.update();
        }}>update</button>
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
      </div>
    </div>
  );
};

export default UseFetch;
