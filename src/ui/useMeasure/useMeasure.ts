import { RefObject, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash/debounce';
import { getRefDomOrDom, useFn, useIsUnmountState } from '@lxjx/hooks';

/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */
export function useMeasure<T extends Element = HTMLElement>(
  target?: HTMLElement | RefObject<HTMLElement>,
  debounceDelay?: number,
) {
  const ref = useRef<T>(null!);

  const isUnmount = useIsUnmountState();

  const [bounds, set] = useState<Omit<DOMRectReadOnly, 'toJSON'>>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
  });

  const cb: ResizeObserverCallback = useFn(
    ([entry]) => {
      !isUnmount() && set(entry.contentRect);
    },
    fn => {
      if (debounceDelay) {
        return debounce(fn, debounceDelay);
      }
      return fn;
    },
    [debounceDelay],
  );

  const [ro] = useState(() => new ResizeObserver(cb));

  function getEl() {
    const el = getRefDomOrDom(target);
    if (el) return el;
    return ref.current;
  }

  useEffect(() => {
    const el = getEl();

    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [bounds as DOMRectReadOnly, ref] as const;
}
