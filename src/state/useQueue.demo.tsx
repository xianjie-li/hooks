import React from 'react';
import { useQueue } from './useQueue';

let count = 0;

const UseQueueDemo = () => {
  const queue = useQueue<{ text: string }>();

  return (
    <div style={{ lineHeight: 2 }}>
      {queue.list.map(item => (
        <div
          key={item.id}
          style={{
            textAlign: 'center',
            padding: '6px 12px',
            border: item === queue.current ? '1px solid red' : '1px solid #ccc',
            margin: 12,
            width: 120,
          }}
        >
          {item.text}
        </div>
      ))}

      <div style={{ marginTop: 50 }}>
        <button
          onClick={() =>
            queue.push({
              text: `这是第${++count}条消息`,
              duration: 2000,
            })
          }
        >
          push
        </button>
        <button disabled={queue.index === 0} onClick={queue.prev}>
          prev
        </button>
        <button disabled={!queue.hasNext()} onClick={queue.next}>
          next
        </button>
        <button onClick={queue.clear}>clear</button>
        <button onClick={queue.pause}>
          pause
        </button>
        <button disabled={!queue.isPause} onClick={queue.start}>start</button>
      </div>
    </div>
  );
};

export default UseQueueDemo;
