---
title: 人人都能听懂的 javascript 异步机制
authors: Jason
tags: [异步编程, promise]
categories: JavaScript异步编程
abbrlink: c8c3d6c5
date: 2023-08-07 14:45:51
---

## 前言

同步异步一直是一个绕不过去的小问题，要么遇不上，要么遇上了似懂非懂。这篇文章力争从异步任务的底层需求出发，对 promise、async/await 进行一个详细的了解。

## 同步 or 异步？

![16913918214981691391820745.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16913918214981691391820745.png)

上面这张图表示了两种模式的执行顺序区别，也是最根本的区别。

chatGPT 给出的定义如下：

> 异步任务是指在程序执行过程中，不会阻塞后续代码执行的任务。它们允许在后台执行，以便在等待长时间操作（例如网络请求、文件读写或计算密集型任务）完成时，程序能够继续执行其他任务，提高了程序的响应性和效率。
> 一个异步函数可以拆分为两个部分，一个是耗时部分，这部分时间内执行后面的代码来防止阻塞；另一个是执行回调任务部分，当耗时部分产生结果后，执行回调逻辑。

> 注：回调函数的定义是执行回调任务的一种形式，javascript 另外两种回调形式为 Promise，async/await。

## setTimeout 函数

几乎所有讲解 js 异步机制的都会用 setTimeout 函数来举例子。它是一个最简单的执行异步任务的函数，意思是延迟一定时间后，执行一个回调函数。注意它有三个参数。

```js
setTimeout(function, delay, [param1, param2, ...]);
```

- function: 要执行的函数。
- delay: 延迟的时间，单位为毫秒。
- `[param1, param2, ...]`: 可选参数，这些参数会作为参数传递给执行的函数。

## 回调函数为什么被鄙视

解释完了同步和异步的差异以及异步的优势，下面说一下这篇文章要讨论的核心：假如目的是多个异步任务按顺序执行，应该如何书写易懂的代码？

上面说了异步任务的耗时部分结束后，要执行回调部分；如果用了回调函数的形式，且回调函数的执行结果要作为下一个异步任务的输入，那么就会有多个缩进，使得代码难以读懂，比如：

```js
getUserInfo(function (userInfo) {
  getUserOrders(userInfo.id, function (orders) {
    orders.forEach(function (order) {
      getOrderDetails(order.id, function (details) {
        console.log("Order ID: " + order.id);
        console.log("Order Details: " + details);
      });
    });
  });
});
```

假设我们要依次执行三个异步操作：获取用户信息、获取用户订单列表，然后获取每个订单的详细信息。在上面的代码中，每个异步操作都依赖前一个操作的结果，因此它们被嵌套在一起。这会使代码变得难以理解。面对这样的嵌套回调，处理错误也会变得非常困难：你必须在“金字塔”的每一级处理错误，而不是在最高一级一次完成错误处理。

所以，现在的目标是：

1. 减少嵌套，使得代码方便阅读和调试
2. 在最高一级一次性处理错误

**一句话总结：异步任务是让代码不会阻塞，而 promise 和 async/await 都是为了让多个异步任务按顺序执行的代码更易懂。**

接下来看看 promise 和 async/await 是怎么让异步代码更易懂的？

## promise(期约)

必须要说明的是，promise 的内容比较多，而且绕。不过，我们至少要记住它的表达形式：

```js
function asyncTask(shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve("Task completed successfully.");
      } else {
        reject(new Error("Task failed."));
      }
    }, 1000);
  });
}

asyncTask()
  .then((result) => {
    console.log(result); // 输出: Task result
  })
  .catch((error) => {
    console.error(error);
  });
```

一个 Promise 实例被创建，并传入一个函数作为初始化参数。这个函数有两个参数，分别是 resolve 和 reject。resolve 含义是异步任务顺利执行，并返回一个值，这个值作为 resolve 的参数而调用。然后，then 方法里面传入的函数，其中的参数正是上面 resolve 种传入的参数。在这个例子里，"Task completed successfully."就是下面 then 里面的 result。另外，reject 指的是执行异步任务的过程中，发生了错误，这个错误经由 reject 函数，被下面的 catch 捕获。reject 抛出的错误只能被.catch 捕获，而不会被 try/catch 捕获。

我的理解是，resolve/reject 都是一种占位符。作用是当函数执行到这里，遇到他们俩，知道该往哪个方向走，并携带上参数。现在我们看看那两个目标是不是实现了。

1. 减少嵌套：如果有进一步的的异步任务，可以放在 then 里面执行，有几层，就写几个 then，避免了嵌套。
2. 一次性处理错误：最下面的.catch 会捕获.then 链中任意一步发生的错误（reject）。

## async/await

同样的，先给出形式。

```js
function asyncTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Async task completed");
      resolve("Task result");
    }, 1000);
  });
}

async function runTask() {
  try {
    const result = await asyncTask();
    console.log(result); // 输出: Task result
  } catch (error) {
    console.error(error);
  }
}

runTask();
```

在被 async 描述的函数体内，await 行下面的代码要在 resolve 后才能执行。这不是什么魔法，而是因为 await 是`Promise.resolve().then()`的语法糖。await 行下面的代码相当于是被包进了`Promise.resolve().then()`的 then 里面。所以上面的例子和下面等效：

```js
function asyncTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Async task completed");
      resolve("Task result");
    }, 1000);
  });
}

async function runTask() {
  asyncTask()
    .then((result) => {
      console.log(result); // 输出: Task result
    })
    .catch((error) => {
      console.error(error);
    });
}

runTask();
```

可以看出，换了一种写法后就和上小节的例子一模一样了。runTask 函数的 async 关键字虽然保留，但是如果内部没有 await 配合，也是没有任何作用的。

这个例子中，asyncTask 函数显式返回了一个 Promise 对象，实际上，这个函数可以返回非 Promise 对象，只是会被 await 隐式地转化为 Promise 对象。比如`await 1`。
