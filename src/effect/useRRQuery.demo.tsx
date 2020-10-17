import React from 'react';
import { useRRQuery } from './useRRQuery';

const useRRQueryDemo = () => {
  const qs = useRRQuery({
    like: 'game',
  });

  console.log(qs);

  return (
    <div>
      <div>useRRQueryDemo</div>
      <button onClick={() => qs.set({ name: `lxj${Math.random()}` })}>
        set name
      </button>
      <button onClick={() => qs.set({ id: Math.random() })}>set id</button>
      <button onClick={() => qs.coverSet({ name: `lxj${Math.random()}` })}>
        coverSet
      </button>
    </div>
  );
};

export default useRRQueryDemo;
