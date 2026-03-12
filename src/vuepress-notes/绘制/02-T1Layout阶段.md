# T1：Layout 阶段（布局计算）

| 项目 | 内容 |
|------|------|
| **时间点** | RunLoop 进入休眠前，或者手动调用 `layoutIfNeeded()` 时 |
| **触发时机** | RunLoop 的 `kCFRunLoopBeforeWaiting` 阶段，或者代码中显式调用 `view.layoutIfNeeded()` |
| **这个阶段发生了什么** | （见下方表格） |

## 执行步骤

| 步骤 | 操作 | 说明 |
|------|------|------|
| **1. 检查哪些视图需要布局** | 检查标记 | 系统只检查被标记为"需要布局"的视图；如果没有调用 `setNeedsLayout`，且系统也没有自动标记，这些视图不会执行 layout |
| **2. UIButton 的布局计算** | 布局子视图 | 只有被标记的视图才会执行；`layoutSubviews()` 被调用（如果 UIButton 覆写了这个方法）；UIButton 内部会布局它的子视图：`UIImageView` 的 frame、`UILabel` 的 frame；这些 frame 值会同步到对应的 Layer 的 frame |
| **3. Layer 的 frame 同步** | 同步几何属性 | UIView 的 frame → CALayer 的 frame；CALayer 的 frame → position、bounds、anchorPoint 等属性；此时 Layer 的几何属性才真正确定 |

**关键点**：

| 特性 | 说明 |
|------|------|
| **作用** | 只计算位置和大小，不进行绘制 |
| **contents 状态** | 所有 Layer 的 `contents` 仍然没有生成 |
| **确定内容** | 这个阶段确定的是"在哪里显示"和"显示多大" |

## Layout 和 Display 的区别

| 对比项 | Layout | Display |
|--------|--------|---------|
| **作用** | 计算位置和大小 | 生成显示内容 |
| **计算内容** | frame、bounds、center 等几何属性 | 生成 bitmap（contents） |
| **确定内容** | "在哪里显示"、"显示多大" | "显示什么" |

## 动画中为什么必须用 layoutIfNeeded()？

如果想做一个 `NSLayoutConstraint` 的动画，必须先修改 constant，然后在一个 `UIView.animate` 闭包里调用 `layoutIfNeeded()`。如果调用 `setNeedsLayout()`，动画会瞬间完成。

| 方法 | 执行方式 | 说明 |
|------|---------|------|
| `setNeedsLayout()` | 异步 | 只标记"需要布局"，实际布局会在 RunLoop 下一圈执行 |
| `layoutIfNeeded()` | 同步 | 立即执行布局计算 |

**为什么动画中必须用 layoutIfNeeded()**：

| 原因 | 说明 |
|------|------|
| **动画工作原理** | `UIView.animate` 闭包会捕获闭包执行时的视图状态；动画系统会在每一帧更新视图属性，产生动画效果 |
| **setNeedsLayout() 的问题** | 只是标记，不会立即执行；动画闭包立即结束，动画系统只看到开始和结束状态；等到 RunLoop 下一圈执行布局时，动画闭包已经结束了；结果：看不到动画效果，瞬间完成 |
| **layoutIfNeeded() 的优势** | 立即执行布局计算；动画系统可以捕获到布局变化的过程；每一帧都会更新布局，产生平滑的动画效果 |
