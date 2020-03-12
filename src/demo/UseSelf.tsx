import React from 'react';

import { useSelf } from '../index';

const UseSelfDemo = () => {
  /* 使用类型推导(常用) */
  const self = useSelf({
    name: 'lxj',
    age: 18,
  });
  /* 使用泛型声明 */
  const self2 = useSelf<{
    name: string;
    age: number;
  }>();

  React.useEffect(() => {
    // TS2322: Type '123' is not assignable to type 'string'.
    // self.name = 123;
    // TS2322: Type '123' is not assignable to type 'string'.
    // self2.name = 123;
    // success
    self.name = self.name.split('').reverse().join('');
    // 立即获取变更
    // console.log(self.name);
  }, [self.name]);

  return (
    <div>
      <div>UseSelfDemo</div>
    </div>
  );
};

export default UseSelfDemo;
