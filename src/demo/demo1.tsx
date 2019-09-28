import React, { useState } from 'react';

import { useSelf, useUpdate, useLegacyState } from '../index';

const Demo1 = () => {
  const [data, setData] = useLegacyState({
    count: 123,
    name: 'lxj'
  });

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <button onClick={() => setData((prev) => ({ count: prev.count + 1 }))}>count</button>
    </div>
  );
};

export default Demo1;
