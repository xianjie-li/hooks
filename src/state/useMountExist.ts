import { useState, useRef, useEffect } from 'react';
import { isNumber } from '@lxjx/utils';

export interface UseMountExistBase {
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 是否在关闭时卸载内容 */
  unmountOnExit?: boolean;
}

export interface UseMountExistOption extends UseMountExistBase {
  /** 当前显示状态 */
  toggle: boolean;
  /**
   * 延迟设置非mount状态, 单位ms,
   * - 用于在内容包含动画时，在动画结束后在卸载内容
   * - 此值不用必须精准匹配动画时间，只要大于动画时间即可
   * */
  exitDelay?: number;
}

/**
 * 用于便捷的实现mountOnEnter、unmountOnExit接口
 * */
export function useMountExist({
  toggle,
  mountOnEnter = true,
  unmountOnExit,
  exitDelay,
}: UseMountExistOption) {
  const [mount, set] = useState(() => {
    // mountOnEnter为false时，强制渲染, 否则取init
    if (!mountOnEnter) return true;
    return toggle;
  });

  const timer = useRef<any>();

  useEffect(() => {
    timer.current && clearTimeout(timer.current);

    if (toggle && mountOnEnter) {
      !mount && set(true);
    }

    if (!toggle && unmountOnExit) {
      if (mount) {
        if (isNumber(exitDelay)) {
          timer.current = setTimeout(() => {
            set(false);
          }, exitDelay);
        } else {
          set(false);
        }
      }
    }
  }, [toggle]);

  return [mount] as const;
}
