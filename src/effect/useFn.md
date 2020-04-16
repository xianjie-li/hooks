---
title: useFn
order: 0
---

# useFn
用于代替`React.useCallback`，使回调函数的引用地址永久不变，从而防止消费组件不必要的重新渲染。

该hook的另一个用例是解决闭包导致的回调内外状态不一致问题，并且它不需要传递`deps`参数!

## 示例

<code src="./useFn.demo.tsx" />

## API
```ts
const memoFn = useFn(fn)
```

**memoFn** - 经过`memo`的`fn`，内存地址永久不变

**fn** - 需要`memo`化的回调

**wraper** - 接收参数1并返回，可以藉此对函数实现节流等操作, 只在初始化时调用