# CPU 绘制 vs GPU 绘制：本质区别

## 1. 核心理解

**关键点**：CPU 不能直接"画"到屏幕上，它只是在内存中生成位图数据。

| 概念 | 准确含义 | 位置 |
|------|---------|------|
| **CPU "绘制"** | 在内存中生成位图数据 | CPU 内存（RAM） |
| **GPU 绘制** | 把位图数据渲染到屏幕 | GPU 显存 → FrameBuffer → 屏幕 |

## 2. CPU "绘制"的真正含义

当我们说"CPU 绘制"时，实际上是指：

1. **在内存中创建位图**：系统在 CPU 内存中分配一块区域（Backing Store）
2. **计算像素数据**：CPU 执行代码，计算每个像素的颜色值
3. **写入内存**：将像素数据写入内存数组
4. **存储位图**：位图数据存入 `layer.contents`

**重要**：此时屏幕还没有任何变化，只是内存中有了图像数据。

## 3. GPU 绘制的真正含义

GPU 绘制才是真正显示到屏幕的过程：

1. **位图上传**：位图数据从 CPU 内存复制到 GPU 显存（变成纹理）
2. **GPU 渲染管线**：GPU 执行顶点着色、片段着色、光栅化等操作
3. **写入 FrameBuffer**：渲染结果写入帧缓冲区
4. **屏幕显示**：屏幕硬件读取 FrameBuffer，显示到屏幕

## 4. 完整流程对比

### 4.1. 示例：drawRect 的完整流程

```swift
class RedView: UIView {
    override func draw(_ rect: CGRect) {
        // 步骤 1：CPU 在内存中生成位图
        let context = UIGraphicsGetCurrentContext()
        context?.setFillColor(UIColor.red.cgColor)
        context?.fill(rect)
        // 此时：内存中有红色位图，屏幕还是空白
    }
}
```

| 时间 | 操作 | 位置 | 屏幕状态 |
|------|------|------|---------|
| **T0** | 代码执行，调用 `drawRect` | CPU | 空白 |
| **T1** | CPU 在内存中生成位图 | CPU 内存 | 空白 |
| **T2** | 位图存入 `layer.contents` | CPU 内存 | 空白 |
| **T3** | 提交到 Render Server | 进程间通信 | 空白 |
| **T4** | 位图上传到 GPU 显存 | GPU 显存 | 空白 |
| **T5** | GPU 渲染到 FrameBuffer | GPU | 空白 |
| **T6** | 屏幕显示 | 屏幕硬件 | ✅ 红色方块 |

## 5. 技术层面的区别

### 5.1. CPU "绘制"的本质

**CPU 绘制 = 在内存中生成位图数据**

| 操作 | 说明 |
|------|------|
| **创建位图内存** | 在 CPU 内存中分配 Backing Store（宽 × 高 × 4 字节） |
| **计算像素颜色** | CPU 执行代码，计算每个像素的 RGBA 值 |
| **写入内存数组** | 将像素数据写入内存的二维数组 |
| **存储位图** | 位图数据存入 `layer.contents` |

**关键**：所有操作都在 CPU 内存中进行，屏幕没有任何变化。

### 5.2. GPU 绘制的本质

**GPU 绘制 = 把位图数据渲染到屏幕**

| 操作 | 说明 |
|------|------|
| **读取位图数据** | 从 CPU 内存读取位图数据 |
| **上传到 GPU** | 位图数据复制到 GPU 显存（变成纹理） |
| **执行渲染管线** | GPU 执行顶点着色、片段着色、光栅化等 |
| **写入 FrameBuffer** | 渲染结果写入帧缓冲区 |
| **屏幕显示** | 屏幕硬件读取 FrameBuffer，显示到屏幕 |

**关键**：只有经过 GPU，数据才能显示到屏幕上。

## 6. 为什么说"CPU 绘制"？

这是习惯说法，更准确的表述是：

| 习惯说法 | 准确说法 |
|---------|---------|
| CPU 绘制 | CPU 生成位图数据 |
| GPU 绘制 | GPU 渲染位图到屏幕 |

## 7. 常见场景

### 7.1. 场景 1：drawRect（CPU 绘制）

```swift
class CustomView: UIView {
    override func draw(_ rect: CGRect) {
        // CPU 在内存中生成位图
        let context = UIGraphicsGetCurrentContext()
        context?.setFillColor(UIColor.blue.cgColor)
        context?.fillEllipse(in: rect)
        // 位图存入 layer.contents
        // 后续由 GPU 渲染到屏幕
    }
}
```

### 7.2. 场景 2：UIImageView（不需要 CPU 绘制）

```swift
let imageView = UIImageView(image: UIImage(named: "icon"))
// 图片解码成位图（CPU 操作）
// 位图存入 layer.contents
// GPU 直接渲染位图，不需要 drawRect
```

### 7.3. 场景 3：UILabel（文字光栅化）

```swift
let label = UILabel()
label.text = "Hello"
// Core Text 排版（CPU 操作）
// 文字光栅化成位图（CPU 操作）
// 位图存入 layer.contents
// GPU 直接渲染位图，不需要 drawRect
```

## 8. 总结

| 要点 | 说明 |
|------|------|
| **CPU "绘制"** | 在内存中生成位图数据，不直接显示到屏幕 |
| **GPU 绘制** | 把位图数据渲染到屏幕，用户才能看到 |
| **CPU 的作用** | 准备数据（生成位图） |
| **GPU 的作用** | 显示数据（渲染到屏幕） |
| **关键理解** | CPU 确实没有直接绘制到屏幕的能力，它只是准备数据；GPU 才是真正把数据显示到屏幕的硬件 |
