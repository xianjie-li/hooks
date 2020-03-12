import React, { useState } from 'react';

import { useDerivedStateFromProps } from '../effect/useDerivedStateFromProps';


function Demo({ num }: { num: number }) {
  const [insideNum, setInsideNum] = useDerivedStateFromProps(num);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>基本类型 - </h3>
      <div>原始prop: {num}</div>
      <div>派生state: {insideNum}</div>
      <button onClick={() => setInsideNum(Math.random)}>改变派生状态</button>
    </div>
  )
}

function Demo2({ obj }: { obj: { [key: string]: any } }) {
  const [insideObj, setInsideObj] = useDerivedStateFromProps(obj);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>引用类型 - </h3>
      <div>原始prop: {JSON.stringify(obj, null, 4)}</div>
      <div>派生state: {JSON.stringify(insideObj, null, 4)}</div>
      <button onClick={() => setInsideObj({ id: 1008 })}>改变派生状态</button>
    </div>
  )
}

const UseSame = () => {
  const [number, setNumber] = useState(5);
  const [obj, setObj] = useState({ id: 2008 });

  return (
    <div>
      <button onClick={() => setNumber(Math.random)}>改变prop</button>
      <div><Demo num={number} /></div>

      <button onClick={() => setObj({ id: 2008 })}>改变prop</button>
      <button onClick={() => setObj({ id: 1008 })}>相同形状的引用对象</button>
      <div><Demo2 obj={obj} /></div>
    </div>
  );
};

export default UseSame;
