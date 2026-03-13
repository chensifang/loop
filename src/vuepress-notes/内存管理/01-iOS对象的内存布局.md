# iOS 对象的内存布局

## 1. 对象内存布局结构

```objective-c
@interface Animal : NSObject {
    NSString *_name;
}
@end

@interface Dog : Animal {
    int _age;
}
@end
```

<div id="memory-container"></div>

## 2. 内存布局说明

| 位置 | 内容 | 大小 | 说明 |
|------|------|------|------|
| **偏移 0** | `isa` 指针 | 8 字节 | 指向类对象，所有对象都有，偏移量固定为 0 |
| **偏移 8** | `_name` (NSString *) | 8 字节 | 来自 Animal 父类的实例变量 |
| **偏移 16** | `_age` (int) | 4 字节 | 来自 Dog 子类的实例变量 |
| **偏移 20** | 对齐填充 | 4 字节 | 使对象总大小为 24 字节（8 的倍数） |

## 3. 面试题：一个 NSObject 对象占用多少字节？

**注意**：这个问题特指 `NSObject` 这个基类对象，**不是所有继承自 NSObject 的对象**。

### 3.1. 答案

需要区分两个概念：

| 概念 | API | NSObject 的结果 | 说明 |
|------|-----|---------------|------|
| **对象实例大小** | `class_getInstanceSize` | 8 字节 | 对象实例变量实际占用的内存大小（只有 isa 指针） |
| **系统分配大小** | `malloc_size` | 16 字节 | 系统实际分配的内存大小（最小分配单位） |

### 3.2. 代码示例

```objective-c
NSObject *obj = [[NSObject alloc] init];
size_t instanceSize = class_getInstanceSize([NSObject class]);
size_t mallocSize = malloc_size((__bridge const void *)obj);
NSLog(@"实例大小: %zu, 分配大小: %zu", instanceSize, mallocSize);
// 输出：实例大小: 8, 分配大小: 16
```

### 3.3. 重要说明

| 对象类型 | 实例大小 | 系统分配大小 |
|---------|---------|-------------|
| **NSObject** | 8 字节 | 16 字节 |
| **有实例变量的对象**（如 Dog） | 8 + 实例变量大小 | ≥ 实例大小（取决于分配器） |

::: info 常见误解与正确理解
**常见误解**：认为所有继承自 NSObject 的对象都是 16 字节。

**正确理解**：只有 NSObject 本身是 8 字节（实例）/ 16 字节（分配）。有实例变量的对象大小会根据实例变量变化。
:::
