import { useEffect, useRef } from 'react';
import { usePrevious } from 'react-use';
import _isEqualWith from 'lodash/isEqualWith';
import { IsEqualCustomizer } from 'lodash';

/**
 *  支持对deps进行深度对比的`useEffect`
 *  💡保持deps值结构相对简单能够减少对比深度，从而提高性能
 *  @param effect - 同useEffect参数1
 *  @param deps - 依赖数组，用法与useEffect一致，但是会对dep项执行深对比
 *  @param customizer - 可以通过此函数自定义对比方式, 如果相等返回 true，否则返回 false, 返回undefined时使用默认对比方式
 * */
export function useEffectEqual(
  effect: React.EffectCallback,
  deps?: any[],
  customizer?: IsEqualCustomizer
) {
  const prev = usePrevious(deps);
  const dep = useRef(0);

  const isEqual = _isEqualWith(deps, prev, customizer);

  if (!isEqual) {
    dep.current++;
  }

  useEffect(effect, [dep.current]);
}
