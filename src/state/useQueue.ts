import { AnyObject, createRandString, isArray, isNumber } from '@lxjx/utils';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { useUpdate } from 'react-use';
import { useEffect } from 'react';

interface UseQueueConfig<ItemOption> {
  /** 初始列表 */
  list?: (ItemOption & UseQueueItem)[];
  /** 默认项配置 */
  defaultItemOption?: Partial<ItemOption & UseQueueItem>;
}

interface UseQueueItem {
  /** 如果传入，会在指定延迟ms后自动跳转到下一条 */
  duration?: number;
}

interface UseQueueItemWithId extends UseQueueItem {
  /** 唯一id，由组件内部生成 */
  id: string;
}


/*
 * TODO: 如果有应用场景的话，添加按索引控制选中
 * */
function useQueue<Item extends AnyObject = {}>(
  { defaultItemOption, list = [] } = {} as UseQueueConfig<Item>,
) {
  /** 选项与用户扩展类型混合 */
  type MixItem = Item & UseQueueItemWithId;
  type MixItemWithoutId = Item & UseQueueItem;

  const self = useSelf({
    /** 消息队列 */
    list: [] as MixItem[],
    /** 历史记录 */
    oldList: [] as MixItem[],
    /** 开启下一条的计时器 */
    timer: null as any,
    /** 设置计时器的时间 */
    timerSetTime: null as number | null,
    /** 暂停的时间 */
    pauseTime: null as number | null,
  });

  const [state, setState] = useSetState({
    /** 当前显示消息 */
    current: null as MixItem | null,
    /** 是否暂停 */
    isPause: false,
  });

  const update = useUpdate();

  // 清理
  useEffect(() => clearTimer, []);

  /**
   * next()的实现版本，支持参数
   * */
  const nextIn = useFn((isPrev?: boolean) => {
    // if (state.isPause) return;

    clearTimer();

    const nextCurrent = self.list[0] || null;

    // 将当前项添加到历史
    if (!isPrev && state.current) {
      self.oldList.push(state.current);
    }

    if (!nextCurrent) {
      setState({
        current: null,
      });
      return;
    }

    // 移除新项
    self.list.splice(0, 1);

    // self.oldList.push(...del);

    setState({
      current: nextCurrent,
    });

    // 未暂停且配置了持续时间, 定时切换到下一条
    if (isNumber(nextCurrent.duration) && !state.isPause) {
      self.timer = setTimeout(nextIn, nextCurrent.duration);
      self.timerSetTime = Date.now();
    }

    // 如果切换过，暂停时间就没意义了，将其清除
    self.pauseTime = null;
  });

  /**
   * 关闭当前项, 然后选中列表下一项
   * 如果配置了duration, 设置倒计时，计时结束后拉取下一项进行显示, 直到队列为空
   * */
  const next = useFn(() => nextIn() /* 过滤参数 */);

  /**
   * 显示上一项
   * */
  const prev = useFn(() => {
    // if (state.isPause) return;

    const lastOldInd = self.oldList.length - 1; // 最后一条是当前消息

    const old = self.oldList.splice(lastOldInd, 1);

    if (!old.length) return;

    // 当前消息和上一条消息重新放回队列

    state.current && self.list.unshift(state.current);

    self.list.unshift(...old);

    nextIn(true);
  });

  /**
   * 推入一个新项，如果当前没有选中项，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  const push = useFn((opt: MixItemWithoutId | MixItemWithoutId[]) => {
    if (isArray(opt)) {
      const ls = opt.map(item => ({ ...defaultItemOption, ...item, id: createRandString() }));
      self.list.push(...ls);
    } else {
      self.list.push({ ...defaultItemOption, ...opt, id: createRandString() });
    }

    state.current ? update() : next();
  });

  // 启动初始list
  useEffect(() => {
    if (list.length) {
      push(list);
    }
  }, []);

  /**
   * 清空队列
   * */
  const clear = useFn(() => {
    self.list = [];
    self.oldList = [];
    self.timer = null;
    self.timerSetTime = null;
    self.pauseTime = null;
    clearTimer();
    setState({
      current: null,
      isPause: false,
    });
  });

  /**
   * 暂停，停止所有计时，依然可以通过push/next/prev等切换项，如果要禁止切换，使用isPause帮助判断
   * */
  const pause = useFn(() => {
    if (state.isPause) return;

    setState({
      isPause: true,
    });

    clearTimeout(self.timer);

    self.pauseTime = Date.now();
  });

  /**
   * 暂停时，重新启用
   * */
  const start = useFn(() => {
    if (!state.isPause) return;

    const c = state.current;

    setState({
      isPause: false,
    });

    // 如果当前有选中项，且包含计时器, 根据打断时间重新设置计时器
    if (c) {
      clearTimeout(self.timer);

      // 包含必要参数，还原暂停时间
      if (self.pauseTime && self.timerSetTime) {
        const spend = self.pauseTime - self.timerSetTime;

        if (isNumber(c.duration) && isNumber(spend)) {
          self.timer = setTimeout(next, c.duration - spend);
        }

        // 使用默认时间
      } else if (isNumber(c.duration)) {
        self.timer = setTimeout(next, c.duration);
      }
    } else {
      // 没有消息时重新启用队列
      next();
    }

    self.pauseTime = null;
  });

  /**
   * 指定id是否包含下一项, 不传id查当前项
   * */
  function hasNext(id?: string) {
    let _id = id;

    if (!_id && !state.current) return false;

    if (!_id) {
      _id = state.current?.id;
    }

    const all = getAllList();
    const ind = findIndexById(_id!);
    return !!all[ind + 1];
  }

  /**
   * 指定id是否包含上一项, 不传id查当前项
   * */
  function hasPrev(id?: string) {
    let _id = id;

    if (!_id && !state.current) return false;

    if (!_id) {
      _id = state.current?.id;
    }

    const all = getAllList();
    const ind = findIndexById(_id!);
    return !!all[ind - 1];
  }

  /**
   * 指定id在列表中的索引
   * */
  function findIndexById(id: string) {
    const all = getAllList();
    return all.findIndex(item => item.id === id);
  }

  /**
   * 获取所有列表和当前项组成的数组, 历史和当前列表
   * */
  function getAllList() {
    const ls: MixItem[] = [];
    ls.push(...self.oldList);

    if (state.current) {
      ls.push(state.current);
    }

    ls.push(...self.list);

    return ls;
  }

  function clearTimer() {
    if (self.timer) {
      clearTimeout(self.timer);
      self.timerSetTime = null;
    }
  }

  return {
    push,
    prev,
    next,
    hasNext,
    hasPrev,
    clear,
    findIndexById,
    isPause: state.isPause,
    current: state.current,
    start,
    pause,
    list: getAllList(),
    index: state.current ? findIndexById(state.current.id) : null,
  };
}

export {
  useQueue,
  UseQueueConfig, 
  UseQueueItem, 
  UseQueueItemWithId,
}