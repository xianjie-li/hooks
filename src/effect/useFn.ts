import { useCallback, useRef, useMemo } from 'react';
import { AnyFunction } from '@lxjx/utils';

/**
 * 用于代替useCallback，使回调函数的引用地址永久不变, 从而减少回调消费组件不必要的更新。
 * 该hook的另一个用例是解决闭包导致的回调内外状态不一致问题，并且它不需要传递`deps`参数!
 * @param fn - 需要进行处理的回调函数
 * @param wraper - 接收参数1并返回，可以藉此对函数实现节流等操作, 只在初始化时调用
 * @returns - 永远指向同一个地址的回调
 */
export function useFn<T extends AnyFunction>(fn: T, wraper?: (fn: T) => T) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering');
  });

  ref.current = fn;

  /* ??? 可以添加第三个参数deps，在变更时更新willMemoFn */
  const willMemoFn = useMemo(() => {
    const mFn = (...args: any) => ref.current(...args);
    return wraper ? wraper(mFn as T) : mFn;
  }, []);

  const memoFn = useCallback(willMemoFn, [ref]);

  return memoFn as T;
}
