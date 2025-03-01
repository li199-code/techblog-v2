---
title: pytorch tutorial 笔记+注解
authors: Jason
tags: [pytorch, deep-learning]
abbrlink: 12cb415e
date: 2023-05-23 13:12:24
categories:
---

## 前言

pytorch，一个熟悉又陌生的朋友。以前用到它时，常常是哪里不会查哪里；等过一阵子又忘记了用法还得重新查。虽然毕业论文课题用到了框架，但是还处在拾人牙慧的阶段。这一次，经过前段时间 python 和 django 的学习，将提炼出来的学习经验用于 pytorch，先将官方文档的 tutorial 看完，然后看视频从零开始做一个项目。

## Tensor

Tensor 和 numpy 的 array 很相似，意味着一些 api 的名字和功能相同。介绍 Tensor 的创建时，官网列举的来源包含：python list、numpy array、继承另一个 tensor 的形状和数据类型、随机/全 1/全 0。但是，在实际训练中，你面对的是这样的 Tensor：

```
batch_size = 64

# Create data loaders.
train_dataloader = DataLoader(training_data, batch_size=batch_size)
test_dataloader = DataLoader(test_data, batch_size=batch_size)

for X, y in test_dataloader:
    print(f"Shape of X [N, C, H, W]: {X.shape}")
    print(f"Shape of y: {y.shape} {y.dtype}")
    break
```

X,y 都是 tensor。要理解 X 从哪里来的，我们从自定义 dataset 入手：

```
class CustomImageDataset(Dataset):
    def __init__(self, annotations_file, img_dir, transform=None, target_transform=None):
        self.img_labels = pd.read_csv(annotations_file)
        self.img_dir = img_dir
        self.transform = transform
        self.target_transform = target_transform

    def __len__(self):
        return len(self.img_labels)

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        image = read_image(img_path)
        label = self.img_labels.iloc[idx, 1]
        if self.transform:
            image = self.transform(image)
        if self.target_transform:
            label = self.target_transform(label)
        return image, label
```

read_image 的全称是 torchvision.io.read_image，将 jpeg 或者 png 读取为 uint8 的 tensor。在别的实例中，有可能在`transform`中添加一个 ToTensor()，ToTensor converts a PIL image or NumPy ndarray into a FloatTensor. and scales the image’s pixel intensity values in the range [0., 1.].

tensor 的属性只有三个：shape、dtype、device。其中 shape 和 size()经常搞混，得到错误提示：xxx 数据类型没有 shape 属性/size()方法，这里对他们做一个区分。

> 在 Python 和 PyTorch 中，以下数据类型具有 shape 属性：
> NumPy 数组（numpy.ndarray）：NumPy 是一个用于科学计算的 Python 库，其数组具有 shape 属性。可以使用 ndarray.shape 来获取数组的形状。
> PyTorch 张量（torch.Tensor）：PyTorch 是一个深度学习框架，其中的张量对象具有 shape 属性。可以使用 tensor.shape 来获取张量的形状。
> 需要注意的是，PyTorch 的张量类型包括 CPU 张量和 CUDA 张量，它们都具有 shape 属性。
> 在 PyTorch 中，size()方法和 shape 属性实际上是等价的，它们都用于获取张量的形状。因此，在 PyTorch 张量上使用 size()方法和使用 shape 属性将返回相同的结果。
> 在 PyTorch 中，shape 和 size()都返回一个 torch.Size 对象，它是一个元组子类，可以像元组一样进行索引操作。例如，对于形状为(2, 3)的张量，可以通过 shape[0]或 size()[0]来访问第一个维度的大小。
> 对于其他 Python 数据类型，如元组、列表或字符串，没有 shape 属性或 size()方法，可以使用 len()函数来获取元素的数量或长度。

## 数据加载

数据加载需要两个类：Dataset 和 DataLoader:

```
from torch.utils.data import Dataset, DataLoader
```

### Dataset

根据数据集的特点进行数据加载、预处理和标准化等操作。以前面的自定义 dataset 为例，它首先继承了 Dataset 类，然后分别实现了**init**, **len**, **getitem**方法。其中，**getitem**方法是最重要的，它可以实现文件从硬盘到内存的读取，然后转化为 tensor，以及可选的 transform 预处理步骤。

### Dataloader

**DataLoader**是一个数据加载器类，用于将 Dataset 中的数据分批加载到模型中进行训练或推理。它提供了多线程数据加载、批处理和数据随机打乱等功能。通过使用 DataLoader，你可以方便地迭代整个数据集，并按照指定的批次大小获取数据。

DataLoader 类接收一个 Dataset 对象作为参数，并可以配置以下参数：

- batch_size：指定每个批次的样本数量。
- shuffle：指定是否对数据进行随机打乱。
- num_workers：指定用于数据加载的线程数。

最重要的是，DataLoader 是一种可迭代序列，可以用 next 进行数据的读取：

```
train_features, train_labels = next(iter(train_dataloader))
```

在实际代码中，常使用 enumerate()函数。它返回一个生成器对象，该生成器生成索引-元素对：

```
for batch, (X, y) in enumerate(dataloader):
    X, y = X.to(device), y.to(device)
```

在上面这个例子中，batch 就是第几个 batch 的意思，(X, y)就是 Dataset 返回的元素和标签。所以上述代码将遍历一次整个数据集，按 batch 返回数据和 batch 的索引。

在这里可以引入 epoch 和 batch 的概念。epoch 表示完整扫描整个数据集的次数，batchsize 表示每次 epoch 中，计算一次损失需要读取的样本数量。而 batch 就是样本总数除以 batchsize 的取整。所以，一个 epoch 中会有若干个 batch。

> 批次大小的选择涉及到多个因素，包括内存限制、计算资源、模型性能等。较大的批次大小可以提高计算效率，但可能需要更多的内存，并且可能导致模型的收敛速度变慢。较小的批次大小可以减少内存占用，但可能导致计算效率降低。
> 通常，选择适当的批次大小需要进行实验和调整。一般而言，较大的批次大小在具有较大训练集和较强计算能力的情况下可以获得更好的性能，而较小的批次大小对于内存受限的情况或者需要更好的模型泛化能力的情况可能更合适。

### 读取数据时的 cpu 和 gpu

Dataset 中，数据通常会被预处理、转换为张量等操作，并在 CPU 上进行。然后，通过 DataLoader 将处理后的数据以指定的批量大小加载到内存中，并返回一个或多个批量的迭代器。在训练过程中，可以将这些批量数据移动到 GPU 上，并将其传递给模型进行训练或推断。完整的示例代码：

```
import torch
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        # 数据预处理和转换操作在CPU上进行
        sample = self.data[index]
        processed_sample = preprocess(sample)
        tensor_sample = torch.tensor(processed_sample, dtype=torch.float32)
        return tensor_sample

# 创建数据集
dataset = MyDataset(data)

# 创建数据加载器
batch_size = 32
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# 检查GPU是否可用
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 别忘了将网络模型也放到gpu中（如果可用）
model = Model().to(device)

# 在训练过程中，将批量数据移动到GPU上进行计算
for batch in dataloader:
    inputs = batch.to(device)
    targets = get_targets(batch)  # 假设有一个函数用于获取目标值
    targets = targets.to(device)

    # 在GPU上进行模型的训练或推断
    outputs = model(inputs)
    loss = loss_function(outputs, targets)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

```
