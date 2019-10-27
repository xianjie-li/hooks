import React, { useState } from 'react';

import { useSelf, useSyncState } from '../index';

const Demo1 = () => {
  const self = useSelf({
    name: 'lxj',
    age: 18,
  });

  const [state, setState] = useSyncState({
    count: 0,
  });

  return (
    <div>
      <button onClick={() => {
        self.age++;
        console.log(self);
      }}>useSelf</button>
      <button onClick={() => {
        setState(({ count }) => ({
          count: count + 1,
        }));
      }}>count {state.count}</button>
    </div>
  );
};

export default Demo1;
