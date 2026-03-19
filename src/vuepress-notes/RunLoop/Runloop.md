# Runloop

本文整理自以下高质量文章，对难懂之处适度加入白话解释。源码部分引自 ibireme 对 CFRunLoop 源码的整理。

- [ibireme 深入理解 RunLoop](https://blog.ibireme.com/2015/05/18/runloop/)
- [千行：从源码读懂 Runloop](https://kikido.github.io/2020/05/24/%E4%BB%8E%E6%BA%90%E7%A0%81%E8%AF%BB%E6%87%82-Runloop/)
- [掘金：深入解析 iOS-RunLoop：事件驱动的核心机制](https://juejin.cn/post/7484060429617381426)
- [掘金：iOS八股文（二十）Runloop探究](https://juejin.cn/post/7120430430846713863)
- [掘金：iOS 底层原理： Runloop 详解](https://juejin.cn/post/7011446603185651720)
- [掘金：15-探究iOS底层原理 RunLoop](https://juejin.cn/post/7116515606597206030)

## 概述

RunLoop 是<span class="emphasis">事件循环机制，让线程在有任务时执行、无任务时休眠，避免空转浪费 CPU。</span>

| 要点 | 说明 |
|------|------|
| 本质 | 一个对象，管理「接收消息 → 等待 → 处理」的循环 |
| 主线程 | 应用启动时自动创建并运行 |
| 子线程 | 默认没有，第一次获取时创建，需手动 `run` |

一般来讲，一个线程一次只能执行一个任务，执行完成后线程就会退出。RunLoop 提供了一种机制，让线程能随时处理事件但并不退出。其核心逻辑可以简化为：

```
function loop() {
  initialize();
  do {
    var message = get_next_message();
    process_message(message);
  } while (message != quit);
}
```

实现这种模型的关键在于：如何管理事件/消息，如何让线程在没有处理消息时休眠以避免资源占用、在有消息到来时立刻被唤醒。

::: tip 白话理解
线程没有 RunLoop 时，执行完入口函数就退出；有了 RunLoop，线程会一直停在循环里，有事件就处理，没事件就休眠等「电话」。
:::

## RunLoop 与线程的关系

苹果不允许直接创建 RunLoop，只提供 `CFRunLoopGetMain()` 和 `CFRunLoopGetCurrent()`。线程与 RunLoop 一一对应，关系保存在全局 Dictionary（key: `pthread_t`，value: `CFRunLoopRef`）。`_CFRunLoopGet` 核心逻辑：

```c
/// 全局的Dictionary，key 是 pthread_t， value 是 CFRunLoopRef
static CFMutableDictionaryRef loopsDic;
/// 访问 loopsDic 时的锁
static CFSpinLock_t loopsLock;

/// 获取一个 pthread 对应的 RunLoop。
CFRunLoopRef _CFRunLoopGet(pthread_t thread) {
  OSSpinLockLock(&loopsLock);
  if (!loopsDic) {
    // 第一次进入时，初始化全局Dic，并先为主线程创建一个 RunLoop。
    loopsDic = CFDictionaryCreateMutable();
    CFRunLoopRef mainLoop = _CFRunLoopCreate();
    CFDictionarySetValue(loopsDic, pthread_main_thread_np(), mainLoop);
  }
  /// 直接从 Dictionary 里获取。
  CFRunLoopRef loop = CFDictionaryGetValue(loopsDic, thread);
  if (!loop) {
    /// 取不到时，创建一个
    loop = _CFRunLoopCreate();
    CFDictionarySetValue(loopsDic, thread, loop);
    /// 注册一个回调，当线程销毁时，顺便也销毁其对应的 RunLoop。
    _CFSetTSD(..., thread, loop, __CFFinalizeRunLoop);
  }
  OSSpinLockUnLock(&loopsLock);
  return loop;
}

CFRunLoopRef CFRunLoopGetMain() {
  return _CFRunLoopGet(pthread_main_thread_np());
}

CFRunLoopRef CFRunLoopGetCurrent() {
  return _CFRunLoopGet(pthread_self());
}
```

- 线程刚创建时**没有** RunLoop
- 第一次调用 `CFRunLoopGetCurrent()` 时才会创建
- RunLoop 的销毁发生在线程结束时
- 主线程的 RunLoop 在首次获取时创建并存入 Dictionary

你只能在一个线程的内部获取其 RunLoop（主线程除外，可从任意线程获取主 RunLoop）。

## 核心数据结构

### 源码（CFRunLoop.c / CFRunLoop.m）

```c
// __CFRunLoop：RunLoop 本体
struct __CFRunLoop {
    CFRuntimeBase _base;
    pthread_mutex_t _lock;              // 访问 mode 列表的锁
    __CFPort _wakeUpPort;               // 用于 CFRunLoopWakeUp 唤醒
    Boolean _unused;
    volatile _per_run_data *_perRunData; // 每次运行时的数据
    pthread_t _pthread;                 // 绑定的线程
    uint32_t _winthread;
    CFMutableSetRef _commonModes;       // 标记为 Common 的 Mode 名称集合
    CFMutableSetRef _commonModeItems;   // 自动同步到所有 Common Mode 的 Source/Observer/Timer
    CFRunLoopModeRef _currentMode;      // 当前运行的 Mode
    CFMutableSetRef _modes;             // 所有 Mode 的集合
    struct _block_item *_blocks_head;   // CFRunLoopPerformBlock 的 block 链表
    struct _block_item *_blocks_tail;
    CFTypeRef _counterpart;
};
typedef struct __CFRunLoop * CFRunLoopRef;

// __CFRunLoopMode：每个 Mode 管理一组事件源
struct __CFRunLoopMode {
    CFRuntimeBase _base;
    pthread_mutex_t _lock;
    CFStringRef _name;                  // Mode 名称，如 kCFRunLoopDefaultMode
    Boolean _stopped;
    CFMutableSetRef _sources0;          // 非 port 的 Source，需手动 Signal + WakeUp
    CFMutableSetRef _sources1;           // 基于 mach_port 的 Source，可主动唤醒
    CFMutableArrayRef _observers;       // 观察者
    CFMutableArrayRef _timers;          // 定时器，与 NSTimer toll-free bridged
    CFMutableDictionaryRef _portToV1SourceMap;  // port 到 Source1 的映射
    __CFPortSet _portSet;               // 需要监听的 port 集合
    mach_port_t _timerPort;             // 定时器端口
};
typedef struct __CFRunLoopMode * CFRunLoopModeRef;

// 相关类型
typedef struct __CFRunLoopSource * CFRunLoopSourceRef;
typedef struct __CFRunLoopObserver * CFRunLoopObserverRef;
typedef struct __CFRunLoopTimer * CFRunLoopTimerRef;
```

<div id="runloop-structure-container"></div>

### 字段说明

| 结构 | 字段 | 说明 |
|------|------|------|
| CFRunLoop | _commonModes | Set，标记为 Common 的 Mode 名称集合 |
| CFRunLoop | _commonModeItems | Set，自动同步到所有 Common Mode 的 Source/Observer/Timer |
| CFRunLoop | _currentMode | 当前运行的 Mode |
| CFRunLoop | _modes | Set，所有 Mode 的集合 |
| CFRunLoop | _wakeUpPort | 用于 `CFRunLoopWakeUp()` 唤醒休眠中的 RunLoop |
| CFRunLoop | _blocks_head/_blocks_tail | `CFRunLoopPerformBlock` 加入的 block 链表 |
| CFRunLoopMode | _name | Mode 名称，如 kCFRunLoopDefaultMode、UITrackingRunLoopMode |
| CFRunLoopMode | _sources0 | Set，非 port 的 Source，需手动 Signal + WakeUp |
| CFRunLoopMode | _sources1 | Set，基于 mach_port 的 Source，可主动唤醒 RunLoop |
| CFRunLoopMode | _timers | Array，定时器，与 NSTimer toll-free bridged |
| CFRunLoopMode | _observers | Array，观察者，监听 Entry/BeforeTimers/BeforeSources/BeforeWaiting/AfterWaiting/Exit |
| CFRunLoopMode | _portSet | 所有需要监听的 mach port 集合，休眠时等待这些 port 的消息 |

**CFRunLoopObserverRef** 可观测的时间点：

| 常量 | 说明 |
|------|------|
| kCFRunLoopEntry | 即将进入 Loop |
| kCFRunLoopBeforeTimers | 即将处理 Timer |
| kCFRunLoopBeforeSources | 即将处理 Source |
| kCFRunLoopBeforeWaiting | 即将进入休眠 |
| kCFRunLoopAfterWaiting | 刚从休眠中唤醒 |
| kCFRunLoopExit | 即将退出 Loop |

::: tip 白话理解
Mode 像「场景」——默认场景处理日常事件，滑动场景只处理滑动。不同场景监听不同事件，互不干扰。
:::

## RunLoop 的 Mode

### Mode 数量

| 类型 | 数量 | 说明 |
|------|------|------|
| **可运行的 Mode** | 4 个 | DefaultMode、TrackingMode、UIInitializationRunLoopMode、GSEventReceiveRunLoopMode |
| **特殊占位** | 1 个 | CommonModes，不是真正的 Mode，用于操作 commonModeItems |

| Mode | 说明 |
|------|------|
| **kCFRunLoopDefaultMode** | App 平时所处的状态 |
| **UITrackingRunLoopMode** | 追踪 ScrollView 滑动时的状态 |
| **UIInitializationRunLoopMode** | 启动时第一个 Mode，启动完成后不再使用 |
| **GSEventReceiveRunLoopMode** | 接受系统事件的内部 Mode |
| **kCFRunLoopCommonModes** | 占位 Mode，没有实际作用，用于操作 commonModeItems |

### CommonModes 机制

**一句话**：把 Source/Timer/Observer 同步到所有被标记为 Common 的 Mode 里，这样无论 RunLoop 切到 DefaultMode 还是 TrackingMode，这些事件源都会在当前 Mode 里，都能被处理。

**触发条件**：加到 CommonModes 的 item 只会在 `_commonModes` 里的 Mode 下触发。即：只有当前 Mode 在 `_commonModes` 里时，加到 CommonModes 的 Timer 才会触发。

| 条件 | 说明 |
|------|------|
| **Timer 加到 `_commonModeItems`** | 用 `addTimer:forMode:NSRunLoopCommonModes` 时，Timer 会进 `_commonModeItems` |
| **当前 Mode 在 `_commonModes` 里** | 系统会把 `_commonModeItems` 里的 Timer 同步到 `_commonModes` 中的每一个 Mode |
| **结果** | Timer 会出现在 DefaultMode 和 TrackingMode 的 `_timers` 里，所以在这两个 Mode 下都会触发 |

**`_commonModes` 默认内容**：系统默认把 DefaultMode 和 TrackingMode 加入，无需手动添加。可用 `CFRunLoopAddCommonMode(runLoop, modeName)` 把自定义 Mode 也标记为 Common。

**滑动时 Timer 不触发的详细流程**：

| 时刻 | 发生的事 | Timer 会触发吗？ |
|------|----------|-----------------|
| T1 | 手指按下，开始滑动 TableView | Mode 切到 TrackingMode |
| T2 | 1 秒到了，Timer 该触发 | ❌ 不触发，因为 Timer 在 DefaultMode，当前是 TrackingMode |
| T3 | 手指松开，停止滑动 | Mode 切回 DefaultMode |
| T4 | 回到 DefaultMode 后 | Timer 才会继续触发 |

**加到 CommonModes 后**：Timer 被同步到 DefaultMode 和 TrackingMode 的 `_timers`，无论当前是哪个 Mode，Timer 都在当前 Mode 里，滑动时也会触发。

## Source0 与 Source1

| 类型 | 特点 | 能否主动唤醒 | 典型事件 |
|------|------|-------------|----------|
| **Source0** | 非基于 port，只有回调函数 | 否，需 Signal + WakeUp | 触摸分发、`performSelector:onThread:`、自定义 |
| **Source1** | 基于 mach_port + 回调 | 是 | 硬件事件接收、`dispatch_async(main)`、端口消息 |

**Source0 使用方式**：先调用 `CFRunLoopSourceSignal(source)` 标记为待处理，再手动调用 `CFRunLoopWakeUp(runloop)` 唤醒 RunLoop。

**Source1 原理**：包含 mach_port 和回调，用于通过内核与其他线程相互发送消息，能主动唤醒 RunLoop 的线程。

**触摸事件完整链路**：

```uml
@startuml
participant "硬件" as HW
participant "IOKit" as IOKit
participant "SpringBoard" as SB
participant "Source1" as S1
participant "Source0" as S0
participant "UIApplication" as App

HW -> IOKit: 触摸事件
IOKit -> IOKit: 生成 IOHIDEvent
IOKit -> SB: SpringBoard 接收
SB -> S1: mach port 转发
note right of S1: __IOHIDEventSystemClientQueueCallback\n唤醒 RunLoop
S1 -> S0: 触发 Source0
S0 -> App: _UIApplicationHandleEventQueue\n分发 UIEvent
App -> App: 识别手势、发送给 UIWindow
@enduml
```

所以断点在按钮回调时看到的是 Source0，但**唤醒**是 Source1 完成的。

::: tip 白话理解
Source1 是「门铃」——有人按就醒；Source0 是「待办」——得先标记，再手动叫醒 RunLoop 才能处理。
:::

## Timer 与 Observer

**CFRunLoopTimerRef** 与 NSTimer 是 toll-free bridged。包含时间长度和回调，加入 RunLoop 后会在对应时间点被唤醒执行。Timer 有 Tolerance（宽容度），允许一定误差。若某时间点被错过（如执行了长任务），该次回调会跳过，不会延后执行。Observer 可观测的时间点见上文表格。

## RunLoop 内部逻辑

核心流程：`__CFRunLoopRun` 是真正的循环体，流程图 + 阶段表如下，完整源码见折叠。

```uml
@startuml
start
:1. 通知 Observers: Entry;
repeat
  :2. 通知 Observers: BeforeTimers;
  :3. 通知 Observers: BeforeSources;
  :4. 执行 __CFRunLoopDoBlocks;
  :5. 触发 Source0 回调;
  :6. 再次执行 DoBlocks;
  if (Source1/dispatch 有消息?) then (是)
    :直接 goto handle_msg;
  else (否)
    :7. 通知 Observers: BeforeWaiting;
    :8. mach_msg 休眠等待;
    :9. 被唤醒;
    :10. 通知 Observers: AfterWaiting;
    :handle_msg;
  endif
  
  if (livePort 类型?) then (Timer)
    :执行 Timer 回调;
  elseif (dispatch)
    :执行 main queue 的 block;
  else (Source1)
    :执行 Source1 回调;
  endif
  
  :11. 再次执行 DoBlocks;
  
  if (继续循环?) then (是)
  else (否)
    stop
  endif
@enduml
```

| 阶段 | 说明 |
|------|------|
| DoBlocks | 执行 `CFRunLoopPerformBlock` 加入的 block |
| DoSources0 | 处理已 Signal 的 Source0 |
| mach_msg 休眠 | 线程阻塞等待 port 消息，**有消息才唤醒** |
| handle_msg | 根据 livePort 判断：Timer / dispatch / Source1 |

::: info 唤醒来源
RunLoop 休眠时，只有这些情况会唤醒：Source1 收到 port 消息、Timer 到时、`dispatch_async(main)`、`CFRunLoopWakeUp()`。不是轮询，是「等电话」。
:::

::: details 完整源码（CFRunLoop.c 整理）
```c
/// 用DefaultMode启动
void CFRunLoopRun(void) {
  CFRunLoopRunSpecific(CFRunLoopGetCurrent(), kCFRunLoopDefaultMode, 1.0e10, false);
}

/// 用指定的Mode启动，允许设置RunLoop超时时间
int CFRunLoopRunInMode(CFStringRef modeName, CFTimeInterval seconds, Boolean stopAfterHandle) {
  return CFRunLoopRunSpecific(CFRunLoopGetCurrent(), modeName, seconds, returnAfterSourceHandled);
}

/// RunLoop的实现
int CFRunLoopRunSpecific(runloop, modeName, seconds, stopAfterHandle) {
  /// 首先根据modeName找到对应mode
  CFRunLoopModeRef currentMode = __CFRunLoopFindMode(runloop, modeName, false);
  /// 如果mode里没有source/timer/observer, 直接返回。
  if (__CFRunLoopModeIsEmpty(currentMode)) return;
  /// 1. 通知 Observers: RunLoop 即将进入 loop。
  __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopEntry);
  /// 内部函数，进入loop
  __CFRunLoopRun(runloop, currentMode, seconds, returnAfterSourceHandled) {
    Boolean sourceHandledThisLoop = NO;
    int retVal = 0;
    do {
      /// 2. 通知 Observers: RunLoop 即将触发 Timer 回调。
      __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeTimers);
      /// 3. 通知 Observers: RunLoop 即将触发 Source0 (非port) 回调。
      __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeSources);
      /// 执行被加入的block
      __CFRunLoopDoBlocks(runloop, currentMode);
      /// 4. RunLoop 触发 Source0 (非port) 回调。
      sourceHandledThisLoop = __CFRunLoopDoSources0(runloop, currentMode, stopAfterHandle);
      /// 执行被加入的block
      __CFRunLoopDoBlocks(runloop, currentMode);
      /// 5. 如果有 Source1 (基于port) 处于 ready 状态，直接处理这个 Source1 然后跳转去处理消息。
      if (__Source0DidDispatchPortLastTime) {
        Boolean hasMsg = __CFRunLoopServiceMachPort(dispatchPort, &msg)
        if (hasMsg) goto handle_msg;
      }
      /// 通知 Observers: RunLoop 的线程即将进入休眠(sleep)。
      if (!sourceHandledThisLoop) {
        __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopBeforeWaiting);
      }
      /// 7. 调用 mach_msg 等待接受 mach_port 的消息。线程将进入休眠, 直到被下面某一个事件唤醒。
      /// • 一个基于 port 的Source 的事件。
      /// • 一个 Timer 到时间了
      /// • RunLoop 自身的超时时间到了
      /// • 被其他什么调用者手动唤醒
      __CFRunLoopServiceMachPort(waitSet, &msg, sizeof(msg_buffer), &livePort) {
        mach_msg(msg, MACH_RCV_MSG, port); // thread wait for receive msg
      }
      /// 8. 通知 Observers: RunLoop 的线程刚刚被唤醒了。
      __CFRunLoopDoObservers(runloop, currentMode, kCFRunLoopAfterWaiting);
      /// 收到消息，处理消息。
handle_msg:
      /// 9.1 如果一个 Timer 到时间了，触发这个Timer的回调。
      if (msg_is_timer) {
        __CFRunLoopDoTimers(runloop, currentMode, mach_absolute_time())
      }
      /// 9.2 如果有dispatch到main_queue的block，执行block。
      else if (msg_is_dispatch) {
        __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__(msg);
      }
      /// 9.3 如果一个 Source1 (基于port) 发出事件了，处理这个事件
      else {
        CFRunLoopSourceRef source1 = __CFRunLoopModeFindSourceForMachPort(runloop, currentMode, livePort);
        sourceHandledThisLoop = __CFRunLoopDoSource1(runloop, currentMode, source1, msg);
        if (sourceHandledThisLoop) {
          mach_msg(reply, MACH_SEND_MSG, reply);
        }
      }
      /// 执行加入到Loop的block
      __CFRunLoopDoBlocks(runloop, currentMode);
      if (sourceHandledThisLoop && stopAfterHandle) {
        /// 进入loop时参数说处理完事件就返回。
        retVal = kCFRunLoopRunHandledSource;
      } else if (timeout) {
        /// 超出传入参数标记的超时时间了
        retVal = kCFRunLoopRunTimedOut;
      } else if (__CFRunLoopIsStopped(runloop)) {
        /// 被外部调用者强制停止了
        retVal = kCFRunLoopRunStopped;
      } else if (__CFRunLoopModeIsEmpty(runloop, currentMode)) {
        /// source/timer/observer一个都没有了
        retVal = kCFRunLoopRunFinished;
      }
      /// 如果没超时，mode里没空，loop也没被停止，那继续loop。
    } while (retVal == 0);
  }
  /// 10. 通知 Observers: RunLoop 即将退出。
  __CFRunLoopDoObservers(rl, currentMode, kCFRunLoopExit);
}
```
:::

RunLoop 本质就是一个 do-while 循环，调用 `CFRunLoopRun()` 后线程会停留在此循环，直到超时或被手动停止。

## RunLoop 的底层实现

RunLoop 的核心基于 **mach port**，进入休眠时调用 `mach_msg()`。苹果系统架构自上而下分为：应用层、应用框架层（Cocoa）、核心框架层、Darwin（XNU 内核）。Darwin 由 Mach、BSD、IOKit 等组成。

**Mach** 是微内核，提供处理器调度、IPC 等基础服务。Mach 中进程、线程、虚拟内存都是「对象」，对象间不能直接调用，只能通过**消息传递**。消息在端口（port）之间传递，头部定义 local_port 与 remote_port，发送和接收通过同一 API `mach_msg()`，option 标记方向。RunLoop 休眠时调用 `mach_msg()` 接收消息，无消息时内核将线程置于等待；模拟器暂停时主线程调用栈会停在 `mach_msg_trap()`。

::: details mach_msg 定义
```c
typedef struct {
  mach_msg_header_t header;
  mach_msg_body_t body;
} mach_msg_base_t;

typedef struct {
  mach_msg_bits_t msgh_bits;
  mach_msg_size_t msgh_size;
  mach_port_t msgh_remote_port;
  mach_port_t msgh_local_port;
  mach_port_name_t msgh_voucher_port;
  mach_msg_id_t msgh_id;
} mach_msg_header_t;

mach_msg_return_t mach_msg(
  mach_msg_header_t *msg,
  mach_msg_option_t option,
  mach_msg_size_t send_size,
  mach_msg_size_t rcv_size,
  mach_port_name_t rcv_name,
  mach_msg_timeout_t timeout,
  mach_port_name_t notify);
```
:::

::: details 断点调试时调用栈对照
```c
{
  /// 1. 通知Observers，即将进入RunLoop
  /// 此处有Observer会创建AutoreleasePool: _objc_autoreleasePoolPush();
  __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopEntry);
  do {
    /// 2. 通知 Observers: 即将触发 Timer 回调。
    __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopBeforeTimers);
    /// 3. 通知 Observers: 即将触发 Source (非基于port的,Source0) 回调。
    __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopBeforeSources);
    __CFRUNLOOP_IS_CALLING_OUT_TO_A_BLOCK__(block);
    /// 4. 触发 Source0 (非基于port的) 回调。
    __CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__(source0);
    __CFRUNLOOP_IS_CALLING_OUT_TO_A_BLOCK__(block);
    /// 6. 通知Observers，即将进入休眠
    /// 此处有Observer释放并新建AutoreleasePool: _objc_autoreleasePoolPop(); _objc_autoreleasePoolPush();
    __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopBeforeWaiting);
    /// 7. sleep to wait msg.
    mach_msg() -> mach_msg_trap();
    /// 8. 通知Observers，线程被唤醒
    __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopAfterWaiting);
    /// 9. 如果是被Timer唤醒的，回调Timer
    __CFRUNLOOP_IS_CALLING_OUT_TO_A_TIMER_CALLBACK_FUNCTION__(timer);
    /// 9. 如果是被dispatch唤醒的，执行所有调用 dispatch_async 等方法放入main queue 的 block
    __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__(dispatched_block);
    /// 9. 如果如果Runloop是被 Source1 (基于port的) 的事件唤醒了，处理这个事件
    __CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE1_PERFORM_FUNCTION__(source1);
  } while (...);
  /// 10. 通知Observers，即将退出RunLoop
  /// 此处有Observer释放AutoreleasePool: _objc_autoreleasePoolPop();
  __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__(kCFRunLoopExit);
}
```
:::

## 苹果用 RunLoop 实现的功能

### AutoreleasePool

App 启动后，苹果在主线程 RunLoop 注册了两个 Observer，回调都是 `_wrapRunLoopWithAutoreleasePoolHandler`。

- **第一个 Observer** 监视 Entry，order 为 -2147483647（最高优先级），回调内调用 `_objc_autoreleasePoolPush()` 创建自动释放池
- **第二个 Observer** 监视 BeforeWaiting 和 Exit，order 为 2147483647（最低优先级），BeforeWaiting 时调用 `_objc_autoreleasePoolPop()` 和 `_objc_autoreleasePoolPush()` 换池，Exit 时调用 `_objc_autoreleasePoolPop()` 释放

主线程执行的代码通常写在事件回调、Timer 回调内，这些回调会被 RunLoop 创建好的 AutoreleasePool 环绕，所以不会出现内存泄漏。

### 事件响应

苹果注册了一个 Source1（基于 mach port）接收系统事件，回调为 `__IOHIDEventSystemClientQueueCallback()`。硬件事件发生后，IOKit 生成 IOHIDEvent，SpringBoard 接收后用 mach port 转发给 App。Source1 触发后调用 `_UIApplicationHandleEventQueue()` 进行应用内部分发，处理成 UIEvent，识别 UIGesture、处理屏幕旋转、发送给 UIWindow 等。UIButton 点击、touchesBegin/Move/End 等都在此完成。

### 手势识别

当 `_UIApplicationHandleEventQueue()` 识别了手势时，会先 Cancel 当前的 touches 系列回调，随后将 UIGestureRecognizer 标记为待处理。苹果注册的 Observer 监测 BeforeWaiting，回调 `_UIGestureRecognizerUpdateObserver()` 会获取所有待处理的 GestureRecognizer 并执行其回调。

### 界面更新

RunLoop 在 BeforeWaiting 阶段通过 Observer 触发 layout 和 display，详见 [Runloop 与绘制](./02-Runloop与绘制.md)。

### 定时器

NSTimer 就是 CFRunLoopTimerRef。RunLoop 会为其重复的时间点注册事件。Timer 有 Tolerance 属性，容许一定误差。若某时间点被错过（如执行了长任务），该次回调会跳过。CADisplayLink 与屏幕刷新率一致，内部实现与 NSTimer 不同，实际是操作了 Source。

### PerformSelector

`performSelector:afterDelay:` 内部创建 **Timer** 并添加到当前线程 RunLoop。`performSelector:onThread:` 内部创建 **Source0**（非 Timer），加到目标线程。若目标线程没有 RunLoop，这两个方法都会失效。

### GCD 与主队列

当调用 `dispatch_async(dispatch_get_main_queue(), block)` 时，libdispatch 向主线程 RunLoop 发送消息，RunLoop 被唤醒，在 `__CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__` 回调中执行 block。此逻辑仅限 dispatch 到主线程，dispatch 到其他线程由 libdispatch 处理。

### 网络请求

NSURLConnection 的 start 会在 CurrentRunLoop 的 DefaultMode 添加 4 个 Source0。NSURLConnection 会创建 `com.apple.NSURLConnectionLoader` 和 `com.apple.CFSocket.private` 线程。Loader 线程用 RunLoop 接收底层 socket 事件，通过 Source0 通知上层 Delegate。NSURLSession 底层仍用到 NSURLConnection 部分功能。

## 常见问题与误区

| 问题 | 原因 | 解决 |
|------|------|------|
| 滑动时 Timer 不触发 | Mode 切到 Tracking，Timer 在 Default | 把 Timer 加到 `NSRunLoopCommonModes` |
| `dispatch_async(main)` 与 `CFRunLoopPerformBlock` | 前者通过 port 唤醒，后者不唤醒 | 需要主动唤醒时用后者+WakeUp |
| 主线程同步下载时进度条不更新 | 主线程阻塞，RunLoop 卡住 | 用异步 API，框架会 dispatch 到 main |
| `reloadData` 后 dispatch 的 block 不一定在渲染后执行 | reloadData 只标记，实际渲染在 BeforeWaiting | 用 CADisplayLink 或 RunLoop Observer 监听渲染完成 |

::: warning performSelector 的 Source 类型
`performSelector:afterDelay:` 创建 **Timer**；`performSelector:onThread:` 创建 **Source0**，不是 Timer。评论区有读者验证过。
:::

## 应用场景

**线程保活**：子线程 `addPort` + `run`，用 `performSelector:onThread:` 投递任务。AFNetworking 的 AFURLConnectionOperation 单独创建线程并启动 RunLoop，`run` 前添加 NSMachPort 避免 Mode 为空导致立即退出；任务通过 `performSelector:onThread:` 投递到后台线程 RunLoop。

::: details AFNetworking 线程保活示例
```objc
+ (void)networkRequestThreadEntryPoint:(id)__unused object {
  @autoreleasepool {
    [[NSThread currentThread] setName:@"AFNetworking"];
    NSRunLoop *runLoop = [NSRunLoop currentRunLoop];
    [runLoop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
    [runLoop run];
  }
}

+ (NSThread *)networkRequestThread {
  static NSThread *_networkRequestThread = nil;
  static dispatch_once_t oncePredicate;
  dispatch_once(&oncePredicate, ^{
    _networkRequestThread = [[NSThread alloc] initWithTarget:self selector:@selector(networkRequestThreadEntryPoint:) object:nil];
    [_networkRequestThread start];
  });
  return _networkRequestThread;
}

- (void)start {
  [self.lock lock];
  if ([self isCancelled]) {
    [self performSelector:@selector(cancelConnection) onThread:[[self class] networkRequestThread] withObject:nil waitUntilDone:NO modes:[self.runLoopModes allObjects]];
  } else if ([self isReady]) {
    self.state = AFOperationExecutingState;
    [self performSelector:@selector(operationDidStart) onThread:[[self class] networkRequestThread] withObject:nil waitUntilDone:NO modes:[self.runLoopModes allObjects]];
  }
  [self.lock unlock];
}
```
:::

**NSTimer 与 Mode**：滑动场景需 CommonModes，否则 Timer 会暂停。

**卡顿监控**：Observer 监听 BeforeSources 与 AfterWaiting，计算两次回调间隔，超过阈值则认为卡顿。

**AsyncDisplayKit**：在主线程 RunLoop 添加 Observer 监听 BeforeWaiting 和 Exit，在回调中遍历队列里的待处理任务，批量提交异步排版结果到主线程的 UIView/CALayer。
