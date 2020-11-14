import { useFn } from '@lxjx/hooks';
import { useEffect } from 'react';
import { AnyFunction } from '@lxjx/utils';

/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */
export function createEvent<Listener extends AnyFunction = AnyFunction>() {
  const listeners: Listener[] = [];

  const useEvent = (listener: Listener) => {
    const memoHandle = useFn(listener);

    useEffect(() => {
      on(memoHandle);

      return () => off(memoHandle);
    }, []);
  };

  function on(listener: Listener) {
    listeners.push(listener);
  }

  function off(listener: Listener) {
    const ind = listeners.indexOf(listener);
    if (ind !== -1) listeners.splice(ind, 1);
  }

  function emit(...args: any) {
    listeners.forEach(listener => listener(...args));
  }

  return {
    /** 以hook的形式注册一个事件监听器，会在unmount时自动解绑事件 */
    useEvent,
    /** 注册一个事件监听器 */
    on,
    /** 解绑指定的事件监听器 */
    off,
    /** 触发所有正在监听的事件 */
    emit,
  };
}
