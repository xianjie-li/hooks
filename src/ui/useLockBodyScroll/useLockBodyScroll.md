---
title: useLockBodyScroll
group:
  path: /UI
  order: 1
---

# useLockBodyScroll

锁定滚动条并对滚动条宽度进行修正, 支持多个实例同时使用

## 示例

<code src="./useLockBodyScroll.demo.tsx" />

## API

`const currentLocked = useLockBodyScroll(locked: boolean)`

**locked** - 锁定/恢复滚动条

**currentLocked** - 当前的真实锁定状态，当在不同地方使用多个 useLockBodyScroll 时, 锁定状态往往会和传入值不同
