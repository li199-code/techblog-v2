---
title: 面向对象编程及其在 JS/TS 中的实现
tags: [es6, oop]
abbrlink: 584a7bac
date: 2023-12-16 23:38:01
updated: 2024-05-03 00:00:00
categories: Javascript 进阶
authors: Jason
---

OOP 在不同编程语言中都通用的概念，并用 js 举例说明，同时包含 ts 相对于 js 独有的特性。

<!-- truncate -->

## 历史

谈到 OOP（面向对象编程），我的印象总是停留在我刚学一些静态语言时（如 java），相对于 python、JavaScript，OOP 的概念总是被很早的引入。视频里的讲师总是举一些诸如 Animal 类和 Cat\Dog 对象的例子。Ok 能听懂，so what the fuck is next? 这东西到底有啥用？实际编写网站项目时，也用不着什么 Animal 类啊。

在一番探索后，我目前的想法是：OOP 本身是为了降低代码的耦合度而提出的，那么一切代码耦合度较高的地方都可以尝试用 OOP。另外，现代的框架很多时候是这样工作的，框架规范了写法是在类内书写属性和方法，然后创建对象的工作交给了框架在后台进行，故看不到。这样的框架在前后端都有，比如 react、eggjs。也就是说，实际上 OOP 无处不在，学习 OOP 有助于理解框架并更好的使用。

说到 Javascript 的面向对象，ES6 之前是借助一套复杂难懂的原型系统实现，ES6 之后向主流的面向对象语言写法靠近，采用了 class 关键字来创建类。以前的那套只做了解，重点掌握的应该是现代的写法。

## 规范

OOP 作为一种编程范式，有它自己的一套规定和要素。

### 属性和方法

```javascript
class Animal {
  constructor(type = "cat", legs = 4) {
    this.type = type;
    this.legs = legs;
  }
}

let dog = new Animal((type = "dog"), (legs = 4));
dog.legs = 2; // 对象属性可以修改
```

constructor 构造函数执行类的初始化操作，如果不需要初始化，可以不定义构造函数，这种情况相当于构造函数内部为空。

### 静态方法

无需实例化对象就可以调用类中的方法。

```javascript
class Animal {
  constructor(type = "cat", legs = 4) {
    this.type = type;
    this.legs = legs;
  }

  static return10() {
    return "10";
  }
}

Animal.return10();
```

### getter/setter

明明是方法，但是调用时形式像是属性。

```javascript
class Animal {
  constructor(type = "cat", legs = 4) {
    this.type = type;
    this.legs = legs;
  }

  get metaData() {
    return `${this.type}, ${this.legs}`;
  }

  set setType(value) {
    this.type = value;
  }
}

let dog = new Animal((type = "dog"), (legs = "2"));

console.log(dog.metaData); // getter调用
dog.setType = "alaska dog"; // setter调用
```

### 继承和多态

**新类拓展父类，而不需要将父类复制一遍，这就是继承**。问题是，如何继承？如何拓展？借助 super 关键字。

```javascript
class Animal {
  constructor(type = "cat", legs = 4) {
    this.type = type;
    this.legs = legs;
  }

  makeNoise(noise = "loud noise") {
    console.log(noise);
  }
}

class Cat extends Animal {
  constructor(type, legs, tail) {
    super(type, legs); // 继承
    this.tail = tail;
  }

  makeNoise(noise, db) {
    // 重写
    super.makeNoise(noise); // 继承
    console.log(`DB is ${db}`); // 拓展的新功能
  }
}

let cat = new Cat("cat", 4, true);

cat.makeNoise("meow", 40);
```

这里的 super 就起到继承的作用，构造函数的继承就是 super()，而方法的继承是 super.methodName()。super 只能在类的构造函数和方法中使用。必须在构造函数中首先调用 super：在子类的构造函数中，必须在使用 this 之前先调用 super。否则会抛出错误。

在上面的例子中，还实现了多态。**多态是指同一个名称的方法，在不同的上下文中有不同的表现**。如上面的`makeNoise`，在父类和子类的逻辑不同。值得注意的是，多态不是只在继承的父子类中体现，两个完全不同的类实现了同一个方法，那么这个方法就是多态。

---

以下内容只存在于 typescript 中。

### 权限控制符：public、private、protect

对一个变量、方法的使用范围做限制的修饰符。public 可以在类和对象使用；private 只能在类内使用；private 可以在类及其子类中使用。

### interface 接口

接口的含义是，使用这个接口（关键字是 implements）的类，必须将接口中的属性和方法全部实现一遍。接口是实现多态的路径之一。

### abstract class 抽象类

抽象类是类的模板，可以被类继承，但是不能直接实例化出对象。

## 拧巴的地方

JavaScript 中并没有类这个数据类型，类的实质是函数：

```js
class Person {}
console.log(Person); // class Person {}
console.log(typeof Person); // function
```

ES6 中的 class 很大程度上是基于既有原型机制的语法糖。
