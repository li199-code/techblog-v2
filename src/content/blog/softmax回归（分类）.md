---
title: softmax回归（分类）
tags: [deep-learning]
categories: 动手pytorch
abbrlink: f17e2337
date: 2023-03-23 10:20:57
---

## 回归和分类

机器学习（深度学习）的任务纷繁复杂。最基础的是回归和分类。回归是预测连续值，分类是预测离散类别。

分类问题是多输出，因此，训练标签和模型（网络）的输出应该是多维的。_独热编码_ （one-hot encoding）是一种表示多分类的方式。就是在一个向量中，将真实分类索引下的值设为 1，其他是 0，因此向量自身的内积为 1。另外，模型的线性表示为：

所以，softmax 也是一个单层全连接网络。

## softmax 函数

分类问题的训练，可以用最大化正确分类的概率来表示。因此，要通过 softmax 函数将神经网络的输出$o_i$转化为 0-1 之间的概率。

$$
\begin{equation}
\hat{\mathbf{y}} = \mathrm{softmax}(\mathbf{o})\quad \text{其中}\quad \hat{y}_j = \frac{\exp(o_j)}{\sum_k \exp(o_k)}
\end{equation}
$$

softmax 可以保证输出在 0-1 之间，且 softmax 可导。
