import React from 'react';

import { useSessionSetState } from '../useSessionSetState';

const UseSessionSetState = () => {
  const [state, setSate] = useSessionSetState('test2', {
    name: 'lxj',
    age: 17,
  });

  return (
    <div>
      {JSON.stringify(state, null, 4)}
      <div>UseSessionSetState</div>
      <button
        type="button"
        onClick={() => setSate(prev => ({
          name: 'lxj' + Math.random(),
          age: prev.age - 1,
        }))}
      >fn
      </button>
      <button
        type="button"
        onClick={() => setSate({
          name: 'lxj',
          age: 18,
        })}
      >set
      </button>
    </div>
  );
};

export default UseSessionSetState;
