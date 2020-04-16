---
title: useBreakPoint
---

# useBreakPoint

基于[@umijs/hooks use-responsive](https://hooks.umijs.org/hooks/dom/use-responsive), 通过内置的一组断点来获取响应式信息

## 示例

<code src="./useBreakPoint.demo.tsx" />

## API

`const bp = useBreakPoint()`

**bp**

```ts
{
  "xs": boolean;
  "sm": boolean;
  "md": boolean;
  "lg": boolean;
  "xl": boolean;
  "xxl": boolean;
}
```
