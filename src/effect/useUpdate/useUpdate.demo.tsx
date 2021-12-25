import React from 'react';
import { useUpdate } from '@lxjx/hooks';

const UseUpdateDemo = () => {
  const update = useUpdate();

  return (
    <div>
      <button onClick={update}>re render</button>
      <div>{Date.now()}</div>
    </div>
  );
};

export default UseUpdateDemo;
