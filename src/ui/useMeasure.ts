import { RefObject, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { getRefDomOrDom } from '../utils/utils';

export function useMeasure<T extends Element = HTMLElement>(
  target?: HTMLElement | RefObject<HTMLElement>
) {
  const ref = useRef<T>(null!);

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

  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );

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

  return [ref, bounds] as const;
}
