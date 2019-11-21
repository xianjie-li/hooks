import { useState } from 'react';
import { useSelf } from './useSelf';

/**
 * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
 * 1. 在setState之后，可以立即通过`state.xx`获取新的值
 * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
 * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
 * */
export function useSyncState<T extends object>(init = {} as T) {
  const [count, update] = useState(0);
  const self = useSelf<T>(init);

  function setSelf(patch: Partial<T> | ((prevState: T) => Partial<T>)): void {
    if (typeof patch === 'function') {
      setHandle(patch(self));
    } else {
      setHandle(patch);
    }
  }

  function setHandle<Y>(patch: Y) {
    // 编译设置新值
    for (const [key, value] of Object.entries(patch)) {
      (self as any)[key] = value;
    }
    // 触发更新
    update(prev => prev + 1);
  }

  return [self, setSelf] as const;
}
