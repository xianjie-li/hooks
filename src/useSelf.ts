import { useRef } from 'react';

/** 返回类似类组件的this的实例属性 */
export default function useSelf<T extends object>(init = {} as T) {
  const self = useRef<T>(init);
  return self.current as T;
}
