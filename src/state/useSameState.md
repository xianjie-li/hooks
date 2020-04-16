---
title: useSameState
---

# useSameState

用于对同组件的不同实例进行管理，获取其他已渲染组件的共享数据以及当前处在启用实例中的顺序

常见用例有

- 获取 Modal 等组件的实例关系，根据组件渲染顺序设置 zIndex，隐藏多余的 mask 等
- 对于 Drawer 等组件，根据渲染顺序调整显示的层级
- 其他需要共享实例状态的组件

## 示例

<code src="./useSameState.demo.tsx" />

## API

```ts
function useSameState<Meta = any>(
  key: string,
  dep: boolean,
  meta?: Meta
): sameState;
```

```ts
key - 标识该组件的唯一 key
dep - 只有在 dep 的值为 true 时，该实例才算启用并被钩子接受, 通常为 Modal 等组件的 toggle 参数
meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
sameState[0] - 该组件实例处于所有实例中的第几位，未启用的组件返回-1
sameState[1] - 所有启用状态的组件<Item>组成的数组，正序
sameState[2] - 该组件实例的唯一标识
```
