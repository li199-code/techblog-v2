---
title: JavaScript 事件循环机制
summary: JavaScript 任务执行顺序背后的机制，面试必考，内容由 chatgpt-4o 产生
tags: [JavaScript, 异步编程]
categories: JavaScript异步编程
abbrlink: c0d179b0
date: 2024-07-07 22:48:28
---

在 JavaScript 中，任务的执行顺序是基于事件循环（Event Loop）机制。理解这一机制对于编写高效、非阻塞的 JavaScript 代码至关重要。JavaScript 的执行模型可以分为以下几部分：

1. **调用栈（Call Stack）**

2. **任务队列（Task Queue）**

3. **微任务队列（Microtask Queue）**

4. **事件循环（Event Loop）**

### 调用栈（Call Stack）

调用栈是 JavaScript 引擎的一部分，用于跟踪函数调用的执行顺序。每当一个函数被调用时，它会被推入调用栈；函数执行完毕后，会从调用栈中弹出。调用栈是同步执行的，即一个函数必须执行完毕后，下一个函数才能执行。

### 任务队列（Task Queue）

任务队列用于存放异步任务的回调，如 `setTimeout` 和 `setInterval`。当异步任务完成后，对应的回调函数会被放入任务队列中等待执行。

### 微任务队列（Microtask Queue）

微任务队列用于存放微任务，如 `Promise` 的回调函数和 `MutationObserver` 的回调。微任务具有更高的优先级，会在当前调用栈执行完毕后立即执行，优先于任务队列中的任务。

### 事件循环（Event Loop）

事件循环不断地检查调用栈是否为空，如果为空，它会检查微任务队列是否有任务需要执行。如果微任务队列为空，事件循环会从任务队列中取出第一个任务并执行。

### 执行顺序示例

通过以下代码示例，可以更清楚地了解 JavaScript 的任务执行顺序：

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise callback");
});

console.log("End");
```

执行顺序如下：

1. `console.log("Start")` 被推入调用栈并执行，输出 `Start`。

2. `setTimeout` 被推入调用栈并执行，注册一个回调函数，并设置 0 毫秒延迟。回调函数被放入任务队列。

3. `Promise.resolve().then` 被推入调用栈并执行，注册一个微任务回调函数，并放入微任务队列。

4. `console.log("End")` 被推入调用栈并执行，输出 `End`。

5. 调用栈清空后，事件循环检查微任务队列，发现有一个微任务。将微任务回调 `console.log("Promise callback")` 推入调用栈并执行，输出 `Promise callback`。

6. 微任务队列清空后，事件循环检查任务队列，发现有一个任务。将 `setTimeout` 的回调函数 `console.log("Timeout callback")` 推入调用栈并执行，输出 `Timeout callback`。

最终输出顺序为：

```sql
Start
End
Promise callback
Timeout callback
```

### 总结

JavaScript 的任务执行顺序是基于事件循环、调用栈、微任务队列和任务队列的协同工作。理解这些机制有助于编写高效、非阻塞的代码，并避免常见的异步编程问题。
