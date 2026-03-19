# Runloop 与绘制

本文整理自 [ibireme 深入理解 RunLoop](https://blog.ibireme.com/2015/05/18/runloop/)、[掘金：深入解析 iOS-RunLoop](https://juejin.cn/post/7484060429617381426)、[掘金：iOS的各个渲染框架以及iOS图层渲染原理](https://juejin.cn/post/7019193784806146079) 等文章。

RunLoop 是<span class="emphasis">界面更新的调度者</span>。当你在代码中修改了 Frame、调用 `setNeedsLayout` / `setNeedsDisplay` 后，实际执行 layout 和 display 的时机由 RunLoop 决定。

## 1. 源码（调用栈）

Observer 回调内部的调用栈（来自 ibireme 对 CFRunLoop 源码的整理）：

```
_ZN2CA11Transaction17observer_callbackEP19__CFRunLoopObservermPv()
QuartzCore:CA::Transaction::observer_callback:
CA::Transaction::commit();
CA::Context::commit_transaction();
CA::Layer::layout_and_display_if_needed();
CA::Layer::layout_if_needed();
[CALayer layoutSublayers];
[UIView layoutSubviews];
CA::Layer::display_if_needed();
[CALayer display];
[UIView drawRect];
```

对应关系：

| 调用 | 对应阶段 |
|------|----------|
| `layout_if_needed` → `layoutSubviews` | T1 Layout |
| `display_if_needed` → `drawRect` | T2 Display |
| `CA::Transaction::commit()` | T3 Commit |

## 2. 苹果注册的 Observer

App 启动后，主线程 RunLoop 的 common mode items 中会包含以下 Observer（节选自 ibireme 文章中的调试输出）：

```
CFRunLoopObserver {order = 1999000, activities = 0xa0, // BeforeWaiting | Exit
  callout = _afterCACommitHandler}
CFRunLoopObserver {order = 2000000, activities = 0xa0, // BeforeWaiting | Exit
  callout = _ZN2CA11Transaction17observer_callbackEP19__CFRunLoopObservermPv}
```

| 项目 | 内容 |
|------|------|
| **监听事件** | `kCFRunLoopBeforeWaiting`（即将进入休眠）、`kCFRunLoopExit`（即将退出） |
| **order** | 2000000，在 AutoreleasePool（order=2147483647）和手势识别（order=0）之间 |
| **回调** | `_ZN2CA11Transaction17observer_callbackEP19__CFRunLoopObservermPv` |
| **作用** | 遍历所有待处理的 UIView/CALayer，执行实际的绘制和调整，并更新 UI 界面 |

## 3. 完整流程（来自 ibireme）

当在操作 UI 时，比如改变了 Frame、更新了 UIView/CALayer 的层次时，或者手动调用了 `setNeedsLayout` / `setNeedsDisplay` 后：

| 步骤 | 说明 |
|------|------|
| **1. 标记** | 这个 UIView/CALayer 就被标记为待处理，并被提交到一个全局的容器去 |
| **2. 等待** | 不立即执行，等待 RunLoop 进入 BeforeWaiting 阶段 |
| **3. 回调** | 苹果注册的 Observer 触发，回调执行 `_ZN2CA11Transaction17observer_callbackEP19__CFRunLoopObservermPv` |
| **4. 执行** | 函数里会遍历所有待处理的 UIView/CALayer，执行 layout 和 display，并更新 UI 界面 |

::: tip 批量合并
系统并不会立马更新，而是在 RunLoop 休眠之前将这些更新操作合并成一次更新。这样同一 RunLoop 周期内的多次修改会被合并处理，减少重复绘制。
:::

## 4. 与绘制阶段的关系

| RunLoop 阶段 | 触发的绘制阶段 |
|--------------|----------------|
| BeforeWaiting | T1 Layout、T2 Display、T3 Commit |
| 说明 | 一次 RunLoop 周期内，在休眠前批量处理所有界面更新 |

详见 [T1 Layout 阶段](/绘制/02-T1Layout阶段.md)、[T2 Display 阶段](/绘制/03-T2Display阶段.md)、[T3 Commit 阶段](/绘制/04-T3Commit阶段.md)。

## 5. RunLoop 一次循环与一帧（来自掘金：iOS的各个渲染框架）

<span class="emphasis">RunLoop 一次循环只负责一帧相关的逻辑。</span> Core Animation 流水线将 Layout、Display、Commit、Decode、Draw Calls、Render、Display 等步骤分解到多个 RunLoop 周期中，通过流水线并行执行，才能满足 60 FPS（每帧 16.67ms）的刷新率。

| 阶段 | 与 RunLoop 的关系 |
|------|-------------------|
| **Commit Transaction** | 在完成对显示内容的计算之后，app 对图层进行打包，并在**下一次 RunLoop** 时将其发送至 Render Server |
| **Decode** | 打包好的图层传输到 Render Server 后解码，完成解码之后需要**等待下一个 RunLoop** 才会执行下一步 Draw Calls |
| **Display（显示）** | GPU 渲染结束后，需要等 render 结束的**下一个 RunLoop** 才触发显示 |

上述步骤串联执行所消耗的时间远远超过 16.67ms，因此需要分解到多次 RunLoop 中并行执行，每次 RunLoop 只处理一帧流水线中的一部分工作。

## 6. AsyncDisplayKit 的借鉴

AsyncDisplayKit（ASDK）仿照 QuartzCore/UIKit 框架的模式，实现了一套类似的界面更新机制：

| 项目 | 说明 |
|------|------|
| **做法** | 在主线程 RunLoop 中添加一个 Observer，监听 `kCFRunLoopBeforeWaiting` 和 `kCFRunLoopExit` |
| **时机** | 收到回调时，遍历所有之前放入队列的待处理任务，然后一一执行 |
| **目的** | 将排版、绘制等繁重任务放到后台，只在主线程 RunLoop 休眠前批量同步到 UIView/CALayer |

具体实现可参考 [_ASAsyncTransactionGroup](https://github.com/facebook/AsyncDisplayKit/blob/master/AsyncDisplayKit%2FDetails%2FTransactions%2F_ASAsyncTransactionGroup.m)。
