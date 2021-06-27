import { RefObject, useEffect, useMemo, useRef } from 'react';
import { isFunction } from '@lxjx/utils';
import {
  createEvent,
  getRefDomOrDom,
  useFn,
  useScroll,
  UseScrollMeta,
  useSelf,
  useSetState,
} from '@lxjx/hooks';
import _debounce from 'lodash/debounce';

export interface UseVirtualListOption<Item> {
  /** 需要进行虚拟滚动的列表 */
  list: Item[];
  /** 每项的尺寸 */
  size: number | ((item: Item, index: number) => number);
  /** 滚动区域两侧预渲染的节点数 */
  overscan?: number;
  /**
   * 项的唯一key, 建议始终明确的指定key, 除非:
   * - 列表永远不会排序或更改
   * - 不需要使用keepAlive等高级特性
   * */
  key?: (item: Item, index: number) => string;
  /** 返回true的项将始终被渲染 */
  keepAlive?: (item: Item, index: number) => boolean;
  /** 预留空间, 需要插入其他节点到列表上/下方时传入此项，值为插入内容的总高度 */
  space?: number;
  /** 当有一个已存在的ref或html时，用来代替containerRef获取滚动容器 */
  containerTarget?: HTMLElement | RefObject<HTMLElement>;
  /** 当有一个已存在的ref或html时，用来代替wrapRef获取包裹容器 */
  wrapRef?: HTMLElement | RefObject<HTMLElement>;
}

export type VirtualList<Item> = {
  /** 该项索引 */
  index: number;
  /** 该项的key, 如果未配置key(), 则等于index */
  key: string;
  /** 该项的数据 */
  data: Item;
  /** 应该应位于的位置 */
  position: number;
  /** 改项的尺寸 */
  size: number;
}[];

interface State<Item> {
  /** 虚拟列表 */
  list: VirtualList<Item>;
  /** 是否处于滚动状态中 */
  scrolling: boolean;
}

interface RenderProps<Item> {
  children: (state: State<Item>) => JSX.Element | any;
}

export function useVirtualList<Item = any>(option: UseVirtualListOption<Item>) {
  const { list, size, overscan = 5, key, space = 0, keepAlive, containerTarget } = option;

  const wrapRef = useRef<any>(null!);

  // 统一通知Render更新状态
  const updateEvent = useMemo(() => createEvent<(state: Partial<State<Item>>) => void>(), []);

  const self = useSelf({
    scrolling: false,
  });

  const [fmtList, height] = useMemo(() => {
    let h = 0;

    const ls: VirtualList<Item> = list.map((item, index) => {
      const _size = getSize(item, index);
      h += _size;

      return {
        data: item,
        index,
        key: getKey(item, index),
        position: h,
        size: _size,
      };
    });

    return [ls, h] as const;
  }, [list]);

  const scroller = useScroll<any>({
    el: containerTarget,
    throttleTime: 0,
    onScroll: handleScroll,
  });

  /** 使用render组件来减少hook对消费组件的频繁更新 */
  const Render = useMemo(
    () => ({ children }: RenderProps<Item>) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [state, setState] = useSetState<State<Item>>({
        list: [],
        scrolling: false,
      });

      updateEvent.useEvent(setState);

      return children(state);
    },
    [],
  );

  useEffect(() => {
    if (!getRefDomOrDom(option.wrapRef, wrapRef) || !scroller.ref.current) {
      throw Error('useVirtualList(...) -> wrap or container is not gets');
    }
  }, []);

  useEffect(() => {
    handleScroll(scroller.get());
    scroller.ref.current && (scroller.ref.current.style.overflowY = 'auto');
  }, []);

  // 通知滚动结束
  const emitScrolling = useFn(
    () => {
      self.scrolling = false;
      updateEvent.emit({
        scrolling: false,
      });
    },
    fn => _debounce(fn, 100),
  );

  /** 核心混动逻辑 */
  function handleScroll(meta: UseScrollMeta) {
    // 通知滚动开始
    if (!self.scrolling) {
      self.scrolling = true;
      updateEvent.emit({
        scrolling: true,
      });
    }

    emitScrolling();

    // keep列表需要实时计算
    let keepAliveList: VirtualList<Item> = [];
    const wrapEl = getRefDomOrDom(option.wrapRef, wrapRef);

    if (!wrapEl || !meta.el) return;

    if (keepAlive) {
      keepAliveList = fmtList.filter((item, index) => keepAlive(item.data, index));
    }

    // 开始索引
    let start = 0;

    // 计算开始索引
    for (let i = 0; i < fmtList.length; i++) {
      const position = fmtList[i].position;

      start = i;
      if (position > meta.y) break;
    }

    // 计算结束索引
    let contHeight = 0;
    let end = start;

    for (let i = 0; i < fmtList.length; i++) {
      if (contHeight > meta.el.offsetHeight || end >= fmtList.length) break;

      contHeight += fmtList[end].size;
      end += 1;
    }

    if (overscan) {
      const [nextStart, nextEnd] = getOverscanSize(start, end);
      start = nextStart;
      end = nextEnd;
    }

    const nextList: VirtualList<Item> = fmtList.slice(start, end);

    if (keepAliveList.length) {
      keepAliveList.forEach(item => {
        const has = nextList.find(it => it.key === item.key);

        if (!has) {
          if (item.index < start) nextList.unshift(item);
          else nextList.push(item);
        }
      });
    }

    // 顶部偏移
    let top = 0;

    for (let i = 0; i < start; i++) {
      top += fmtList[i].size;
    }

    const h = `${height - top + space}px`;
    const t = `${top}px`;

    // 设置wrap样式
    if (wrapEl.style.cssText !== undefined) {
      wrapEl.style.cssText = `margin-top: ${t};height: ${h};`;
    } else {
      wrapEl.style.marginTop = t;
      wrapEl.style.height = h;
    }

    updateEvent.emit({ list: nextList });
  }

  /** 将开始和结束索引根据overscan进行修正，参数3会返回顶部应减少的偏移 */
  function getOverscanSize(start: number, end: number) {
    const nextStart = Math.max(start - overscan, 0);

    const nextEnd = Math.min(
      /* 索引为0时不添加 */
      end + overscan /* slice是尾闭合的，所以要多取一位 */,
      fmtList.length,
    );

    return [nextStart, nextEnd] as const;
  }

  function getSize(item: Item, index: number) {
    if (!isFunction(size)) return size;
    return size(item, index);
  }

  function getKey(item: Item, index: number) {
    if (!isFunction(key)) return String(index);
    return key(item, index);
  }

  return {
    containerRef: scroller.ref,
    wrapRef,
    Render,
  };
}