---
title: useQueue
---

# useQueue

管理一组队列状态

<!-- TODO：添加一些用例连接 -->

## 示例

<code src="./useQueue.demo.tsx" />

## API

**useQueue()**

```ts
function useQueue<Item extends AnyObject = {}>(conf: UseQueueConfig): {
  /**
   * 推入一个新项，如果当前没有选中项，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  push(item | item[]),
  /** 显示上一项 */
  prev(),
  /**
   * 关闭当前项, 然后选中列表下一项
   * 如果配置了duration, 设置倒计时，计时结束后拉取下一项进行显示, 直到队列为空
   * */
  next(),
  /** 是否有下一项, 不传id查当前项 */
  hasNext(id),
  /** 是否有上一项, 不传id查当前项 */
  hasPrev(id),
  /** 清空队列 */
  clear,
  /** 根据id查询索引 */
  findIndexById(id),
  /** 是否处于暂停状态 */
  isPause: state.isPause,
  /** 当前项 */
  current: state.current,
  /** 暂停时，重新启用 */
  start(),
  /** 暂停，停止所有计时，依然可以通过push/next/prev等切换项，如果要禁止切换，使用isPause帮助判断 */
  pause(),
  /** 当前所有项(不要手动操作) */
  list,
  /** 当前项所在索引 */
  index,
};
```

**配置**

```ts
interface UseQueueConfig<ItemOption> {
  /** 初始列表 */
  list?: (ItemOption & UseQueueItem)[];
  /** 默认项配置 */
  defaultItemOption?: Partial<ItemOption & UseQueueItem>;
}
```

**基础选项**

```ts
interface UseQueueItem {
  /** 如果传入，会在指定延迟ms后自动跳转到下一条 */
  duration?: number;
}
```