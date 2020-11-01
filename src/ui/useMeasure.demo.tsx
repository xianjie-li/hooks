import React, { useState } from 'react';
import { useMeasure } from './useMeasure';

const size1 = {
  width: 160,
  height: 160,
};

const size2 = {
  width: 200,
  height: 200,
};

const UseMeasureDemo = () => {
  const [sty, setS] = useState<any>(size1);

  const [ref, bound] = useMeasure<HTMLDivElement>();

  return (
    <div>
      <button onClick={() => setS(size1)}>size1</button>
      <button onClick={() => setS(size2)}>size2</button>

      <hr />

      <div>{JSON.stringify(bound)}</div>

      <hr />

      <div ref={ref} style={{ border: '1px solid red', ...sty }} />
    </div>
  );
};

export default UseMeasureDemo;
