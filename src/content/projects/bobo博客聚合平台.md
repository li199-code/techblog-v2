---
title: bobo - 博客聚合平台
tags: [Go, 并发]
date: 2025-05-17
categories: 项目
authors: Jason
---

## 项目介绍

搜集博客网站的rss链接，自动抓取博客内容，并生成一个聚合平台。

技术栈：Go（gin）+ Postgresql + React + Shadcn

[项目地址](https://github.com/li199-code/bobo)

## 后端

后端使用Go语言开发，使用gin框架作为web框架，使用postgresql作为数据库。

### main.go

#### 错误处理

Go 的错误处理机制比较独特，不像 Java 或 Python 那样使用异常（try/catch），而是通过返回值来处理错误。这种方式强调显式地处理每个可能出错的步骤，是 Go 语言哲学中“清晰优于隐式”的体现。（所以错误判断特别多！）

Go 的设计理念是：

常规错误：用 error 显式处理。

严重问题（不可预期）：用 panic 表示，如访问空指针、数组越界。

recover 只在 defer 中使用，用来“拦截” panic，防止程序崩溃。

两种错误处理方式：

1. 常规错误：用 error 显式处理。

```go
func OpenFile(filename string) (*os.File, error) {
    f, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    return f, nil
}

```

2. 严重错误：用 panic 显式处理。

```go
func safeDivide(a, b int) (result int) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
            result = 0 // 返回默认值
        }
    }()
    return a / b
}

func main() {
    fmt.Println(safeDivide(10, 2)) // 输出 5
    fmt.Println(safeDivide(10, 0)) // 不崩溃，输出 0
}
```

如果没有 recover，程序会崩溃：`panic: runtime error: integer divide by zero`

#### 指针

指针是存储变量地址的变量。使用指针可以直接操作变量的内存地址。指针最多的用法是将指针作为函数参数，将指针作为函数返回值。在 Go 语言中，指针是内置类型，不需要导入任何包。指针类型的变量名后面加上一个`&`号，表示取变量的地址。指针类型的变量名后面加上一个`*`号，表示取指针指向的值。

### 数据库

这个项目我用到了PG提供的json类型，过程中踩了一些坑。

1. jsonb > json

jsonb相对于json，不仅支持索引，操作函数也较多，所以优先使用jsonb。而且插入数据的时候，即使你没有显式地写 ::jsonb，当你往 jsonb 类型的字段插入一个字符串字面量 '{"city": "Beijing", "score": 88}'，PostgreSQL 会自动将它隐式转换成 jsonb 类型，前提是它是一个有效的 JSON 字符串。

## 前端

用vite启动一个react+typescript项目，然后引入shadcn。shadcn会在src文件夹下生成一个components文件夹，里面有button.tsx，input.tsx等等组件，这些组件都是源码，方便修改，这也是shadcn的优点。

前端开发后，设置vite.config.js的base为'/static/',将build后的产物放在后端的dist文件夹下。同时在后端中设置静态文件路径为'/static/'。这样，后端就托管了前端的静态文件，前端请求接口时，接口地址为'/api/xx'，静态文件入口html为'/static/index.html'。
