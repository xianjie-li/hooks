import { useState, useCallback } from 'react';
import { SetState, StateInitState } from '../type';
import { AnyObject } from '@lxjx/utils';

/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 * */
export const useSetState = <T extends AnyObject>(
  initState = {} as StateInitState<T>
): [T, SetState<T>] => {
  const [, update] = useState(0);
  const [state, set] = useState<T>(initState);
  const setState = useCallback(
    patch => {
      // 关键是使用Object.assign保证引用不变
      set(
        Object.assign(state, patch instanceof Function ? patch(state) : patch)
      );
      // 引用相同useState是不会更新的，需要手动触发更新
      update(prev => prev + 1);
    },
    [set]
  );

  return [state, setState];
};
