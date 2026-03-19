# TCP 报文结构 (packet-beta)

## 建议的学习顺序

::: tip
1. TCP 是什么、解决什么问题（简述、分层）
2. TCP 头部结构（packet 图 + Nmap 图）
3. 三次握手、四次挥手（状态机、为什么是 3 次 / 4 次）
4. 序列号与确认号（可靠传输、乱序）
5. 重传机制（超时重传、快速重传、SACK）
6. 滑动窗口（流控）
7. 拥塞控制（慢启动、拥塞避免、快速恢复）
:::

---

本文整理自以下高质量文章：

- [Nmap TCP/IP Reference](https://nmap.org/book/tcpip-ref.html)（IPv4/TCP/UDP/ICMP 头部图来源）
- [pdai.tech 网络协议 - TCP 协议详解](https://pdai.tech/md/develop/protocol/dev-protocol-tcpip.html)
- [左耳朵耗子：TCP 的那些事儿（上）](https://coolshell.cn/articles/11564.html)
- [左耳朵耗子：TCP 的那些事儿（下）](https://coolshell.cn/articles/11609.html)
- [小林coding：35 张图解 TCP 三次握手和四次挥手](https://www.cnblogs.com/xiaolincoding/p/12638546.html)
- [qcrao："三次握手，四次挥手"你真的懂吗？](https://qcrao.com/post/dive-into-three-way-handshake/)
- [RFC 793 - Transmission Control Protocol](https://tools.ietf.org/html/rfc793)

## TCP 头部（来源：Nmap TCP/IP Reference）

![TCP header](/tcp-header.png)

## TCP 报文结构（packet）

```packet
title TCP 报文结构
0-15: "源端口号"
16-31: "目标端口号"
32-63: "序列号 (Sequence Number)"
64-95: "确认号 (Acknowledgment Number)"
96-99: "头部长度"
100-102: "保留"
103: "CWR"
104: "ECE"
105: "URG"
106: "ACK"
107: "PSH"
108: "RST"
109: "SYN"
110: "FIN"
111-127: "窗口大小"
128-143: "校验和"
144-159: "紧急指针"
160-191: "选项 (Options)"
192-223: "数据 (Data)"
```

## 字段说明

| 位范围 | 字段 | 说明 |
|--------|------|------|
| 0-15 | 源端口号 | 发送方端口，标识发送进程 |
| 16-31 | 目标端口号 | 接收方端口，标识接收进程 |
| 32-63 | 序列号 (Sequence Number) | 本报文段第一个字节的序号，用于解决网络包乱序（reordering），TCP 用此序号拼接数据 |
| 64-95 | 确认号 (Acknowledgment Number) | 期望收到的下一个字节序号，用于确认收到，解决不丢包问题；仅当 ACK=1 时有效 |
| 96-99 | 头部长度 (Data Offset) | 以 32 位字为单位，最小 5（20 字节），最大 15（60 字节）；头部长度 = 值 × 4 |
| 100-102 | 保留 | 必须为 0，预留扩展 |
| 103 | CWR | Congestion Window Reduced，拥塞窗口已减小；用于 ECN 拥塞通知 |
| 104 | ECE | ECN-Echo，回显拥塞指示；用于 ECN 拥塞通知 |
| 105 | URG | 紧急指针有效；为 1 时紧急指针字段有意义 |
| 106 | ACK | 确认号有效；为 1 时确认号字段有意义 |
| 107 | PSH | Push，请求接收方尽快将数据交付应用层 |
| 108 | RST | Reset，重置连接 |
| 109 | SYN | Synchronize，同步序列号，用于建立连接；三次握手中使用 |
| 110 | FIN | Finish，结束连接，用于释放连接；四次挥手中使用 |
| 111-127 | 窗口大小 (Window) | 又称 Advertised-Window，接收方告知发送方自己还有多少缓冲区可接收数据，用于流控（滑动窗口） |
| 128-143 | 校验和 (Checksum) | 头部 + 数据 + 伪首部的校验，用于检测传输错误 |
| 144-159 | 紧急指针 (Urgent Pointer) | 仅当 URG=1 时有效，指向紧急数据的末尾位置 |
| 160-191 | 选项 (Options) | 可变长度，0-40 字节，按 4 字节对齐；常见如 MSS、窗口扩大、时间戳、SACK 等 |
| 192-223 | 数据 (Data) | 应用层载荷，可变长度 |

## 连接的本质

::: tip
其实，网络上的传输是没有连接的，包括 TCP 也是一样的。而 TCP 所谓的「连接」，其实只不过是在通讯的双方维护一个「连接状态」，让它看上去好像有连接一样。所以，TCP 的状态变换是非常重要的。

—— [左耳朵耗子](https://coolshell.cn/articles/11564.html)、[pdai.tech](https://pdai.tech/md/develop/protocol/dev-protocol-tcpip.html)

**网络本身是「无连接」的**

IP 层只负责转发一个个独立的数据包，不维护「连接」概念。每个 TCP 段都是单独的 IP 包，可能走不同路径，网络设备也不会记住「这是一条 TCP 连接」。

**「连接」只存在于两端的状态里**

TCP 的「连接」其实是两端各自维护的一组状态：序列号、确认号、窗口、状态机等。这些状态只存在于两端主机的内存中，不在网络里。

**和电路交换的对比**

传统电话网是「电路交换」，会建立一条物理通路。TCP 是「分组交换」，没有固定物理通路，所谓「连接」只是两端对同一组状态的共同约定。

**可以再补充的一点**

说「网络上的传输是没有连接的」时，指的是 IP 层 / 网络本身没有连接概念。TCP 在传输层是「面向连接」的，但这个「连接」是逻辑上的，由两端的状态机共同定义，而不是物理上的固定链路。
:::
