import { useEffect, useMemo, useRef } from 'react';

import { isNumber, isDom } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import { useThrottle } from '../effect/useThrottle';
import { useSpring } from 'react-spring';

interface UseScrollOptions {
  /** 直接以指定dom作为滚动元素，优先级高于default，低于ref */
  el?: HTMLElement;
  /** 滚动时触发 */
  onScroll?(meta: UseScrollMeta): void;
  /** 100 | 配置了onScroll时，设置throttle时间, 单位(ms) */
  throttleTime?: number;
  /** 0 | 滚动偏移值, 使用scrollToElement时，会根据此值进行修正 */
  offset?: number;
  /** y轴的偏移距离，优先级高于offset */
  offsetX?: number;
  /** x轴的偏移距离，优先级高于offset */
  offsetY?: number;
  /** 0 | touch系列属性的触发修正值 */
  touchOffset?: number;
}

interface UseScrollSetArg {
  /** 指定滚动的x轴 */
  x?: number;
  /** 指定滚动的y轴 */
  y?: number;
  /** 以当前滚动位置为基础进行增减滚动 */
  raise?: boolean;
  /** 为true时阻止动画 */
  immediate?: boolean;
}

interface UseScrollMeta {
  /** 滚动元素 */
  el: HTMLElement;
  /** x轴位置 */
  x: number;
  /** y轴位置 */
  y: number;
  /** 可接受的x轴滚动最大值 */
  xMax: number;
  /** 可接受的y轴滚动最大值 */
  yMax: number;
  /** 元素高度 */
  height: number;
  /** 元素宽度 */
  width: number;
  /** 元素总高度 */
  scrollHeight: number;
  /** 元素总宽度 */
  scrollWidth: number;
  /** 滚动条位于最底部 */
  touchBottom: boolean;
  /** 滚动条位于最右侧 */
  touchRight: boolean;
  /** 滚动条位于最顶部 */
  touchTop: boolean;
  /** 滚动条位于最左侧 */
  touchLeft: boolean;
}

interface UseScrollPosBase {
  x?: number;
  y?: number;
}

const docBody = document.body;

export function useScroll<ElType extends HTMLElement>(
  {
    el,
    onScroll,
    throttleTime = 100,
    offset = 0,
    offsetX,
    offsetY,
    touchOffset = 0,
  } = {} as UseScrollOptions
) {
  const defaultEl = useMemo(() => {
    return el || document.documentElement;
  }, [el]);

  const ref = useRef<ElType>(null);

  // @ts-ignore 坑2： 8.x版本的[,,stop]stop无效, 不能监听滚动后停止定位动画
  const [, setY] = useSpring<{ y: number; x: number }>(() => ({
    y: 0,
    x: 0,
    config: { clamp: true },
    reset: true,
  }));

  const scrollHandle = useThrottle(() => {
    onScroll && onScroll(get());
  }, throttleTime);

  useEffect(() => {
    const sEl = getEl();

    /* 坑: 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上 */
    const scrollEl = elIsDoc() ? window : sEl;

    scrollEl.addEventListener('scroll', scrollHandle);
    return () => {
      scrollEl.removeEventListener('scroll', scrollHandle);
    };
    // eslint-disable-next-line
  }, [onScroll]);

  function elIsDoc() {
    const sEl = getEl();
    return sEl instanceof HTMLHtmlElement;
  }

  /** 从默认值、参数中取到滚动元素 */
  function getEl() {
    return ref.current || defaultEl;
  }

  function animateTo(
    sEl: HTMLElement,
    next: UseScrollPosBase,
    now: UseScrollPosBase
  ) {
    const isDoc = elIsDoc();

    setY({
      ...next,
      from: now,
      // @ts-ignore 类型错误？
      onFrame(props) {
        sEl.scrollTop = props.y;
        sEl.scrollLeft = props.x;
        // 修复document.body和document.documentElement取值设值在不同浏览器不一致的问题
        if (isDoc) {
          docBody.scrollTop = props.y;
          docBody.scrollLeft = props.x;
        }
      },
    });
  }

  /** 根据传入的x、y值设置滚动位置 */
  function set({ x, y, raise, immediate }: UseScrollSetArg) {
    const scroller = getEl();
    const { xMax, yMax, x: oldX, y: oldY } = get();

    const nextPos: UseScrollPosBase = {};
    const nowPos: UseScrollPosBase = {
      x: oldX,
      y: oldY,
    };

    if (isNumber(x)) {
      let nextX = x;

      if (raise) {
        nextX = _clamp(oldX + x, 0, xMax);
      }

      if (nextX !== oldX) {
        nextPos.x = nextX;
      }
    }

    if (isNumber(y)) {
      let nextY = y;

      if (raise) {
        nextY = _clamp(oldY + y, 0, yMax);
      }

      if (nextY !== oldY) {
        nextPos.y = nextY;
      }
    }

    if ('x' in nextPos || 'y' in nextPos) {
      const isDoc = elIsDoc();
      if (immediate) {
        if (isNumber(nextPos.x)) {
          scroller.scrollLeft = nextPos.x;
          // 修复document.body和document.documentElement取值设值在不同浏览器不一致的问题
          if (isDoc) {
            docBody.scrollLeft = nextPos.x;
          }
        }
        if (isNumber(nextPos.y)) {
          scroller.scrollTop = nextPos.y;
          // 修复document.body和document.documentElement取值设值在不同浏览器不一致的问题
          if (isDoc) {
            docBody.scrollTop = nextPos.y;
          }
        }
      } else {
        animateTo(scroller, nextPos, nowPos);
      }
    }
  }

  /**
   * 传入选择器或者dom元素
   * @param selector | target
   *    selector - 滚动到以该选择器命中的第一个元素
   *    element - 滚动到指定元素
   * @param immediate - 是否跳过动画
   * */
  function scrollToElement(selector: string, immediate?: boolean): void;
  function scrollToElement(element: HTMLElement, immediate?: boolean): void;
  function scrollToElement(arg: string | HTMLElement, immediate?: boolean) {
    const sEl = getEl();
    let targetEl: HTMLElement | null;

    if (!sEl.getBoundingClientRect) {
      console.warn('The browser does not support `getBoundingClientRect` API');
      return;
    }

    if (typeof arg === 'string') {
      targetEl = getEl().querySelector(arg);
    } else {
      targetEl = arg;
    }

    if (!isDom(targetEl)) return;
    const { top: cTop, left: cLeft } = targetEl.getBoundingClientRect();
    const { top: fTop, left: fLeft } = sEl.getBoundingClientRect();

    /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */
    const xOffset = offsetX || offset;
    const yOffset = offsetY || offset;

    set({
      x: cLeft - fLeft + xOffset,
      y: cTop - fTop + yOffset,
      raise: !(sEl instanceof HTMLHtmlElement), // 如果滚动节点为html元素, 可以直接取计算结果
      immediate,
    });
  }

  /** 获取各种有用的滚动信息 */
  function get(): UseScrollMeta {
    const isDoc = elIsDoc();

    const sEl = getEl();
    const x = isDoc ? sEl.scrollLeft + docBody.scrollLeft : sEl.scrollLeft;
    const y = isDoc ? sEl.scrollTop + docBody.scrollTop : sEl.scrollTop;
    const height = sEl.clientHeight;
    const width = sEl.clientWidth;
    const scrollHeight = sEl.scrollHeight;
    const scrollWidth = sEl.scrollWidth;
    const xMax = scrollWidth - width;
    const yMax = scrollHeight - height;

    return {
      el: sEl,
      x,
      y,
      xMax,
      yMax,
      height,
      width,
      scrollHeight,
      scrollWidth,
      touchBottom: yMax - y - touchOffset <= 0,
      touchLeft: x <= touchOffset,
      touchRight: xMax - x - touchOffset <= 0, // 总宽度 - 宽度 = 滚动条实际宽度
      touchTop: y <= touchOffset,
    };
  }

  return {
    set,
    get,
    scrollToElement,
    ref,
  };
}
