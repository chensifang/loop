# T3：CATransaction Commit 阶段（提交到 Render Server）

| 项目 | 内容 |
|------|------|
| **时间点** | Display 阶段之后，RunLoop 进入休眠前 |
| **触发时机** | RunLoop 的 `kCFRunLoopBeforeWaiting` 阶段，或者手动调用 `CATransaction.commit()` 时 |
| **这个阶段发生了什么** | （见下方表格） |

## 1. 执行步骤

| 步骤 | 操作 | 说明 |
|------|------|------|
| **1. CATransaction 的作用** | 事务机制 | CATransaction 是 Core Animation 的事务机制；用于批量处理多个 Layer 的更新，统一提交到 Render Server；每个 RunLoop 周期会自动创建一个隐式事务 |
| **2. 收集需要提交的 Layer** | 收集标记 | 系统收集所有被标记为"需要提交"的 Layer；包括所有在 t0、t1、t2 阶段被修改的 Layer |
| **3. 三种 Layer 树** | 构建树结构 | Model Tree、Presentation Tree、Render Tree（见下方表格） |
| **4. 构建 Render Tree** | 构建渲染树 | 根据 Model Tree（应用层的 Layer 树）构建 Render Tree；Render Tree 包含所有需要渲染的信息：几何属性、视觉属性、层级关系 |
| **5. 序列化 Layer 数据** | 序列化并发送 | 将 Render Tree 序列化成二进制数据；通过 IPC（进程间通信）发送到 Render Server（backboardd 进程） |

## 2. 三种 Layer 树

iOS 中有三种 Layer 树，它们在不同阶段发挥作用：

| 树类型 | 存在时间 | 位置 | 作用 |
|--------|---------|------|------|
| **Model Tree（模型树）** | t0 阶段开始，一直存在 | 应用进程内存中 | 存储 Layer 的最终状态（你设置的属性值） |
| **Presentation Tree（呈现树）** | 动画进行时 | 应用进程内存中 | 存储动画的中间值，供应用层查询（如 `layer.presentation()`） |
| **Render Tree（渲染树）** | t3 阶段构建，提交到 Render Server | Render Server 进程内存中 | 存储需要渲染的所有信息，用于实际渲染 |

**三种树的关系**：

| 时间线 | 操作 |
|--------|------|
| **t0-t2** | Model Tree（应用层设置属性） |
| **t3** | 根据 Model Tree 构建 Render Tree |
| **t3** | Render Tree 序列化，发送到 Render Server |
| **t4+** | Render Server 使用 Render Tree 进行渲染 |
| **动画时** | Model Tree（最终值） → Presentation Tree（中间值） → Render Tree（渲染） |

**关键点**：

- Commit 阶段不进行实际渲染，只是提交数据
- Render Server 是独立进程，与应用进程分离
- 所有 Layer 的更新会批量提交，提高效率

## 3. 动画和 RunLoop 的关系

**关键误解**：动画的每一帧渲染不是由 RunLoop 驱动的！

| 对比项 | RunLoop | Render Server | VSync |
|--------|---------|--------------|-------|
| **提交时机** | 休眠前会提交一次渲染（一次性提交，不是每帧都提交） | 收到提交后持续渲染 | 每秒 60 次信号 |
| **提交内容** | 动画的开始状态和结束状态，以及动画参数（时长、曲线等） | 根据动画参数计算每一帧的中间值 | 触发渲染信号 |
| **驱动方式** | RunLoop 驱动 | VSync 驱动 | 硬件驱动 |
| **频率** | 一次提交 | 60 次/秒 | 60 次/秒 |

**动画时的流程**：

| 阶段 | 操作 | 说明 |
|------|------|------|
| **t0** | 代码执行，设置动画 | 修改属性值 |
| **t1-t2** | Layout 和 Display | 如果需要 |
| **t3** | 提交动画到 Render Server | 提交起始值、结束值、动画参数，不是提交每一帧的值 |
| **动画开始后（Render Server 端）** | VSync 信号触发 | VSync 信号 1 → Render Server 计算第 1 帧的中间值 → GPU 渲染<br>VSync 信号 2 → Render Server 计算第 2 帧的中间值 → GPU 渲染<br>... |

## 4. Presentation Tree 的真正作用

**核心结论**：Render Server 才是计算中心

动画开始后，App 进程只提交一次，剩下的活儿全是 Render Server 的：

1. **App 进程（t3 阶段）**：把动画的"剧本"（起始值、终点值、时长、插值曲线函数）打包成一个 `CATransaction` 发送给 Render Server，只提交一次
2. **Render Server（动画过程中）**：它是独立进程，内部有一个由 VSync 驱动的计时器，每一帧根据"剧本"公式，自己计算出当前时刻位图应该在哪个坐标，直接命令 GPU 绘制，不依赖 App 进程的每帧计算
3. **App 进程（动画过程中）**：不需要参与每一帧的计算，即使主线程被卡死，动画依然会流畅地运行

**Presentation Tree 的本质**：它是一个"镜像查询接口"

| 特性 | 说明 |
|------|------|
| **计算时机** | 它不是被主动"计算"出来提交的，而是当你访问 `layer.presentation()` 时，UIKit 才去向 Render Server 询问（或者根据时间戳本地推算） |
| **主要用途** | 主要用于处理交互，比如一个移动的按钮，你点击时，需要知道它此刻在屏幕的什么位置 |
| **与 Render Server 的关系** | 是 Render Server 中当前帧状态在 App 进程中的投影 |

## 5. 两种动画的本质区别

| 对比项 | Core Animation 动画（显式或隐式动画） | 基于 CADisplayLink 的手动动画 |
|--------|-------------------------------------|---------------------------|
| **提交次数** | 1 次（提交剧本） | 每秒 60/120 次 |
| **执行者** | Render Server | App 进程（主线程） |
| **依赖关系** | 不依赖 App 进程的每帧计算 | App 进程每帧都计算和提交 |
| **性能** | 高效，即使主线程卡顿，动画依然流畅 | 非常消耗 CPU 性能 |
| **例子** | `UIView.animate`、`CABasicAnimation` 等 | 手动写了 `CADisplayLink`，并在回调里每帧修改 `view.center` |
