import React from 'react';
import { useBreakPoint } from '../useBreakPoint';

const UseBreakPoint = () => {
  const bp = useBreakPoint();

  return (
    <div>
      {JSON.stringify(bp)}
    </div>
  );
};

export default UseBreakPoint;