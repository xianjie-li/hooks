import { AnyFn, getGlobal } from './util';
import { useCallback, useRef } from 'react';

export interface UseThrottleOption {
  /** true | 指定调用在节流开始前 */
  leading?: boolean;
  /** true | 指定调用在节流结束后 */
  trailing?: boolean;
}

export function useThrottle<T extends AnyFn>(
  wait = 300,
  {
    leading = true,
    trailing = true,
  } = {} as UseThrottleOption,
) {
  const self = useRef<{
    lastCall: number;
    lastMethod?: AnyFn;
    timer?: any;
  }>({
    lastCall: 0, // 约定为0时代表初次调用
    lastMethod: undefined, // 代理调用的方法是为了能在trailing时调用最后传入的函数
  });

  const caller = useCallback(function caller(method: T, ...args: Parameters<T>) {
    const ct = self.current;

    ct.lastMethod = method;
    const now = Date.now();
    const diff = now - ct.lastCall;

    if (ct.timer) {
      getGlobal().clearTimeout(ct.timer);
    }

    if (trailing) {
      ct.timer = getGlobal().setTimeout(() => {
        caller(method, ...args);
        ct.lastCall = 0; // 标记下次调用为leading调用
        getGlobal().clearTimeout(ct.timer);
      }, wait);
    }

    if (diff > wait) {
      if (leading || ct.lastCall !== 0) {
        ct.lastMethod?.(...args);
      }
      ct.lastCall = now;
    }
    // eslint-disable-next-line
  }, [wait]);

  return caller;
}
