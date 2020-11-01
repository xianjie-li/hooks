---
title: useMountExist
---

# useMountExist

便捷的提供`mountOnEnter`、`unmountOnExit`状态。(用于控制元素渲染时机以提高性能)


## 示例

<code src="./useMountExist.demo.tsx" />

## API

**`useMountExist(UseMountExistOption): [mount]`**

```ts

interface UseMountExistBase {
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 是否在关闭时卸载内容 */
  unmountOnExit?: boolean;
}

interface UseMountExistOption extends UseMountExistBase {
  /** 当前显示状态 */
  toggle: boolean;
  /**
   * 延迟设置非mount状态, 单位ms,
   * - 用于在内容包含动画时，在动画结束后再卸载内容
   * - 此值不用必须精准匹配动画时间，只要大于动画时间即可
   * */
  exitDelay?: number;
}
```
