import React, { useState } from 'react';
import { useVirtualList, VirtualList } from '@lxjx/hooks';

import sty from './style.module.css';

const list = Array.from({ length: 300000 }).map((it, ind) => ind);

function Item(item: VirtualList<number>[0]) {
  const [count, setCount] = useState(0);

  return (
    <div
      onClick={() => setCount(prev => prev + 1)}
      className={sty.item}
      style={{
        height: item.size,
        backgroundColor: item.index % 2 === 0 ? '#f8f8f0' : undefined,
      }}
    >
      Row: {item.data} - {item.index} - {count} size: large
    </div>
  );
}

const useVirtualListDemo = () => {
  const virtual = useVirtualList({
    list,
    // size: (i, ind) => (ind % 2 === 0 ? 150 : 50),
    keepAlive: item => item === 2 || item === 6 || item === 299999,
    size: 50,
    // space: 100,
  });

  return (
    <div className={sty.container} ref={virtual.containerRef}>
      <div className={sty.wrap} ref={virtual.wrapRef}>
        {/*<div style={{ border: '1px solid blue', height: 50 }} />*/}
        {virtual.list.map(item => (
          <Item {...item} key={item.key} />
        ))}
        {/*<div style={{ border: '1px solid blue', height: 50 }} />*/}
      </div>
    </div>
  );
};

export default useVirtualListDemo;
