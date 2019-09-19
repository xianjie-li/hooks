import React, { useState } from 'react';

import { useSelf, useUpdate, useLegacyState } from '../index';

type Temp = {
  name: string;
}

const Demo1 = () => {
  const self = useSelf<Temp>();
  const [count, setCount] = useLegacyState({
    count: 123
  });

  useUpdate(() => {
    console.log('update');
    return () => {};
  }, [count]);

  useUpdate(() => {

  });

  React.useEffect(() => {
    self.name = 'lxj';
    console.log(self.name);
  }, []);

  return (
    <div>
      123
      <button onClick={() => setCount((prev) => ({ count: prev.count + 1 }))}>count{count.count}</button>
    </div>
  );
};

export default Demo1;
