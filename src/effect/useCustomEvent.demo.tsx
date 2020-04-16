import React, { useState } from 'react';
import { useCustomEvent } from './useCustomEvent';

function D1() {
  const [count, setCount] = useState(0);

  useCustomEvent('my-event-1', () => {
    console.log('my-event-1 trigger', count); // 能够引用到最新的值
  });

  // 同一事件能绑定多个处理器
  useCustomEvent('my-event-1', () => {
    console.log('my-event-1 trigger2', count); // 能够引用到最新的值
  });

  return (
    <div>
      <h3>useCustomEvent {count}</h3>
      <button onClick={() => setCount(p => p + 1)}>change count</button>
    </div>
  );
}

const useCustomEventDemo = () => {
  const emit = useCustomEvent(); // 也可以使用 import { customEventEmit } from '@lxjx/hooks';

  return (
    <div>
      <D1></D1>
      <button onClick={() => emit('my-event-1')}>trigger my-event-1</button>
    </div>
  );
};

export default useCustomEventDemo;
