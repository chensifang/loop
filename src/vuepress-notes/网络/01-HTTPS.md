# HTTPS

## 1. 第一层：HTTP 的问题

**问题**：HTTP 是明文传输，数据在网络上以明文形式传输，任何人都可以读取。

```uml
@startuml
participant "客户端" as Client
participant "攻击者 (MITM)" as Attacker
participant "服务器" as Server

note over Client, Server: HTTP 明文传输，数据完全暴露

Client -> Attacker: 发送请求 (明文: 用户名/密码)
note right of Attacker: 攻击者可以读取所有数据
Attacker -> Server: 转发请求 (可篡改内容)
Server --> Attacker: 返回响应 (明文数据)
note right of Attacker: 攻击者可以窃听、篡改、伪造数据
Attacker --> Client: 转发响应 (可插入恶意代码)
@enduml
```

> **问题总结**：明文传输导致数据完全暴露，攻击者可以窃听、篡改、伪造数据。

## 2. 第二层：对称加密解决了什么问题

**解决方案**：使用对称加密加密数据，客户端和服务器共享密钥 K。

**解决了**：明文传输问题。即使被截获，攻击者没有密钥 K，无法解密。

```uml
@startuml
participant "客户端" as Client
participant "攻击者" as Attacker
participant "服务器" as Server

note over Client, Server: 使用对称加密 K 加密数据

Client -> Server: 如何安全地分发密钥 K？
note over Client, Server: 密钥分发问题

Client -> Attacker: 如果明文传输密钥 K
note right of Attacker: 攻击者截获密钥 K
Attacker -> Server: 转发密钥 K
Server --> Attacker: 返回加密数据 E(K, 数据)
note right of Attacker: 攻击者用密钥 K 解密，仍然可以窃听
Attacker --> Client: 转发数据

note over Client, Server: 新问题：如何安全地分发密钥？
@enduml
```

> **新问题**：密钥 K 如何安全地分发给客户端和服务器？如果通过网络明文传输 K，攻击者可以截获 K，加密失效。

## 3. 第三层：非对称加密解决了什么问题

**解决方案**：使用非对称加密解决密钥分发问题。服务器生成公钥 K_pub（公开）和私钥 K_priv（保密）。

**解决了**：密钥分发问题。即使攻击者截获了加密的对称密钥，没有私钥 K_priv 也无法解密。

```uml
@startuml
participant "客户端" as Client
participant "攻击者 (MITM)" as Attacker
participant "服务器" as Server

note over Client, Server: 使用非对称加密解决密钥分发

Server -> Server: 生成公钥 K_pub & 私钥 K_priv
Server -> Client: 发送公钥 K_pub (明文)
note right of Attacker: 攻击者也可以截获 K_pub

Client -> Client: 生成对称密钥 K_session
Client -> Attacker: 用 K_pub 加密 K_session: E(K_pub, K_session)
note right of Attacker: 攻击者截获但无法解密（没有私钥 K_priv）
Attacker -> Server: 转发 E(K_pub, K_session)
Server -> Server: 用私钥 K_priv 解密获得 K_session

note over Client, Server: 双方现在都有 K_session，开始对称加密通信
Client -> Server: E(K_session, 数据)
Server -> Client: E(K_session, 响应)

note right of Attacker: 攻击者无法解密（没有 K_session）

note over Client, Server: 新问题：如何确保 K_pub 是服务器的，而不是攻击者的？
@enduml
```

> **新问题**：如何确保客户端拿到的公钥 K_pub 确实是服务器的，而不是攻击者伪造的？攻击者可以伪装成服务器，发送自己的公钥 K_attacker_pub，中间人攻击仍然存在。

## 4. 第四层：数字证书解决了什么问题

**解决方案**：使用数字证书验证服务器身份。CA（证书颁发机构）用私钥对服务器信息（域名、公钥等）签名，生成证书。

**解决了**：身份验证问题。攻击者无法伪造证书（没有 CA 的私钥），无法伪装成服务器。

```uml
@startuml
participant "客户端" as Client
participant "攻击者 (MITM)" as Attacker
participant "服务器" as Server
participant "证书机构 (CA)" as CA

note over Client, Server: 使用数字证书验证服务器身份

Server -> Server: 生成公钥 K_server_pub & 私钥 K_server_priv
Server -> CA: 申请证书（包含域名、K_server_pub）
CA -> CA: 用 CA 私钥签名生成证书 Cert
CA -> Server: 返回证书 Cert

Server -> Client: 发送证书 Cert（包含 K_server_pub）
note right of Attacker: 攻击者尝试伪造证书
Attacker -> Client: 发送伪造证书（无法通过 CA 签名验证）
Client -> Client: 用 CA 公钥验证证书签名
note left of Client: 伪造证书验证失败，拒绝连接

Client -> Client: 验证通过，提取 K_server_pub
Client -> Client: 生成对称密钥 K_session
Client -> Server: 用 K_server_pub 加密 K_session: E(K_server_pub, K_session)
Server -> Server: 用私钥 K_server_priv 解密获得 K_session

note over Client, Server: 双方现在都有 K_session，开始对称加密通信
Client -> Server: E(K_session, 数据)
Server -> Client: E(K_session, 响应)

note right of Attacker: 攻击者无法伪造证书，无法伪装成服务器，无法窃听数据
@enduml
```

> **完整方案**：
> 
> 1. 数字证书验证服务器身份 → 确认服务器公钥的真实性
> 2. 用服务器公钥加密对称密钥 → 安全地交换对称密钥
> 3. 用对称密钥加密数据 → 高效地加密传输

## 5. 补充：Charles 抓 HTTPS 包的原理

Charles 等抓包工具能够抓取 HTTPS 数据的关键在于：**客户端信任了 Charles 的 CA 证书**。

### 5.1. Charles 抓 HTTPS 包的流程

```uml
@startuml
participant "客户端（配置代理）" as Client
participant "Charles（代理服务器 + 自签名 CA）" as Charles
participant "百度" as Baidu

note over Client, Baidu: Charles 抓 HTTPS 包的关键：客户端信任 Charles 的 CA

Client -> Client: 配置代理指向 Charles（如 127.0.0.1:8888）
Client -> Client: 安装 Charles 的 CA 证书到系统信任列表

Client -> Charles: 请求访问 https://www.baidu.com
note right of Charles: Charles 生成 baidu.com 的证书\n（用 Charles CA 私钥签名）

Charles -> Client: 返回 Charles 签发的证书（baidu.com）
note left of Client: 客户端验证证书\n发现是 Charles CA 签发的\n因为信任 Charles CA，验证通过

Client -> Client: 提取 Charles 的公钥 K_charles_pub
Client -> Client: 生成对称密钥 K_session
Client -> Charles: 用 K_charles_pub 加密 K_session

Charles -> Charles: 用 Charles 私钥解密获得 K_session
note over Client, Charles: 客户端与 Charles 建立 HTTPS 连接

Charles -> Baidu: 请求访问 https://www.baidu.com
Baidu -> Charles: 返回百度的真实证书
Charles -> Charles: 验证百度证书
Charles -> Charles: 提取百度公钥 K_baidu_pub
Charles -> Charles: 生成对称密钥 K_session2
Charles -> Baidu: 用 K_baidu_pub 加密 K_session2
Baidu -> Baidu: 用百度私钥解密获得 K_session2
note over Charles, Baidu: Charles 与百度建立 HTTPS 连接

Client -> Charles: E(K_session, 请求数据)
note right of Charles: Charles 解密：D(K_session, 密文) = 明文请求\nCharles 可以看到明文数据！
Charles -> Baidu: E(K_session2, 请求数据)

Baidu -> Charles: E(K_session2, 响应数据)
note right of Charles: Charles 解密：D(K_session2, 密文) = 明文响应\nCharles 可以看到明文数据！
Charles -> Client: E(K_session, 响应数据)
@enduml
```

### 5.2. 为什么 Charles 能抓 HTTPS 包？

| 步骤 | 说明 | 关键点 |
|------|------|--------|
| **1. 安装 CA 证书** | 客户端安装 Charles 的自签名 CA 证书到系统信任列表 | 客户端信任 Charles CA，会信任 Charles 签发的所有证书 |
| **2. 配置代理** | 客户端配置代理指向 Charles | 所有 HTTPS 流量都经过 Charles |
| **3. 签发伪造证书** | Charles 用自己 CA 私钥为任何域名签发证书 | 客户端信任 Charles CA，所以验证通过 |
| **4. 双重 HTTPS 连接** | 客户端 ↔ Charles（HTTPS）+ Charles ↔ 百度（HTTPS） | Charles 作为中间人，可以看到两端的明文数据 |

::: info 关键理解

- **Charles 能抓 HTTPS 包的前提**：客户端主动安装并信任了 Charles 的 CA 证书
- **这是合法的中间人**：用户主动配置，用于调试和开发
- **如果攻击者想用同样方式攻击**：需要用户主动安装攻击者的 CA 证书，这在正常情况下不会发生

:::

### 5.3. 为什么 Charles 能通过验证？

**关键理解**：Charles 返回的不是 Charles 自己的证书，而是**为被访问域名签发的证书**。

```uml
@startuml
participant "客户端（信任 Charles CA）" as Client
participant "Charles" as Charles
participant "百度" as Baidu

note over Client, Baidu: Charles 为被访问域名签发证书

Client -> Charles: 请求访问 https://www.baidu.com
note right of Charles: Charles 拦截请求\n用 Charles CA 私钥为 baidu.com 签发证书

Charles -> Client: 返回证书（域名：baidu.com，CA：Charles）
note left of Client: 浏览器验证证书\n证书域名：baidu.com ✓\n访问域名：baidu.com ✓\n域名匹配！\nCA 签名：Charles CA ✓\n用户信任 Charles CA ✓
Client -> Client: 验证通过，建立连接

note left of Client: Charles 能通过验证的原因：\n1. 证书域名匹配（baidu.com）\n2. 用户信任 Charles CA
@enduml
```

> **Charles 能工作的原因：**
> 
> - **Charles 可以为任何域名签发证书**：因为用户主动信任了 Charles CA
> - **证书域名匹配**：访问 `baidu.com` 时，Charles 返回的是 `baidu.com` 的证书
> - **CA 签名验证通过**：证书由 Charles CA 签名，用户信任 Charles CA，所以验证通过

### 5.4. 为什么攻击者无法像 Charles 一样攻击？

**关键理解**：攻击者无法为被攻击域名签发证书，只能返回自己的证书，导致域名不匹配，验证失败。

```uml
@startuml
participant "客户端" as Client
participant "攻击者（能拦截流量）" as Attacker
participant "百度" as Baidu

note over Client, Baidu: 攻击者尝试中间人攻击

Client -> Attacker: 请求访问 https://www.baidu.com
note right of Attacker: 攻击者拦截流量\n攻击者无法为 baidu.com 签发证书\n（没有受信任 CA 私钥）

Attacker -> Client: 返回攻击者自己的证书（如 attacker.com）
note left of Client: 浏览器验证证书\n证书域名：attacker.com\n访问域名：baidu.com\n域名不匹配！
Client -> Client: 验证失败，拒绝连接

note left of Client: 浏览器显示"证书域名不匹配"错误
note right of Attacker: 攻击失败
@enduml
```

> **关键点：**
> 
> - **证书域名必须匹配**：访问 `baidu.com` 时，收到的证书必须是 `baidu.com` 的证书
> - **即使攻击者能拦截流量**：如果返回的证书域名不匹配（如返回 `google.com` 的证书），浏览器会验证失败，攻击无法成功
> - **攻击者需要为被攻击域名签发证书**：这需要受信任 CA 的私钥，几乎不可能获得

### 5.5. Charles vs 真实攻击者的区别

| 方面 | Charles | 真实攻击者 |
|------|---------|-----------|
| **CA 证书来源** | 自签名 CA（用户主动安装） | 需要获得受信任的 CA 私钥（几乎不可能） |
| **证书签发能力** | 可以为任何域名签发证书（用户信任 Charles CA） | 无法为被攻击域名签发证书（没有 CA 私钥） |
| **证书域名匹配** | ✅ 可以签发匹配的证书（如 baidu.com） | ❌ 只能返回自己的证书（域名不匹配，验证失败） |
| **用户行为** | 用户主动安装证书和配置代理 | 用户不会主动安装攻击者的证书 |
| **目的** | 调试、开发、测试 | 窃取数据、攻击 |
| **合法性** | ✅ 合法（用户授权） | ❌ 非法 |

## 6. 总结

| 层次 | 解决方案 | 解决的问题 | 遗留问题 |
|------|---------|-----------|---------|
| **第一层** | HTTP | - | 明文传输，数据暴露 |
| **第二层** | 对称加密 | ✅ 解决明文传输 | 密钥分发问题 |
| **第三层** | 非对称加密 | ✅ 解决密钥分发 | 身份验证问题 |
| **第四层** | 数字证书 | ✅ 解决身份验证 | ✅ 完整方案 |
