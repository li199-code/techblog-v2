---
title: NoSQL老大-MongoDB的使用
summary: MongoDB crud操作的api特点
tags: [MongoDB]
abbrlink: 28aeba66
date: 2024-08-20 22:55:05
---

## 数据层级关系

mongodb 数据分为三层，分别是 db，collection，document。collection 相当于 table，document 就是一条条的 record。

## 工具

mongodb 安装时会自带一个名为 mongosh 的 shell，而这个 shell 本质上也是一个 JavaScript 解释器。所以在里面可以直接执行 js 命令。

![mongosh](https://img.jasonleehere.com/202408202327731.png)

实际使用中似乎很少用 mongosh 的，不太直观。市面上有一些 mongo 的可视化管理工具，比如官方的 MongoDB Compass，Navicat for MongoDB 等。推荐用免费的 MongoDB Compass。

## CRUD

### updateOne/updateOne 主要区别

- **更新数量** :

  - `updateOne` 只更新第一个匹配的文档。

  - `updateMany` 会更新所有匹配的文档。

- **使用场景** :
  - 使用 `updateOne` 当你只想更新单个文档，通常是对唯一标识（如 `_id`）进行操作时。

其他的 one 和 many 都类似。

### 查询操作的灵活性

mongoDB 的 json 式查询带来了很多灵活性，我们可以像编程一样写查询。比如说操作符：

```js
const cursor = db.collection("inventory").find({
  status: { $in: ["A", "D"] },
});
```

## aggregation pipeline

聚合管道，不只有聚合操作。实际上是一个数组，每个元素为 stage，并按排列顺序执行。

```js
db.orders.aggregate([
  // Stage 1: Filter pizza order documents by pizza size
  {
    $match: { size: "medium" },
  },

  // Stage 2: Group remaining documents by pizza name and calculate total quantity
  {
    $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } },
  },
]);
```
