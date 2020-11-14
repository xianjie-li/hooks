---
title: useMeasure
---

# useMeasure

通过ResizeObserver api监听元素尺寸位置改变

## 示例

<code src="./useMeasure.demo.tsx" />

## API

```tsx | pure
const [ref, bounds] = 
  useMeasure<ElType>(target?: HTMLElement | RefObject<HTMLElement>);
```

* `ref` - 用于绑定到带侦听节点的ref
* `bounds` - 元素的位置、尺寸信息
* `ElType` - ref指向元素的类型
* `target` - 一个dom元素或指向dom元素的ref对象
