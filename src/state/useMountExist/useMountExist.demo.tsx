import React, { useState } from 'react';
import { useMountExist } from './useMountExist';

const box = {
  width: 160,
  height: 160,
  border: '1px solid red',
};

const UseMountExistDemo = () => {
  const [toggle, set] = useState(false);

  const [mount] = useMountExist({
    toggle,
    // 只在初次为true时渲染
    mountOnEnter: true,
    // 关闭时移除
    unmountOnExit: true,
  });

  return (
    <div>
      <div>
        <button onClick={() => set(prev => !prev)}>
          开关 | {toggle.toString()}
        </button>
      </div>

      <hr />

      {mount && (
        <div style={{ ...box, border: '1px solid green' }}>
          设置了MountExist状态的盒子
        </div>
      )}
      <div style={box}>未设置MountExist状态的盒子</div>
    </div>
  );
};

export default UseMountExistDemo;
