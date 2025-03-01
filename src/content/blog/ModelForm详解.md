---
title: ModelForm详解
authors: Jason
tags: [django]
abbrlink: "62789229"
date: 2023-04-28 16:05:54
categories:
---

## 前言

web 开发中，我目前遇到最复杂、又是最需要的需求，就是用户验证系统。除了一般的注册登录，还有权限、分组等。而从注册开始，需要理解 django 为什么设计了 modelForm 来处理用户的表单输入。

## 从 form 讲起

在注册的例子中，文档给出的方法是调用如下函数：

```
from django.contrib.auth.models import User
User.objects.create_user(username='', email='', password='')
```

但是正常的网站注册方式都是通过表单，怎么建立表单和 create_user 函数的联系呢？如果搜索文档里的表单，得到的答案是：

```
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import NameForm


def get_name(request):
    # if this is a POST request we need to process the form data
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = NameForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect("/thanks/")

    # if a GET (or any other method) we'll create a blank form
    else:
        form = NameForm()

    return render(request, "name.html", {"form": form})
```

我们知道了，对于提交上来的表单，先验证数据是否都有效，然后进一步的处理并重定向。可是什么是进一步的处理？

所以这大概就是文档有时候不能解决实际场景的问题，要结合别人写的代码，再回到文档中理解。

## ModelForm

表单，一般都是和模型（也就是表中的字段）绑定的。因此，如果从头由`forms.ModelForm`继承来的表单类开始写，无疑是一种重复代码。因为与之绑定的模型字段在之前的 models.py 中定义过了。因此，django 创建了 ModelForm，直接在表单创建时和模型绑定，这样，提交上来的表单在验证通过后，保存表单就会同时保存提交上来的数据。

关于用户注册，需要知道的是，django 自带的 User 对象已经可以满足大部分场景的使用了，一般直接将其作为模型使用，而不用在 models.py 中创建。

通过这个例子，我的体会是：django 的写法太灵活了，往往一个问题有多种解决方案。可能最好的办法是摸索出一套自己习惯的写法。
