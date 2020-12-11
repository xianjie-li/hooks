import { useEffect, useRef } from 'react';
import { getScrollBarWidth, hasScroll } from '@lxjx/utils';
import { useSameState } from '@lxjx/hooks';

let scrollPosition = 0; // 保存锁定时的滚动位置

/**
 * 锁定滚动条并对滚动条宽度进行修正
 * @param locked - 根据传入值对滚动条进行锁定/解锁
 * @return currentLocked - 当前的真实锁定状态，当在不同地方使用多个useLockBodyScroll时, 锁定状态往往会和传入值不同
 * */
export const useLockBodyScroll = (locked: boolean) => {
  const sameState = useSameState('LOCK_BODY_SCROLL', {
    enable: locked,
    deps: [locked],
  });

  const instance = useRef({
    bodyEl: null! as HTMLElement,
    scrollBarWidth: 0,
  });

  const currentLocked = hasLocked();

  useEffect(() => {
    instance.current.bodyEl = document.body;
    instance.current.scrollBarWidth = getScrollBarWidth();
  }, []);

  useEffect(() => {
    lockHandle();
    return lockHandle; // 可能是全部关闭、也可能是全部卸载，所以需要移除检测
  }, [currentLocked]);

  /** 检测是否锁定 */
  function hasLocked() {
    const lockedList = sameState[1];

    return !!lockedList.length;
  }

  /** body是否挂载了锁定标记 */
  function hasLockFlag() {
    const bodyEl = instance.current.bodyEl;
    if (!bodyEl) return;
    const flag = bodyEl.getAttribute('data-locked');
    return flag ? flag === '1' : false;
  }

  /** 锁定、解锁处理 */
  function lockHandle() {
    const bodyEl = instance.current.bodyEl;
    const scrollBarWidth = instance.current.scrollBarWidth;

    if (hasLocked()) {
      const scrollInfo = hasScroll(document.documentElement);

      // 是否包含滚动条
      const hs = scrollInfo.x || scrollInfo.y;

      if (hs && !hasLockFlag()) {
        bodyEl.setAttribute('data-locked', '1');
        scrollPosition = window.pageYOffset;
        bodyEl.style.width = `calc(100% - ${scrollBarWidth}px)`;
        bodyEl.style.overflow = 'hidden';
        bodyEl.style.position = 'fixed';
        bodyEl.style.top = `-${scrollPosition}px`;
      }
    } else {
      if (hasLockFlag()) {
        bodyEl.setAttribute('data-locked', '0');
        bodyEl.style.width = '';
        bodyEl.style.overflow = '';
        bodyEl.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, scrollPosition);
      }
    }
  }

  return currentLocked;
};
