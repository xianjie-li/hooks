---
title: useRRQuery
group:
  path: /effect
  order: 2
---

# useRRQuery

用于便捷的获取或设置 react-router 的 url query

## 示例

<code src="./useRRQuery.demo.tsx" />

## API

```ts
const result = useRRQuery<Query extends object = any>
(defaultQuery?: string | AnyObject);
```

**defaultQuery** - 默认查询, 会与 url 查询合并, 可以是查询对象或查询字符串(只在初始化时读取)

**query** - 查询字符串

**queryObject** - 根据 search 解析得到的对象

**set** - 将包含一个或多个查询值的对象设置到当前 url 查询上

**coverSet** - 类似 set，区别是会重置掉所有 search 并设置为传入的查询对象(仍包含默认查询)
