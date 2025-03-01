---
title: TypeScript 为 JavaScript 带来了什么
authors: Jason
tags: [TypeScript]
abbrlink: e0862921
date: 2023-08-04 09:29:21
updated: 2024-05-02 00:00:00
categories: TypeScript
summary: 为什么学 TypeScript
---

## TypeError 举例，TS 是如何解决的

当一项新技术摆在我这样的懒人前，有必要弄清学它的必要性，否则一定会半途而废。JavaScript 的过于灵活，一直以来为人诟病。它所带来的麻烦，主要体现在很多 TypeError 报错，直到运行时才会暴露出来。这一点在我的编程体验中最为深刻。以下是 chatgpt 对这个问题的理解和 typescript 能在多大程度上解决这类错误。

**You:**

**JavaScript 中的 TypeError**

ChatGPT:

在 JavaScript 中，TypeError 是一种常见的错误类型，当尝试对一个数据类型执行不适合的操作时会抛出。下面是一些常见的 TypeError 发生的情况：

1. **访问未定义的属性** ：

```javascript
let obj;
console.log(obj.property); // TypeError: Cannot read property 'property' of undefined
```

2. **调用非函数类型的变量** ：

```javascript
let nonFunction = 123;
nonFunction(); // TypeError: nonFunction is not a function
```

3. **将值赋给只读属性** ：

```javascript
const obj = {};
Object.defineProperty(obj, "prop", {
  value: 42,
  writable: false,
});
obj.prop = 77; // TypeError: Cannot assign to read only property 'prop' of object
```

4. **在基础数据类型上调用方法** ：

```javascript
null.someMethod(); // TypeError: Cannot read property 'someMethod' of null
```

5. **使用`new`关键字调用不是构造函数的对象** ：

```javascript
let notAConstructor = {};
new notAConstructor(); // TypeError: notAConstructor is not a constructor
```

为了处理这些错误，可以使用 `try...catch` 语句来捕获和处理异常。例如：

```javascript
try {
  let obj;
  console.log(obj.property);
} catch (e) {
  if (e instanceof TypeError) {
    console.error("TypeError caught:", e.message);
  } else {
    throw e;
  }
}
```

通过合理的错误处理，可以使代码更加健壮，并能够更好地调试和维护。

**You:**

**这些错误能通过把 js 改写为 typescript 来解决吗**

ChatGPT:

将 JavaScript 转换为 TypeScript 可以预防许多类型相关的错误，因为 TypeScript 提供了静态类型检查和更严格的语法规则。然而，TypeScript 并不能完全消除所有运行时错误。让我们看看上述几种 TypeError 是如何在 TypeScript 中得到改进或预防的：

1. **访问未定义的属性** ：

```typescript
let obj: { property?: string };
console.log(obj.property); // TypeScript 提示 obj 可能为 undefined
```

TypeScript 会警告你 `obj` 可能是 `undefined`，需要检查或使用类型保护。

2. **调用非函数类型的变量** ：

```typescript
let nonFunction: any = 123;
(nonFunction as Function)(); // TypeScript 会警告类型不匹配
```

TypeScript 类型系统会阻止非函数类型的变量被调用。

3. **将值赋给只读属性** ：

```typescript
interface MyObject {
  readonly prop: number;
}
const obj: MyObject = { prop: 42 };
obj.prop = 77; // TypeScript 编译错误: Cannot assign to 'prop' because it is a read-only property.
```

TypeScript 通过 `readonly` 修饰符强制只读属性不可被重新赋值。

4. **在基础数据类型上调用方法** ：

```typescript
let nullable: null | { someMethod: () => void } = null;
nullable.someMethod(); // TypeScript 提示 nullable 可能为 null
```

TypeScript 会提示 `nullable` 可能是 `null`，需要进行检查。

5. **使用`new`关键字调用不是构造函数的对象** ：

```typescript
let notAConstructor: any = {};
new notAConstructor(); // TypeScript 编译错误: Cannot use 'new' with an expression whose type lacks a call or construct signature.
```

TypeScript 会阻止在非构造函数的对象上使用 `new` 关键字。

TypeScript 通过静态类型检查、接口、类型断言等机制，大大减少了因为类型错误而导致的运行时异常。尽管如此，TypeScript 不能完全避免所有错误，特别是那些涉及到动态数据和外部输入的错误，因此在编写 TypeScript 代码时仍需谨慎，并结合适当的错误处理机制。

## TS 很强，但是还不够

TypeScript 类型检查的范围只局限在代码编译阶段，运行时是无能为力的。比如一次数据库查询期望返回一个数组格式的数据，但是因为某种原因变成了 undefined，那么后续代码用到这个数组的地方就会报错了。所以，涉及到动态数据的，应该要手动加类型检查，比如说

```js
if (!Array.isArray(o)) {
  throw new Error();
}
```

## 强类型？弱类型？

ts 是在 js 的基础上加上了类型，因此成了一门静态语言。但是，这种静态类型还要加一个"弱"的形容词。这是因为，ts 和 js 一样会执行隐式转换而不会报错。

```ts
console.log(1 + "1");
// 打印出字符串 '11'
```

上面这段代码，js/ts 都能执行成功。
