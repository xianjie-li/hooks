---
title: useMeasure
group:
  path: /UI
  order: 1
---

# useMeasure

通过 ResizeObserver api 监听元素尺寸位置改变

## 示例

<code src="./useMeasure.demo.tsx" />

## API

```tsx | pure
const [ref, bounds] =
  useMeasure<ElType>(target?: HTMLElement | RefObject<HTMLElement>);
```

- `ref` - 用于绑定到带侦听节点的 ref
- `bounds` - 元素的位置、尺寸信息
- `ElType` - ref 指向元素的类型
- `target` - 一个 dom 元素或指向 dom 元素的 ref 对象
