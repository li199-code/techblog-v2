---
title: VSCode 使用效率大提升！从常用快捷键谈起
tags: [VSCode]
abbrlink: 43c7ac09
date: 2024-04-15 20:38:17
summary: VSCode 一些好用的快捷键、个性设置等。
categories:
---

## 快捷键

记录一些明显提升工作效率的快捷键，用表格形式，并注明场景。

| 命令                      | 用途                                                                             | 场景                                         |
| ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------- |
| ctrl+p                    | 快速定位，加冒号后还可以定位行号，加@后定位变量，@后再加冒号还可以按分类查看变量 | 多标签页切换或者大文件中定位行               |
| ctrl+shift+p              | 命令画板                                                                         | 记不清快捷键的时候，调出来尝试用自然语言调用 |
| ctrl+tab                  | 切换标签页                                                                       | 多标签页                                     |
| alt+click                 | 多光标选中                                                                       | 批量添加字符                                 |
| Ctrl+Shift+L              | 选中相同的字符                                                                   | 批量选中                                     |
| CTRL+D                    | 选中相同的字符（one by one）                                                     | 批量选中                                     |
| Shift+Alt+drag            | 按列选中                                                                         | -                                            |
| alt+鼠标滚轮              | 加速上下滚动                                                                     | 大文件查看                                   |
| shift+alt+up/down         | 向上下复制                                                                       | 类似内容批量创建（替代 ctrlcv）              |
| alt+up/down               | 向上下移动                                                                       | 代替剪切粘贴                                 |
| ctrl+shift+[/]            | 折叠、展开代码                                                                   | 大文件折叠（根据光标位置，自动选择层级）     |
| ctrl+K+Q                  | 快速定位到上次编辑位置                                                           | 大文件编辑查看                               |
| ctrl+shift+K              | 删除行                                                                           | 当一行较长，避免了拉鼠标和敲退格             |
| ctrl+shift+enter          | 插入行                                                                           | 当一行较长，不用移动到行末按回车             |
| home(笔记本 Fn+home)、end | 定位到行首、行尾                                                                 | 很长的一行                                   |
| ctrl+home/end             | 定位到文件的开头、结尾                                                           | 很长的一个文件                               |
| Shift + End               | 选中光标到行尾的文本                                                             | 选中很长的一行                               |

参考资料：

[vscode 官方 tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

## 多项目管理利器：工作区

随着工作接受的项目越来越多，如何更轻松地管理多个项目成为一个问题。目前我有三个项目，每次重启，需要分别启动三个不同的窗口，如果加上最近搞的 side project，可能同时打开 6 个窗口！所以，我打算寻找一个解决方案。

我之前用过一个叫 Project Manager 的插件，但是这次装回来体验了一下依旧乏善可陈。工作区（Workspace）是 vscode 自带的功能，它指的是你在一个窗口中打开的一个或多个文件夹及其相关配置的集合。工作区允许你将相关的项目文件夹、配置和设置组织在一起，方便进行项目开发。

### 工作区的创建过程

1. 打开一个空白的新窗口。

2. 左上角，File -> Add Folder To Workspace, 把项目文件夹添加进来，有几个项目就重复几次这一步操作。

3. 待项目全部添加完毕后，File -> Save Workspace As，选一个方便的地方存，确认后会生成一个名为`xxx.code-workspace`的文件，内容示例：

```json
{
  "folders": [
    {
      "path": "frontend"
    },
    {
      "path": "backend"
    }
  ],
  "settings": {
    "workbench.colorCustomizations": {
      "editor.lineHighlightBackground": "#1073cf2d",
      "editor.lineHighlightBorder": "#9fced11f",
      "activityBar.background": "#080A9B",
      "titleBar.activeBackground": "#0B0EDA",
      "titleBar.activeForeground": "#FCFCFF"
    }
  }
}
```

后续点击这个文件，即可打开工作空间。

### 工作区的使用

一个工作空间会同时列出多个项目，可以同时管理。我的使用感受是，搜索文件似乎反倒有些不便了，比如搜 index.js，会出现非常多的结果，因为三个文件夹的搜索结果都汇聚起来了。此外，explorer 和 source control 卡，都把所有项目并列显示。

还有一个非常常用的部分，就是 Terminal。不同项目有不同路径的 Terminal，还好 vscode 会帮我们标注出来。不过，更好的做法是，用 split 将不同 terminal 表示为一组，这样既可以并列观察，也可以对 terminal 分组。

## remote explorer

相较于 xshell+xftp 来连接远程服务器和文件操作，vscode 的 remote explorer 显然更操作友好。它同样支持密钥和密码登录两种模式，密钥登录虽然稍微麻烦，但是安全性更高，应该首先考虑。增添连接的路径为：SSH 栏的设置图标，打开`.ssh/config`文件，添加如下内容：

```config
Host <别名>
HostName <服务器地址>
User <用户名>
Port <端口号>
IdentityFile <私钥路径>
```

如果是密码登录，就不用`IdentityFile`了。这里假设已经从服务器申请到了私钥。windows 还需要对私钥的权限进行设置。

在 Windows 上，修改文件权限可以通过以下步骤：

1. **右键点击** `jason.pem` 文件，选择 **"属性"** 。

2. 切换到 **"安全"** 选项卡，然后点击 **"高级"** 按钮。

3. 在弹出的窗口中，点击 **"禁用继承"** 。

4. 选择 **"从此对象中删除所有继承的权限"** 。

5. 点击 **"添加"** 按钮，然后点击 **"选择主体"** 。

6. 输入 **你的 Windows 用户名** ，点击 **确定** 。

7. 在权限窗口中，勾选 **"完全控制"** ，点击 **确定** 。

8. 确保只有当前用户拥有权限，点击 **应用** 和 **确定** 。
