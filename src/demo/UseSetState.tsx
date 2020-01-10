import React from 'react';

import { useSetState } from '../index';

const UseSetState = () => {
  const [state, setState, set] = useSetState({
    name: 'lxj',
    age: 18,
  });

  return (
    <div>
      <div>UseSyncState</div>
      <button onClick={() => {
        setState({
          age: Math.round(Math.random() * 18),
        });
        // set({
        //   name: 'lxj',
        // });
      }}
      >click
      </button>
      <div>{ JSON.stringify(state) }</div>
    </div>
  );
};

export default UseSetState;
