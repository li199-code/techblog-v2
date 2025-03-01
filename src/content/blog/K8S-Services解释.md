---
title: K8S Services解释
summary: 对四种k8s service类型做了说明，给出了它们的工作场景。
tags: [k8s]
abbrlink: b5627f2f
date: 2024-06-22 18:52:40
---

从我个人角度来看，service 是 k8s 最容易出问题的地方。网络不通是最常见的问题，想要排查网络，就要对 service 有一个深入的理解。

<!-- truncate -->

在 Kubernetes 中，`Service` 是一种抽象，定义了一组逻辑上相同的 Pod，并提供了稳定的网络服务入口。`Service` 有三种主要类型，分别是：

## 三种 service 类型

1. **ClusterIP（默认类型）**

![clusterIP工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190591816891719059180297.png)

- **功能** : ClusterIP 是虚拟的，不和实体服务器绑定。该类型的服务只在 Kubernetes 集群内部可访问。它会为 Service 分配一个虚拟 IP 地址（ClusterIP），可以被集群内的其他服务通过该 IP 访问。spec.ports.port 定义了集群内访问这个 clusterIP service 的端口，spec.ports.targetPort 定义了 Pod 容器的端口，这两个配置在其他类型的 service 中都有，且意义相同。

- **用途** : 适用于集群内部的服务通信，不暴露给外部。

- **示例应用场景** : 微服务之间相互调用。

2. **NodePort**

![NodePort工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190651734751719065172873.png)

- **功能** : 将 Service 暴露为每个节点（Node）上的静态端口（30000-32767），通过节点的 IP 地址和该端口，外部客户端可以访问服务。它仍然会分配一个 `ClusterIP`，所以集群内部也能访问该服务。

- **用途** : 外部客户端通过集群的任意节点 IP 和指定的端口访问服务。

- **示例应用场景** : 简单的外部访问，用于开发或测试环境。

3. **LoadBalancer**

![loadBalancer工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190655884871719065587171.png)

等于是在 nodePort service 之外又套了一个 loadBalancer，意味着创建了 loadBalancer，同时也创建了 nodePort 和 ClusterIP。

![17190658904841719065889152.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190658904841719065889152.png)

在生产环境中，出于安全考虑，应该用 Ingress 或者 loadBalancer service 处理外部请求，而不是 nodePort。

## 总结

这三种 service 类型，就像洋葱圈一样，一环套一环，从内向外，最里层是 ClusterIP，然后是 nodePort，再外一层是 loadBalancer。
