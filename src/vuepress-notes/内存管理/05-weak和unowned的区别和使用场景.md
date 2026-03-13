# weak 和 unowned 的区别是什么？分别在什么场景下使用？

## 1. 核心区别

| 特性 | weak | unowned |
|------|------|---------|
| **引用计数** | 不增加 | 不增加 |
| **自动置 nil** | ✅ 是 | ❌ 否 |
| **类型要求** | 必须是可选类型 | 可以是非可选类型 |
| **安全性** | 安全（访问时为 nil 不会崩溃） | 不安全（对象释放后访问会崩溃） |
| **使用场景** | 不确定生命周期 | 确定被引用对象生命周期更长（不会先释放） |

## 2. 详细说明

### 2.1. weak 的特点

- **不增加引用计数**：weak 引用不会让对象的引用计数 +1
- **自动置为 nil**：当对象被释放时，weak 引用会自动变为 nil
- **必须是可选类型**：因为可能为 nil，所以必须是 `Optional` 类型
- **安全访问**：即使对象已释放，访问 weak 引用也不会崩溃（只是 nil）

**对象释放的本质：**

- 对象存储在**堆内存**中，有一个具体的**内存地址**（比如 0x1000）
- **对象释放** = 堆内存中这块地址的数据被清空/回收

**weak 引用自动置为 nil 的本质：**

- `weak var tenant: Person?` 这个变量存储的是一个**地址值**（指针）
- 当对象存在时，`tenant` 变量存储的是对象的地址（比如 0x1000）
- **weak 置为 nil** = 将 `tenant` 变量存储的地址值从 `0x1000` 改为 `nil`（0x0），也就是**清空指针**

### 2.2. unowned 的特点

- **不增加引用计数**：unowned 引用也不会让对象的引用计数 +1
- **不会自动置为 nil**：对象释放后，unowned 引用仍然指向原来的地址（无效内存）
- **可以是非可选类型**：因为假设对象不会被释放，所以可以是非可选类型
- **不安全访问**：如果对象已释放，访问 unowned 引用会崩溃

**生命周期要求：**

- 如果 `a.b` 是 unowned，那么 **b 的生命周期必须比 a 长**
- 如果 b 先释放了，a 还在，此时访问 `a.b` 就会崩溃（因为指向无效内存）
- 所以使用 unowned 的前提是：**被引用的对象（b）一定不会先于引用者（a）释放**

## 3. 使用场景

### 3.1. 使用 weak 的场景

| 场景 | 说明 | 示例 |
|------|------|------|
| **不确定生命周期** | 被引用的对象可能先释放 | 代理模式（delegate） |
| **代理模式** | delegate 通常用 weak | `weak var delegate: SomeDelegate?` |
| **父子关系** | 子对象引用父对象 | `weak var parent: Parent?` |
| **闭包捕获** | 闭包中捕获 self | `{ [weak self] in ... }` |

### 3.2. 使用 unowned 的场景

| 场景 | 说明 | 示例 |
|------|------|------|
| **确定生命周期** | 被引用对象生命周期更长 | Country 和 City 的关系 |
| **相互依赖初始化** | 两个对象相互引用，但生命周期确定 | Country 创建 City，City 用 unowned 引用 Country |

**正确示例：**

```swift
class Country {
    var capitalCity: City!
    var name: String
    
    init(name: String, capitalName: String) {
        self.name = name
        self.capitalCity = City(name: capitalName, country: self)
    }
}

class City {
    unowned let country: Country  // City 用 unowned 引用 Country
    var name: String
    
    init(name: String, country: Country) {
        self.name = name
        self.country = country
    }
}

// 为什么这里可以用 unowned？
// 因为 Country 的生命周期一定比 City 长（国家比城市先存在）
// Country 释放时，City 一定已经释放了
// 所以 City 用 unowned 引用 Country 是安全的
```

**错误示例：**

```swift
class A {
    unowned var b: B?  // a.b 是 unowned
}

var a = A()
var b = B()
a.b = b
b = nil  // b 释放了

print(a.b)  // 💥 崩溃！因为 b 已经释放，a.b 指向无效内存
```

## 4. 为什么实际开发中 weak 更常用？

| 原因 | 说明 |
|------|------|
| **安全性** | weak 更安全，即使对象已释放也不会崩溃 |
| **灵活性** | 不需要确定生命周期，适用场景更广 |
| **代码可维护性** | 不需要仔细分析生命周期关系，降低出错风险 |
| **可选类型** | 虽然需要可选类型，但可以通过 `guard let` 或 `if let` 安全处理 |

## 5. 什么场景使用 unowned 有优势

unowned 的优势主要体现在**相互依赖初始化**的场景中，因为可以使用非可选类型，带来代码简洁性和使用便利性。

### 5.1. 代码对比

**用 weak（可选类型）：**

```swift
class Country {
    var capitalCity: City!
    var name: String
    
    init(name: String, capitalName: String) {
        self.name = name
        self.capitalCity = City(name: capitalName, country: self)
    }
}

class City {
    weak var country: Country?  // 必须是可选类型
    var name: String
    
    init(name: String, country: Country) {
        self.name = name
        self.country = country
    }
    
    func getCountryName() -> String {
        // 每次访问都需要解包
        guard let country = country else {
            return "Unknown"
        }
        return country.name
    }
}
```

**用 unowned（非可选类型）：**

```swift
class Country {
    var capitalCity: City!
    var name: String
    
    init(name: String, capitalName: String) {
        self.name = name
        self.capitalCity = City(name: capitalName, country: self)
    }
}

class City {
    unowned let country: Country  // 非可选类型，更简洁
    var name: String
    
    init(name: String, country: Country) {
        self.name = name
        self.country = country
    }
    
    func getCountryName() -> String {
        // 直接访问，不需要解包
        return country.name
    }
}
```

### 5.2. unowned 的优势

| 优势 | 说明 | 实际对比 |
|------|------|---------|
| **代码更简洁** | 不需要可选类型，避免每次访问都要解包 | `weak var country: Country?` → 访问时需要 `country?.name` 或 `guard let country = country`<br>`unowned let country: Country` → 直接访问 `country.name` |
| **语义更清晰** | 明确表达"country 一定存在"的语义 | 非可选类型本身就表达了"这个对象一定存在"的含义 |
| **使用更方便** | 直接访问，不需要 `guard let` 或 `if let` | 避免了可选类型带来的额外代码 |
| **性能略好** | 不需要 Side Table 管理（但差异很小，通常不需要考虑） | 性能差异很小，通常不需要考虑 |

::: info 注意：
虽然 unowned 有这些优势，但必须确保生命周期关系正确，否则会崩溃。在实际开发中，如果对生命周期关系不确定，还是优先用 weak。
:::

## 6. 实际开发建议

| 场景 | 推荐 | 原因 |
|------|------|------|
| **大多数情况** | 优先用 `weak` | 更安全，适用场景广 |
| **代理模式** | 用 `weak` | delegate 可能随时被释放 |
| **闭包捕获** | 优先用 `[weak self]` | 不确定 self 的生命周期 |
| **相互依赖初始化** | 可以用 `unowned` | 如 Country 和 City，生命周期确定 |
| **需要非可选类型** | 可以用 `unowned` | 但必须确保生命周期关系 |

## 7. 关键点总结

| 方面 | 说明 |
|------|------|
| **weak** | 安全但必须是可选类型，适合不确定生命周期的场景 |
| **unowned** | 不安全但可以是非可选类型，适合确定生命周期的场景 |
| **选择原则** | 不确定用 weak，确定用 unowned |
| **闭包捕获** | 优先用 weak，确定生命周期用 unowned |
