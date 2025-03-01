---
title: 通俗易懂的Promise解释
tags: [异步编程, promise]
categories: JavaScript异步编程
abbrlink: 5d9fa5e8
date: 2022-07-26 17:58:45
---

本博客的第一篇文章，讲讲 Javascript 里的 Promise。Promise 要记住的点：

- 写法
- 用法

这篇文章，不谈那些状态，而是尽量接触问题的本质，谈谈 Promise 究竟解决了什么问题，在何时用。

<!-- truncate -->

## 为什么需要 promise

名词解释：回调函数，指一个任务执行完了，需要调用的函数。

多个异步任务，如果采用回调函数的写法，且任务 B 依赖任务 A 的返回，那么任务 B 只能写在 A 的回调函数里。

<!--more-->

```javascript
// A
setTimeout(function () {
  console.log("First");
  // B
  setTimeout(function () {
    console.log("Second");
    setTimeout(function () {
      console.log("Third");
    }, 3000);
  }, 4000);
}, 1000);
```

如果这样的依赖链条很长，就会出现很深的嵌套，可读性差。于是，promise 对象被提出了，将多次异步代码写成顺序格式而非嵌套格式：

```javascript
function print(delay, message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // console.log(message);
      resolve(message);
    }, delay);
  });
}
print(1000, "First")
  .then(function () {
    return print(4000, "Second");
  })
  .then(function () {
    print(3000, "Third");
  });
```

因此，异步是异步，promise 是 promise，异步任务的实现靠的是 javascript 的事件循环机制，而不是 promise，promise 仅是改变了需要按顺序执行的多个异步任务的书写格式。从 promise 的字面意义上，即“承诺”，可以解释为保证异步任务的按顺序执行。

## resolve/reject

到这里，应该要记住 promise 的形式。new 出来一个 promise 对象，其中传入一个参数为`resolve`和`reject`的匿名函数：

resolve 意为解决，表示任务成功，将任务结果给下一个异步任务。执行到 resolve 后，代码会跳转到下面最近的一个 then 中。then 的参数也是一个匿名函数，这个函数的参数接收 resolve 传来的数据。

reject 意为拒绝，表示任务失败，并将错误信息传到最近的一个 catch 中，catch 内容和 then 相似。

## async/await

不得不说，现在没人用 promise 刚提出时推荐的`then/catch`链条逻辑了。取而代之的是具有同步写法的`async/await`。async 可以简单理解为一个声明符，表示这是一个异步执行函数。await 后面跟的是一个返回 promise 对象的步骤（如果不是，也会强制包装成 promise）。然后就是一个精彩的点：如果用一个变量接收 await 返回的 promise 对象，这个变量会自动变成 promise 对象的值(result)。看一个例子：

```js
function print(delay, message) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // console.log(message);
      resolve(message);
    }, delay);
  });
}

> print(100, 'some')
// Promise {<pending>}
// [[Prototype]]
// :
// Promise
// [[PromiseState]]
// :
// "fulfilled"
// [[PromiseResult]]
// :
// "some"

> const a = await print(100, 'some')
> a
// 'some'
> typeof a
// string
```

## promise 周边函数

1. `Promise.all(iterable)`

- 接收一个可迭代对象（如数组）作为参数，其中每个元素都是 `Promise`。

- 返回一个新的 `Promise`，只有当所有的 `Promise` 都变为 “fulfilled” 时，它才会变为 “fulfilled”，并将所有结果值组成数组传递给 `.then()`。

- 如果有任何一个 `Promise` 变为 “rejected”，则 `Promise.all()` 立即变为 “rejected”，并将第一个错误原因传递给 `.catch()`。

```javascript
const p3 = Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]);
p3.then((values) => console.log(values)); // 输出: [1, 2, 3]
```

2. `Promise.allSettled(iterable)`

- 接收一个可迭代对象，并返回一个在所有 `Promise` 都已完成（无论是“fulfilled”还是“rejected”）后才完成的 `Promise`。

- 返回值是包含每个 `Promise` 状态和结果的对象数组。

```javascript
const p4 = Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3),
]);
p4.then((results) => console.log(results));
// 输出:
// [
//   { status: "fulfilled", value: 1 },
//   { status: "rejected", reason: "Error" },
//   { status: "fulfilled", value: 3 }
// ]
```

3. `Promise.race(iterable)`

- 接收一个可迭代对象，返回第一个完成的 `Promise` 的结果。

- 只要有一个 `Promise` 完成（无论是“fulfilled”还是“rejected”），就会返回该状态。

```javascript
const p5 = Promise.race([
  new Promise((resolve) => setTimeout(() => resolve("First"), 100)),
  new Promise((resolve) => setTimeout(() => resolve("Second"), 200)),
]);
p5.then(console.log); // 输出: "First"
```

4. `Promise.any(iterable)`

- 接收一个可迭代对象，返回第一个 “fulfilled” 的 `Promise` 的结果。

- 如果所有的 `Promise` 都被拒绝，则返回一个状态为“rejected”的 `Promise`，并且 `reason` 是一个 `AggregateError`，包含所有被拒绝的原因。

```javascript
const p6 = Promise.any([
  Promise.reject("Error 1"),
  Promise.reject("Error 2"),
  Promise.resolve("Success"),
]);
p6.then(console.log).catch((error) => console.error(error));
// 输出: "Success"
```

### 总结

- `Promise.all()`：用于并行执行多个 `Promise`，并在所有的状态都为"fullfilled"时返回结果。

- `Promise.allSettled()`：用于等待多个 `Promise` 的全部完成，不论其状态。

- `Promise.race()`：返回最先完成的 `Promise` 结果。

- `Promise.any()`：返回第一个成功的 `Promise` 结果，若全部失败，则返回一个 `AggregateError`。
