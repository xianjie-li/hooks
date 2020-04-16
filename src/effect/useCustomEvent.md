---
title: useCustomEvent
---

# useCustomEvent

自定义事件，用于多个组件间进行通讯和传值，当你的项目没有引入`redux`等状态管理方案，但又需要跨多组件进行通讯时会非常很有用。

## 示例

<code src="./useCustomEvent.demo.tsx" />

## API

```ts
const emit = useCustomEvent(eventKey?: string, handle?: AnyFunction);
```

**emit** - 触发一个自定义事件

该方法是`import { customEventEmit } from '@lxjx/hooks'`的直接引用

`function customEventEmit(eventKey: string, payload?: any): void`

**eventKey** - 事件名称

**handle** - 事件处理函数，参数为`emit`时传入的值
