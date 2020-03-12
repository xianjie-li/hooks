import React, { useEffect, useState } from 'react';

const style: React.CSSProperties = {
  position: 'relative',
  height: 3000,
  // width: 3000,
  border: '1px solid #ccc',
  padding: '200px 0',
};

const style2: React.CSSProperties = {
  height: 400,
  border: '1px solid red',
  overflow: 'auto',
  padding: 40,
};


import { useScroll } from '../useScroll';

const UseScroll = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(prev => prev + 1);
    }, 3000);
  }, []);

  const { set, get, scrollToElement, ref } = useScroll<HTMLDivElement>({
    onScroll(meta) {
      console.log(count, meta);
    },
  });

  return (
    <div style={style}>
      UseScroll
      <button
        type="button"
        onClick={() => {
          set({
            x: 200,
            y: 200,
            raise: true,
            immediate: true,
          });
        }}
      >set
      </button>
      <button
        type="button"
        onClick={() => {
          console.log(get());
        }}
      >get
      </button>
      <button
        type="button"
        onClick={() => {
          scrollToElement('#p-5');
        }}
      >scrollToElement
      </button>

      <div id="testWrap" style={style2}>
        {Array.from({ length: 20 }).map((item, index) => (
          <p id={`p-${index + 1}`} style={{ width: 1000, border: '1px solid #eee' }} key={index}>{index + 1}</p>
        ))}
      </div>
      <button
        style={{ position: 'absolute', bottom: 0 }}
        type="button"
        onClick={() => {
          scrollToElement('#p-5');
        }}
      >scrollToElement
      </button>
    </div>
  );
};

export default UseScroll;
