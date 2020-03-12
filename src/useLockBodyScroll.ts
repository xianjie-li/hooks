import { useEffect } from 'react';
import { useLockBodyScroll as useLibLockScroll } from 'react-use';

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

/* 是否包含滚动条 */
function hasScrollBar(el: HTMLElement) {
  const docScrollH = el.scrollHeight;
  const docH = el.offsetHeight;
  return docScrollH > docH;
}

const scrollBarWidth = getScrollBarWidth();
let lockCount = 0; // 当前锁定的数量
let firstWidth = ''; // 保留第一个锁定是的style用于还原

/** 基于react-use的useLockBodyScroll，隐藏时会对滚动条所占位置进行修正，防止页面抖动 */
export const useLockBodyScroll: typeof useLibLockScroll = (locked, elementRef) => {

  useEffect(() => {
    // 是否包含滚动条
    const hasScroll = hasScrollBar(document.documentElement);
    // 是否需要进行处理 包含滚动条 + locked为true + 非初始化
    const doHandle = hasScroll && locked;
    if (doHandle) {
      if (lockCount === 0) {
        const bodyStyleWidth = document.body.style.width;
        if (!firstWidth) {
          firstWidth = bodyStyleWidth;
        }
        document.body.style.width = `calc(${bodyStyleWidth || '100%'} - ${scrollBarWidth}px)`;
      }
      lockCount++;
    }
    return () => {
      if (doHandle) {
        lockCount--;
        if (lockCount === 0) {
          document.body.style.width = firstWidth;
          firstWidth = '';
        }
      }
    };
  }, [locked]);
  return useLibLockScroll(locked, elementRef);
};
