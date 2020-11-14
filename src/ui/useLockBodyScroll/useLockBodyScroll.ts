import { useEffect } from 'react';

/* 获取滚动条宽度 */
function getScrollBarWidth() {
  // Create the measurement node
  const scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);

  // Get the scrollbar width
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Delete the DIV
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

/* 是否包含y轴滚动条 */
function hasScrollBar(el: HTMLElement) {
  const docScrollH = el.scrollHeight;
  const docH = el.clientHeight;
  const docScrollW = el.scrollWidth;
  const docW = el.clientWidth;
  return docScrollH > docH || docScrollW > docW;
}
const scrollBarWidth = getScrollBarWidth();
const bodyEl = document.body;
let lockCount = 0; // 当前锁定的次数
let scrollPosition = 0; // 保存锁定时的滚动位置

/** 锁定滚动条并对滚动条宽度进行修正 */
export const useLockBodyScroll = (
  /** 根据传入值对滚动条进行锁定/解锁 */
  locked: boolean,
) => {
  useEffect(() => {
    // 是否包含滚动条
    const hasScroll = hasScrollBar(document.documentElement);
    // 是否需要进行处理 包含滚动条 + locked为true + 非初始化
    const doHandle = locked;

    if (doHandle) {
      if (lockCount === 0) {
        if (hasScroll) {
          scrollPosition = window.pageYOffset;
          bodyEl.style.width = `calc(100% - ${scrollBarWidth}px)`;
          bodyEl.style.overflow = 'hidden';
          bodyEl.style.position = 'fixed';
          bodyEl.style.top = `-${scrollPosition}px`;
          bodyEl.setAttribute('data-locked', '1');
        }
      }
      lockCount++;
    }
    return () => {
      if (doHandle) {
        lockCount--;
        if (lockCount === 0) {
          const _locked = !!bodyEl.getAttribute('data-locked');
          console.log(_locked);
          if (_locked) {
            bodyEl.style.width = '';
            bodyEl.style.overflow = '';
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            window.scrollTo(0, scrollPosition);
            bodyEl.setAttribute('data-locked', '0');
          }
        }
      }
    };
  }, [locked]);
};
