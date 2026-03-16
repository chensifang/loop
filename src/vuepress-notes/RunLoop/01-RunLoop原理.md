# RunLoop 原理

## 1. 概述

RunLoop 是<span class="emphasis">事件循环机制，让线程在有任务时执行、无任务时休眠，避免空转浪费 CPU。</span>主线程的 RunLoop 在应用启动时自动运行，子线程默认没有 RunLoop，需要手动开启。

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **事件源** | 产生事件的来源，分为 Source0（用户事件）和 Source1（系统事件） |
| **定时器** | Timer 也是一种事件源，注册到 RunLoop 后按时间触发 |
| **Observer** | 观察 RunLoop 的状态变化（即将处理 Source、即将休眠等） |
| **Mode** | RunLoop 的运行模式，不同 Mode 下监听不同的 Source/Timer |

### 2.1. Source0 和 Source1 的具体事件

| 类型 | 特点 | 具体事件 |
|------|------|----------|
| **Source0** | 非基于端口，需手动唤醒 RunLoop | 触摸事件、点击、手势；`performSelector:onThread:`；自定义 Source |
| **Source1** | 基于 mach_port，可主动唤醒 RunLoop | 系统事件（如锁屏、摇晃）；端口间通信；其他线程/进程通过 mach_port 发来的消息 |

**工作机制**：Source0 需要先 `CFRunLoopSourceSignal()` 标记，再 `CFRunLoopWakeUp()` 唤醒；Source1 通过 mach_msg 接收消息，能自动唤醒休眠中的 RunLoop。

## 3. CFRunLoop 与 NSRunLoop

- **CFRunLoop**：Core Foundation 层，C 接口，跨平台
- **NSRunLoop**：Foundation 层，OC 封装，是对 CFRunLoop 的简单包装

```swift
// 获取当前线程的 RunLoop
let runLoop = RunLoop.current

// 主线程 RunLoop
let mainRunLoop = RunLoop.main
```

## 4. RunLoop 的 Mode

| Mode | 说明 |
|------|------|
| **kCFRunLoopDefaultMode** | 默认模式，通常的滑动、点击等 |
| **UITrackingRunLoopMode** | 滑动 ScrollView 时切换，保证滑动流畅 |
| **kCFRunLoopCommonModes** | 占位 Mode，包含 Default + Tracking，注册到此的 Timer 两种场景都会触发 |

**常见问题**：把 NSTimer 加到 `RunLoop.main` 时，如果指定的是 DefaultMode，滑动列表时 Timer 会暂停，因为 RunLoop 切换到了 TrackingMode。解决：把 Timer 加到 `commonMode`。

## 5. RunLoop 的执行流程（简化）

```
1. 通知 Observer：即将处理 Source
2. 处理 Source0
3. 如果有 Source1，处理 Source1（通过 mach_msg 接收）
4. 处理 Timer
5. 通知 Observer：即将休眠
6. 休眠，等待被唤醒（mach_msg 阻塞）
7. 被唤醒后，通知 Observer
8. 根据唤醒原因处理（Source/Timer），回到步骤 1
```

## 6. 与主线程的关系

- 主线程的 RunLoop 在 `UIApplicationMain` 里被启动
- 触摸、网络回调、Timer、PerformSelector 等，都是通过 RunLoop 调度到主线程执行的
- 没有 RunLoop，主线程执行完就退出了，应用无法持续响应事件

## 7. 常见应用

- **NSTimer**：依赖 RunLoop，子线程需先 `RunLoop.current.run()` 或把 Timer 加到主线程 RunLoop
- **PerformSelector:afterDelay**：内部也是通过 Timer 实现
- **常驻线程**：在子线程里 `[[NSRunLoop currentRunLoop] run]`，配合 Source 保持线程存活
- **卡顿监控**：通过 Observer 监听 RunLoop 的 kCFRunLoopBeforeSources 和 kCFRunLoopAfterWaiting，计算两次回调之间的耗时
