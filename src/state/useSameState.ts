import { useEffect, useMemo, useState } from 'react';
import { createRandString, isArray } from '@lxjx/utils';
import { useUpdateEffect, useUpdate } from 'react-use';
import { useCustomEvent } from '@lxjx/hooks';

/** 单个组件实例 */
interface Item<Meta = any> {
  /** 该组件的唯一key */
  id: string;
  /** 该组件需要共享给其他组件的元信息 */
  meta: Meta;
}

interface Same {
  [key: string]: Array<Item>;
}

/** 所有共享数据 */
const sameMap: Same = {};

const defaultConfig = {
  deps: [],
  enable: true,
}

/**
 * 用于对同组件的不同实例进行管理，获取其他已渲染组件的共享数据以及当前处在启用实例中的顺序
 *
 * `常见用例有`:
 * - 获取Modal等组件的实例关系，根据组件渲染顺序设置zIndex，隐藏多余的mask等
 * - 对于Drawer等组件，根据渲染顺序调整显示的层级
 * @param key - 标识该组件的唯一key
 * @param config - 额外配置
 * @param config.meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @param config.deps - [] | 出于性能考虑，各组件共享的meta只在该实例index变更时更新，以通过此项传入依赖项数组在任意一个依赖变更后更新meta
 * @param config.enable - true | 只有在dep的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数
 * @return state - 同类型启用组件共享的状态
 * @return state[0] index - 该组件实例处于所有实例中的第几位，未启用的组件返回-1
 * @return state[1] instances - 所有启用状态的组件<Item>组成的数组，正序
 * @return state[2] id - 该组件实例的唯一标识
 * */
export function useSameState<Meta = any>(
  key: string,
  config?: {
    meta?: Meta,
    deps?: any[],
    enable?: boolean,
  }
) {
  const conf = {
    ...defaultConfig,
    ...config,
  }

  const id = useMemo(() => createRandString(2), []);
  const [cIndex, setCIndex] = useState(depChangeHandel);

  /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */
  const update = useUpdate();
  const eventKey = `${key}_same_custom_event`;

  const emitUpdate = useCustomEvent(eventKey, (_id: string) => {
    // 触发更新的实例和未激活的不更新
    if (_id === id) return;
    update();
  });

  setCurrentMeta(conf.meta);

  /* 获取当前实例在实例组中的索引或添加当前实例到实例组中，未启用组件索引返回-1 */
  function depChangeHandel() {
    const [current, index] = getCurrent();

    // 执行后续操作前，先移除已有实例
    if (index !== -1) {
      current.splice(index, 1);
    }

    // 当依赖值为true时才添加实例到组中
    if (conf.enable) {
      sameMap[key].push({
        id,
        meta: conf.meta || {},
      });
    }

    // 从更新后的实例组中获取当前索引
    const [, newIndex] = getCurrent();

    return newIndex;
  }

  /* dep改变时。更新索引信息 */
  useUpdateEffect(() => {
    setCIndex(depChangeHandel());
  }, [conf.enable]);

  /* cIndex变更时，通知其他钩子进行更新 */
  useUpdateEffect(() => {
    emitUpdate(eventKey, id);
  }, [cIndex, ...conf.deps]);

  /**
   * 获取当前组件在sameMap中的实例组和该组件在实例中的索引并确保sameMap[key]存在
   * @return meta[0] - 该组件实例组成的数组
   * @return meta[1] - 当前组件在实例中的位置
   * */
  function getCurrent() {
    // 无实例存在时赋初始值
    if (!isArray(sameMap[key])) {
      sameMap[key] = [];
    }

    // 取所在索引
    const index = sameMap[key].findIndex(item => item.id === id);

    return [sameMap[key], index] as const;
  }

  /* 设置当前实例的meta状态 */
  function setCurrentMeta(_meta?: Meta) {
    if (typeof _meta === 'undefined') return;

    const [current, index] = getCurrent();

    if (index !== -1) {
      current[index].meta = _meta;
    }
  }

  /* 在sameMap[key]长度改变时更新 */
  useEffect(() => {
    const [, newIndex] = getCurrent();
    if (newIndex !== cIndex) {
      setCIndex(newIndex);
    }
    // eslint-disable-next-line
  }, [sameMap[key]?.length]);

  return [cIndex, sameMap[key], id] as [number, Array<Item<Meta>>, string];
}
