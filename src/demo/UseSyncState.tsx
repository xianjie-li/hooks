import React from 'react';

import { useSyncState } from '../index';

const UseSyncState = () => {
  const [syncState, setSyncState] = useSyncState({
    name: 'lxj',
    age: 18,
  });

  return (
    <div>
      <div>UseSyncState</div>
      <button onClick={ () => {
        setSyncState({
          age: Math.round(Math.random() * 18),
        });
        console.log(syncState.age); // 设置值后立即获取
      } }>click
      </button>
      <div>{ JSON.stringify(syncState) }</div>
    </div>
  );
};

export default UseSyncState;
