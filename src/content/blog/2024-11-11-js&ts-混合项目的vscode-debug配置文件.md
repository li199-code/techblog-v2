---
title: "JS&TS 混合项目的VSCode debug配置文件"
slug: "js&ts -hun-he-xiang-mu-de-vscode debug-pei-zhi-wen-jian"
date: 2024-11-11
description: "来自真实项目的配置文件"
tags: [vscode, typescript]
---

读懂配置文件，有助于分析 bug，并且更深一步了解项目。

<!-- truncate -->

## launch.json

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug",
            "trace": true,
            "skipFiles": [
                "<node_internals>/**"
            ],
            "preLaunchTask": "tsc: build - tsconfig.json",
            "program": "${workspaceFolder}/debug/debug.js",
            "sourceMaps": true,
            "smartStep": true,
            "internalConsoleOptions": "openOnSessionStart",
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ],
            "runtimeArgs": ["-r", "esm"]

        }
    ]
}
```

`"preLaunchTask": "tsc: build - tsconfig.json",`表示调试前都会将 ts 编译成 js 的过程执行一次。

`program`是调试的入口文件。这个可以根据需要换成想要的文件。

`outFiles`是 ts 编译结果输出的文件夹。

`runtimeArgs`: 为 Node.js 运行时提供额外参数，这里使用 -r esm 参数，提前加载 ESM 模块，使项目可以使用 ESM 的语法特性。这个项目中，必须加入这两个参数。

![runtimeArgs作用](https://img.jasonleehere.com/202411112229504.png)

## tsconfig.json

```
{
  "exclude": [
    "node_modules"
  ],
  "include": [
    "src/**/*.ts",
    "test/**/*.ts"
  ],
  "compilerOptions": {
    "outDir": "dist",
    "allowJs": true,
    "module": "Node16",
    "moduleResolution": "Node16",
    "sourceMap": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2018",
    "lib": [
      "ES2018"
    ]
  }
}
```

重点部分是`compilerOptions`:

1. **`outDir`** : 指定编译后的文件输出目录，这里是 `dist`，所以编译后的 `.js` 文件会存放在 `dist` 文件夹中。

2. **`allowJs`** : 允许编译 `.js` 文件，默认情况下 TypeScript 只编译 `.ts` 文件，但设置为 `true` 后可以包含 `.js` 文件。

3. **`module`** : 指定模块系统，这里设置为 `Node16`，对应 Node.js 16 及其之后的模块系统，支持原生 ESM 模块和 CommonJS。

4. **`moduleResolution`** : 设置模块解析策略，这里选择 `Node16`，这意味着编译器将使用 Node.js 16 及之后的解析规则来查找模块。

5. **`sourceMap`** : 启用 Source Map 生成，以便在调试时能够映射回原始的 TypeScript 代码。

6. **`allowSyntheticDefaultImports`** : 允许从没有默认导出的模块中导入默认值，用于兼容 CommonJS 模块。

7. **`target`** : 指定编译的目标 ECMAScript 版本，这里是 `ES2018`，表示编译后的代码将兼容 ES2018 的特性。

8. **`lib`** : 指定包含的库文件，`"ES2018"` 表示编译器将使用 ES2018 标准库类型定义。
