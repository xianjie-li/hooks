import { useEffect, useRef } from 'react';

import { AnyFn } from './util';

interface Event {
  [key: string]: {
    handle: AnyFn;
    flag: number;
  }[];
}

const eventStore: Event = {};

/**
 * 触发一个自定义事件
 * eventKey: 事件名
 * payload: 参数
 * */
export function customEventEmit(eventKey: string, payload?: any) {
  const events = eventStore[eventKey];
  if (!events || !Array.isArray(events)) return;
  if (events.length === 0) return;
  events.forEach(event => {
    event.handle(payload);
  });
}

/**
 * 绑定一个自定义事件，可以在任意组件任意位置触发它, 每个事件可以多次绑定不同的处理函数
 * eventKey? - 事件名
 * handle? - 事件处理程序
 * inputs? - 依赖数组，默认会在每一次更新时替换handle，当handle中不依赖或部分依赖其他状态时，可通过此项指定(!不要通过inputs传入未memo的引用对象!)
 * */
export function useCustomEvent(eventKey?: string, handle?: AnyFn, inputs?: any[]) {
  const flag = useRef(Math.random()); // 防止重复添加
  const key = eventKey;

  useEffect(() => {
    if (key && handle) {
      if (!Array.isArray(eventStore[key])) {
        eventStore[key] = [];
      }

      const existInd = eventStore[key].findIndex(item => item.flag === flag.current);

      const nowEvent = {
        handle,
        flag: flag.current,
      };

      // 事件存在时覆盖原有事件
      if (existInd !== -1) {
        eventStore[key][existInd] = nowEvent;
      } else {
        eventStore[key].push(nowEvent);
      }
    }

    // 移除事件
    return () => {
      const events = eventStore[key!];
      if (!key || !handle || !events) return;
      if (events.length === 0) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const index = events.findIndex(item => item.flag === flag.current);
      eventStore[key].splice(index, 1);
    };
    // eslint-disable-next-line
  }, inputs || [handle, key]);

  return customEventEmit;
}
