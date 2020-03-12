import React from 'react';
import { useBreakPoint } from '../useBreakPoint';
import { HashRouter } from 'react-router-dom';

import { useQuery } from '../useQuery';

const UseBreakPoint = () => {
  const bp = useBreakPoint();
  const res = useQuery();
  console.log(res);

  return (
    <div>
      {JSON.stringify(bp)}
    </div>
  );
};

const Test = () => (
  <HashRouter>
    <UseBreakPoint />
  </HashRouter>
);

export default Test;
