---
title: NodeJS child_process exec原理
summary: child-process简介，以及调试过程的踩坑记录
tags: [NodeJS]
abbrlink: 57ebbc6d
date: 2024-08-26 22:31:15
---

今天工作中，遇到一个难缠的需求：在 nodejs 中用命令行方式运行一段 etl 脚本。数据库是 SAP 公司的 hana，相对冷门，驱动的接口和其他也有区别。需求中用到了`await-exec`这个库，其背后是 child-process,即用于创建和控制子进程。这个模块允许你在 Node.js 应用中运行外部命令、脚本或其他 Node.js 进程，并与这些子进程进行通信。通过 child_process，你可以执行 shell 命令、启动其他程序，甚至是在独立的 Node.js 环境中运行代码。

## child-process 简介（AI）

`child_process` 是 Node.js 标准库中的一个模块，用于创建和控制子进程。这个模块允许你在 Node.js 应用中运行外部命令、脚本或其他 Node.js 进程，并与这些子进程进行通信。通过 `child_process`，你可以执行 shell 命令、启动其他程序，甚至是在独立的 Node.js 环境中运行代码。`child_process` 提供了几种方法来创建和管理子进程：

1. **`exec`** ：

- 用于执行一个命令，并且将整个命令的输出缓存在内存中。

- 适合用于执行简单的命令，例如调用一个 shell 命令并收集结果。

- 代码示例：

```javascript
const { exec } = require("child_process");

exec("ls -lh", (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

2. **`spawn`** ：

- 用于启动一个新的进程，并且可以通过流（streams）与该进程进行交互。

- 适合用于处理大输出或者需要与进程进行持续交互的场景。

- 代码示例：

```javascript
const { spawn } = require("child_process");

const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`子进程退出码: ${code}`);
});
```

3. **`fork`** ：

- 专门用于创建一个新的 Node.js 进程，并且能够很方便地在父子进程之间传递消息。

- 适合用于多进程处理的场景，例如将任务分配给多个子进程来并行处理。

- 代码示例：

```javascript
const { fork } = require("child_process");

const child = fork("child.js");

child.on("message", (message) => {
  console.log("来自子进程的消息:", message);
});

child.send("开始处理");
```

4. **`execFile`** ：

- 类似于 `exec`，但 `execFile` 直接执行一个可执行文件，而不是通过 shell。

- 比 `exec` 更加安全，因为不涉及 shell 命令解析。

- 代码示例：

```javascript
const { execFile } = require("child_process");

execFile("node", ["--version"], (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
```

主要用途：

- **自动化任务** ：可以用来执行 shell 脚本或其他命令行工具，自动化各种任务。

- **与系统交互** ：能够直接调用系统命令或运行外部程序。

- **多进程处理** ：通过 `fork` 或 `spawn` 创建多个进程来并行处理任务，提升性能。`child_process` 模块在需要与操作系统或其他程序交互时非常有用，同时也可以用来在 Node.js 中实现多进程并发处理。

## 痛苦的调试过程

在主进程脚本文件中，调用 cp 的代码片段：

```js
const pipelineRet = await exec(`${tapCMD} | \
  $TARGET_CLICKHOUSE_CMD -c $TARGET_CLICKHOUSE_HOME/config.json`);
```

其中 tapCMD 大致内容是`node xxx.js`。我发现，在 xxx.js 中无论打多少次 log，控制台都不会显示。我大概猜到是因为不在同一个进程的原因。只有在 throw Error 时，控制台才会打印出错误。可是这样一来，throw error 后面的代码就不会运行，给调试带来极大的不方便。后来，我研究了一下 cp 的 api，发现本不必如此麻烦。

```javascript
const { exec } = require("child_process");

exec("node xxx.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

在 xxx.js 执行完毕后（或者意外退出），就会执行后面的回调函数，error 是 Error 加 stderr，steerr 对应的是 console.error 级别，stdout 就是 console.log。如果 error 存在，就会进入 if 中，return 返回，自然不会执行后面的打印 stdout。`await-exec`库的源代码与上面逻辑类似。

其实，正确的调试方式是 console.error 来取代 log，这样调试起来方便多了。
