# SideTable

## 1. 概述

Side Table 是 iOS Runtime 中的一个辅助数据结构，用于<span class="emphasis">存储对象的额外信息。当对象的 ISA 指针无法存储所有信息时（比如引用计数过大、需要 weak 引用等），系统会创建 Side Table 来存储这些信息。</span>

## 2. 实际存储结构

**假设场景**：对象 p1（地址 0x1，引用计数=3，2个weak指针），对象 p2（地址 0x2，引用计数=5，2个weak指针）

<div id="sidetable-container"></div>

## 3. 各层结构说明

| 结构名称 | 类型 | 作用 | 层级 | Key-Value关系 |
|---------|------|------|------|--------------|
| **SideTable** | 结构体 | 存储对象的额外信息 | 第1层 | - |
| **refcnts** | RefcountMap（哈希表） | 存储引用计数 | 第2层 | Key: 对象地址, Value: size_t（简单整数） |
| **weak_table** | weak_table_t（结构体） | 哈希表结构，包含 weak_entries 数组指针和元数据 | 第2层 | 包含 weak_entries、num_entries、mask、max_hash_displacement 字段 |
| **weak_entries** | weak_entry_t*（数组） | 存储所有 weak_entry_t 的数组 | 第3层 | 数组元素为 weak_entry_t 结构体 |
| **weak_entry_t** | 结构体 | 存储单个对象的所有 weak 引用 | 第4层 | 包含 referent、inline_referrers、referrers 等字段 |

### 3.1. 结构层级说明

- **refcnts**：
  - SideTable → refcnts（类型为 RefcountMap，哈希表）
  - refcnts 中直接存储 Key-Value 对，Value 是简单的 size_t（整数）
  - 不需要单独展示 RefcountEntry，因为它只是哈希表中的一个条目概念

- **weak_table**：
  - SideTable → weak_table（类型为 weak_table_t，结构体）→ weak_entries（数组）→ weak_entry_t（结构体）
  - weak_table_t 是哈希表结构体，包含：
    - weak_entries：指向 weak_entry_t 数组的指针
    - num_entries：条目数量
    - mask：哈希表的掩码
    - max_hash_displacement：最大哈希位移
  - weak_entries 数组存储所有 weak_entry_t 结构体
  - weak_entry_t 是一个独立的结构体，包含字段：referent（对象地址）、inline_referrers（内联数组）、referrers（动态数组）、out_of_line（标志位）、num_refs（引用数量）等

## 4. StripedMap：SideTable 的存储容器

### 4.1. 为什么需要 StripedMap？

如果所有对象共享一个全局的 SideTable，那么每次访问 SideTable 都需要加锁，这会成为性能瓶颈。StripedMap 通过将多个 SideTable 分散存储，减少锁竞争，提高并发性能。

### 4.2. StripedMap 的结构

| 属性 | 类型 | 说明 |
|------|------|------|
| **array** | SideTable[64] | 包含 64 个 SideTable 的数组（iOS 中通常是 8 或 64 个） |
| **count** | 静态常量 | SideTable 的数量（通常是 8 或 64） |

### 4.3. 如何找到对象的 SideTable？

通过对象地址计算哈希值，从 StripedMap 中选择对应的 SideTable。具体流程如下：

#### 4.3.1. 查找步骤

| 步骤 | 操作 | 说明 |
|------|------|------|
| **1. 获取对象地址** | `void *p = (__bridge void *)obj` | 将对象指针转换为 void* |
| **2. 地址转整数** | `uintptr_t addr = (uintptr_t)p` | 将指针地址转换为无符号整数 |
| **3. 计算索引** | `index = (addr >> 4) & 63` | 右移4位后取低6位（64个SideTable需要6位） |
| **4. 获取 SideTable** | `SideTable& table = stripedMap.array[index]` | 从数组中取出对应索引的 SideTable |

#### 4.3.2. 代码实现

```cpp
// 实际实现（简化版）
SideTable& tableForPointer(const void *p) {
    // 1. 将对象地址转换为整数
    uintptr_t addr = reinterpret_cast<uintptr_t>(p);
    
    // 2. 计算索引：右移4位，然后与63（0x3F）做与运算
    //    这样可以得到 0-63 之间的索引值
    size_t index = (addr >> 4) & (STRIPED_MAP_COUNT - 1);
    // 等价于：index = (addr >> 4) & 63;
    
    // 3. 返回对应的 SideTable 引用
    return SideTablesMap.array[index];
}
```

#### 4.3.3. 示例

假设对象地址为 `0x100012340`：

- 地址转整数：`addr = 0x100012340`
- 右移4位：`addr >> 4 = 0x10001234`
- 与63做与运算：`0x10001234 & 0x3F = 0x34 = 52`
- 结果：使用 `SideTable[52]`

#### 4.3.4. 为什么右移4位？

- 对象地址通常是8字节对齐的（最低3位为0）
- 右移4位可以去除对齐位，同时保留足够的地址信息用于哈希
- 这样可以让不同对象更均匀地分布到64个 SideTable 中

### 4.4. 工作原理

| 步骤 | 说明 |
|------|------|
| **1. 计算索引** | 根据对象地址计算哈希值，取模得到 SideTable 的索引（0 到 63） |
| **2. 获取 SideTable** | 从 StripedMap 的数组中取出对应索引的 SideTable |
| **3. 加锁操作** | 只对选中的 SideTable 加锁，其他 SideTable 不受影响 |
| **4. 查找数据** | 在 SideTable 内部的哈希表中查找对象的数据（引用计数、weak 引用等） |

### 4.5. 优势

- **减少锁竞争**：不同对象可能使用不同的 SideTable，可以并发访问
- **提高性能**：多个线程可以同时操作不同的 SideTable，减少等待时间
- **简单高效**：通过地址哈希快速定位，O(1) 时间复杂度

### 4.6. 示例

假设有 3 个对象：

- 对象 A（地址 0x1000）：索引 = (0x1000 >> 4) & 63 = 0，使用 SideTable[0]
- 对象 B（地址 0x2000）：索引 = (0x2000 >> 4) & 63 = 0，使用 SideTable[0]（与 A 共享）
- 对象 C（地址 0x3000）：索引 = (0x3000 >> 4) & 63 = 0，使用 SideTable[0]（与 A、B 共享）

虽然多个对象可能共享同一个 SideTable，但 SideTable 内部使用哈希表存储，仍然可以快速区分不同对象的数据。

## 5. 完整存储结构

Side Table 存储在全局的 **StripedMap** 中（包含多个 SideTable 的数组），通过对象地址的哈希值选择使用哪个 SideTable。多个对象可以共享同一个 SideTable（通过 SideTable 内的哈希表区分）。

```cpp
// 全局 StripedMap 实例
static StripedMap<SideTable> SideTablesMap;

// 获取对象的 SideTable
SideTable& tableForPointer(const void *p) {
    return SideTablesMap.get(p);
}
```
