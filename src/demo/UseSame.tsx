import React, { useState } from 'react';

import { useSame } from '../effect/useSame';

function SameComponent({ flag, show = false }: { flag: string; show: boolean }) {
  const [index, instances, id] = useSame('same_component', show, {
    flag,
  });

  return (
    <div style={{ margin: 20 }}>
      <div>该组件位于第 {index} 位</div>
      <div>组件共享参数: {JSON.stringify(instances, null, 2)}</div>
      <div>组件id: {id}</div>
    </div>
  )
}

const UseSame = () => {
  const [show1, set1] = useState(false);
  const [show2, set2] = useState(false);
  const [show3, set3] = useState(false);

  return (
    <div>
      <button onClick={() => set1(prev => !prev)}>show1 | {show1.toString()}</button>
      <button onClick={() => set2(prev => !prev)}>show2 | {show2.toString()}</button>
      <button onClick={() => set3(prev => !prev)}>show3 | {show3.toString()}</button>

      <SameComponent flag="我是第一个组件" show={show1} />
      <SameComponent flag="我是第二个组件" show={show2} />
      <SameComponent flag="我是第三个组件" show={show3} />
    </div>
  );
};

export default UseSame;
