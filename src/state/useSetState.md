---
title: useSetState
order: 2
---

# useSetState
提供与类组件setState类似的API

## 示例
<code src="./useSetState.demo.tsx" />

## API
`const [state, setState] = useSetState(initState)`

**state** - `{}` | state对象，每次rerender都返回的是同一个对象引用，可以借此来解决使用hooks时常见的闭包问题

**setState** - 更改state的唯一方式
```ts
interface SetState<T> {
  (patch: Partial<T> | ((prevState: T) => Partial<T>)): void;
}
```

**initState** - 初始state
```ts
type SetStateInitState<T> = (() => T) | T;
```
