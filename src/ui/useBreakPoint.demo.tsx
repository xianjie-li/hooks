import React from 'react';
import { useBreakPoint } from './useBreakPoint';

const useBreakPointDemo = () => {
  const bp = useBreakPoint();

  console.log(bp);

  return (
    <div>
      <div>useBreakPoint</div>
      <div>{JSON.stringify(bp)}</div>
    </div>
  );
};

export default useBreakPointDemo;
