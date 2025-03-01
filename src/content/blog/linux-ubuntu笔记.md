---
title: LINUX 基础操作（基于UBUNTU）
authors: Jason
tags: [linux, ubuntu]
abbrlink: be5075f5
date: 2023-07-10 19:43:44
categories:
summary: 基于ubuntu的linux最常用命令及最佳实践
---

## 前言

跟随全栈学习路线之 linux 系统熟悉。由于 linux 的命令很多，且有些命令很长，很难记住，但是借助 gpt，无需强调记住命令，而是重点学习 linux 系统的工作原理，以及和 win 系统不同的操作逻辑。

如何定义“常见”的命令呢？我认为，**看到那些习以为常的 windows 操作在 linux 中的实现，就可以认为是常见命令加以记忆。**

## directory

删除某一个文件夹时，如果文件夹下有文件，是不能直接删除的，得用`rm -r <directory>`. -r 表示递归的删除，即将所有存在的文件全部删除。

## 文件操作

因为 linux 内万物皆文件，所以下面的命令适用于 linux 内任何实体。

### 复制粘贴/移动

复制粘贴文件时，并不是像 win 下有分为 copy&paste 两个动作，而是一个命令完成：`cp <src> <target>`. 如果要将整个文件夹下的文件复制到另一个地方，要分两种情况，要么是所有文件的转移：`cp -r . <target>` 或者以文件夹的形式复制：`cp -r <dirname> <target>`.

mv 命令从字面上是移动（剪切粘贴），也可作为重命名文件的命令使用

### linux 目录结构

win 的所有文件都存在 C 盘（假如不分区），而 linux 的根目录则是朴实无华的`/`，类似于 C 盘。用 xshell 等工具登录后的着陆目录可能是你的用户文件夹，比如`/root`。

### 文件的增删改查

1. 增

创建空文件用`touch`，但是好像没什么必要。绝大部分场景是创建文本文件，最好是`vi`。

2. 删：rm

3. 改：vi

4. 查

查有两个层面：一是查看文件属性，用`ls -lh filename`。二是查看文件内容。小文件直接用 vi，大文件（一般是日志），要么查看尾部几条`tail -n 200 filename`，要么用`less`进入文件，熟练运用`space/b`进行上下翻页。

vi 的详细命令本文后面会说。

## system info

最主要的三个状态：cpu，内存和磁盘。

### cpu 和内存

可以通过`top`或者`htop`（需要另外安装）

top 的输出：
![](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16891288146221689128813983.png)

htop 的输出：
![](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16891288816201689128881589.png)

htop 的信息更清晰一些。在进入 top 界面后，可以输入下列快捷键改变实时显示：

- `q`：退出 `top`。

- `P`：按 CPU 使用率排序（默认）。

- `M`：按内存使用率排序。

- `k`：结束一个进程（输入进程 ID）。

### 磁盘

磁盘大概不必查看实时状态。命令为`df -h`.

![用centos的截图代替了](https://img.jasonleehere.com/202409212320448.png)

## package manager

windows 下所有的软件安装都是走可视化窗口，而 ubuntu 一般都是通过命令行。搜索软件：`sudo apt search <name>`, 安装：`sudo apt install <name>`, 卸载：`sudo apt remove <name>`。

或者，也有的软件是通过下载压缩包，并解压后得到 deb 后缀的安装包，运行`sudo dpkg -i <name>`.

注意：软件安装都需要 sudo 的权限，因为安装过程都是对系统文件的修改。

## text editor

值得说明的是，用 vscode 连接远程的，可以直接用图形页面编辑文本，也是优先选择。可选工具：vi, vim, nano 等。

~~nano 在我心中取代了 vim，因为它的操作逻辑更简单直观。~~Nano 不是自带的，使用还得安装；而大部分系统（ubuntu/centos）都自带 vi。所以，还是掌握 vi 为好。

### vi 常用命令

- **搜索文本** ：

  - `/pattern`：向下搜索 `pattern`。

  - `?pattern`：向上搜索 `pattern`。

  - `n`：重复上一次搜索（相同方向）。

  - `N`：反向重复上一次搜索。

- **显示/隐藏行号**: `:set nu/set nonu`
- **跳转到某一行**: `:n`
- **翻页**：`Ctrl + f`向下翻页；`Ctrl + b`向上翻页；`G`移动到文件末尾；`gg`移动到文件开头。

## 打包压缩

Linux 的打包和压缩实际上是两个独立的过程，不同于 windows 的默认集中在一起完成。

- **打包（Archive）** : 仅将多个文件合并成一个文件，并不压缩大小，常用 `tar` 命令。

- **压缩（Compression）** : 通过算法减少文件大小，常用 `gzip`、`bzip2` 或 `xz` 命令。

- **打包和压缩结合使用** 通常情况下，打包和压缩结合使用可以将多个文件合并为一个文件，同时减少其总大小。在 Linux 中，最常用的组合是 `tar` 命令和 `gzip` 或 `bzip2` 压缩工具的组合。

- **打包并压缩** :

```bash
tar -cvzf archive.tar.gz file1.txt file2.txt  # 打包并使用 gzip 压缩
tar -cvjf archive.tar.bz2 file1.txt file2.txt  # 打包并使用 bzip2 压缩
tar -cvJf archive.tar.xz file1.txt file2.txt  # 打包并使用 xz 压缩
```

- **解压并解包** :

```bash
tar -xvzf archive.tar.gz  # 解压并解包 gzip 压缩的 tar 文件
tar -xvjf archive.tar.bz2  # 解压并解包 bzip2 压缩的 tar 文件
tar -xvJf archive.tar.xz  # 解压并解包 xz 压缩的 tar 文件
```

选项解释：

- `-c`：创建新的打包文件（create）。

- `-v`：显示打包过程的详细信息（verbose）。

- `-f`：指定输出文件名（file）。

- `-t`：查看打包文件的内容（list）。

- `-x`：解包（extract）。

- `-z`：使用 `gzip` 压缩。

- `-j`：使用 `bzip2` 压缩。

- `-J`：使用 `xz` 压缩。

## soft/hard link

软硬连接对标 windows 的快捷方式。区别如下：

| 比较项             | 软连接（Symbolic Link）          | 硬连接（Hard Link）                |
| ------------------ | -------------------------------- | ---------------------------------- |
| 创建命令           | `ln -s <目标> <链接名> `         | `ln <目标> <链接名> `              |
| 是否可以跨文件系统 | 是                               | 否                                 |
| 是否可以指向目录   | 是                               | 否（通常不能指向目录）             |
| 是否依赖目标路径   | 是（依赖目标路径）               | 否（与目标文件共享相同的 inode）   |
| 目标删除的影响     | 目标被删除，链接失效（断链）     | 目标被删除，硬链接仍可访问文件内容 |
| 是否共享 inode     | 否（独立的 inode）               | 是（共享相同的 inode）             |
| 用途               | 用于创建目录快捷方式或跨分区引用 | 用于在同一分区内创建文件的多个引用 |
