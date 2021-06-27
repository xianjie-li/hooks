import { useEffect, useMemo, useRef } from 'react';
import { createRandString, getScrollBarWidth } from '@lxjx/utils';

let scrollPosition = 0; // 保存锁定时的滚动位置

const list: any = [];

/**
 * 锁定滚动条并对滚动条宽度进行修正
 * @param locked - 根据传入值对滚动条进行锁定/解锁
 * */
export const useLockBodyScroll = (locked: boolean) => {
  const id = useMemo(() => createRandString(), []);

  const instance = useRef({
    bodyEl: null! as HTMLElement,
    scrollBarWidth: 0,
  });

  useEffect(() => {
    instance.current.bodyEl = document.body;
    instance.current.scrollBarWidth = getScrollBarWidth();
  }, []);

  // 存取list
  useEffect(() => {
    if (locked) {
      list.push(id);
      if (list.length === 1) lock();
    }
    return () => {
      if (!locked) return;
      const ind = list.indexOf(id);
      if (ind !== -1) list.splice(ind, 1);
      if (!list.length) unlock();
    };
  }, [locked]);

  function lock() {
    const bodyEl = instance.current.bodyEl;
    const scrollBarWidth = instance.current.scrollBarWidth;

    bodyEl.setAttribute('data-locked', '1');
    scrollPosition = window.pageYOffset;
    bodyEl.style.width = `calc(100% - ${scrollBarWidth}px)`;
    bodyEl.style.overflow = 'hidden';
    bodyEl.style.position = 'fixed';
    bodyEl.style.top = `-${scrollPosition}px`;
  }

  function unlock() {
    const bodyEl = instance.current.bodyEl;

    bodyEl.setAttribute('data-locked', '0');
    bodyEl.style.width = '';
    bodyEl.style.overflow = '';
    bodyEl.style.position = '';
    bodyEl.style.top = '';
    window.scrollTo(0, scrollPosition);
  }
};
