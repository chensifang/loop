<template><div><h1 id="sidetable" tabindex="-1"><a class="header-anchor" href="#sidetable"><span>SideTable</span></a></h1>
<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2>
<p>Side Table 是 iOS Runtime 中的一个辅助数据结构，用于存储对象的额外信息。当对象的 ISA 指针无法存储所有信息时（比如引用计数过大、需要 weak 引用等），系统会创建 Side Table 来存储这些信息。</p>
<h2 id="实际存储结构" tabindex="-1"><a class="header-anchor" href="#实际存储结构"><span>实际存储结构</span></a></h2>
<p><strong>假设场景</strong>：对象 p1（地址 0x1，引用计数=3，2个weak指针），对象 p2（地址 0x2，引用计数=5，2个weak指针）</p>
<div id="sidetable-container"></div>
<h2 id="各层结构说明" tabindex="-1"><a class="header-anchor" href="#各层结构说明"><span>各层结构说明</span></a></h2>
<table>
<thead>
<tr>
<th>结构名称</th>
<th>类型</th>
<th>作用</th>
<th>层级</th>
<th>Key-Value关系</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SideTable</strong></td>
<td>结构体</td>
<td>存储对象的额外信息</td>
<td>第1层</td>
<td>-</td>
</tr>
<tr>
<td><strong>refcnts</strong></td>
<td>RefcountMap（哈希表）</td>
<td>存储引用计数</td>
<td>第2层</td>
<td>Key: 对象地址, Value: size_t（简单整数）</td>
</tr>
<tr>
<td><strong>weak_table</strong></td>
<td>weak_table_t（结构体）</td>
<td>哈希表结构，包含 weak_entries 数组指针和元数据</td>
<td>第2层</td>
<td>包含 weak_entries、num_entries、mask、max_hash_displacement 字段</td>
</tr>
<tr>
<td><strong>weak_entries</strong></td>
<td>weak_entry_t*（数组）</td>
<td>存储所有 weak_entry_t 的数组</td>
<td>第3层</td>
<td>数组元素为 weak_entry_t 结构体</td>
</tr>
<tr>
<td><strong>weak_entry_t</strong></td>
<td>结构体</td>
<td>存储单个对象的所有 weak 引用</td>
<td>第4层</td>
<td>包含 referent、inline_referrers、referrers 等字段</td>
</tr>
</tbody>
</table>
<h3 id="结构层级说明" tabindex="-1"><a class="header-anchor" href="#结构层级说明"><span>结构层级说明</span></a></h3>
<ul>
<li>
<p><strong>refcnts</strong>：</p>
<ul>
<li>SideTable → refcnts（类型为 RefcountMap，哈希表）</li>
<li>refcnts 中直接存储 Key-Value 对，Value 是简单的 size_t（整数）</li>
<li>不需要单独展示 RefcountEntry，因为它只是哈希表中的一个条目概念</li>
</ul>
</li>
<li>
<p><strong>weak_table</strong>：</p>
<ul>
<li>SideTable → weak_table（类型为 weak_table_t，结构体）→ weak_entries（数组）→ weak_entry_t（结构体）</li>
<li>weak_table_t 是哈希表结构体，包含：
<ul>
<li>weak_entries：指向 weak_entry_t 数组的指针</li>
<li>num_entries：条目数量</li>
<li>mask：哈希表的掩码</li>
<li>max_hash_displacement：最大哈希位移</li>
</ul>
</li>
<li>weak_entries 数组存储所有 weak_entry_t 结构体</li>
<li>weak_entry_t 是一个独立的结构体，包含字段：referent（对象地址）、inline_referrers（内联数组）、referrers（动态数组）、out_of_line（标志位）、num_refs（引用数量）等</li>
</ul>
</li>
</ul>
<h2 id="stripedmap-sidetable-的存储容器" tabindex="-1"><a class="header-anchor" href="#stripedmap-sidetable-的存储容器"><span>StripedMap：SideTable 的存储容器</span></a></h2>
<h3 id="为什么需要-stripedmap" tabindex="-1"><a class="header-anchor" href="#为什么需要-stripedmap"><span>为什么需要 StripedMap？</span></a></h3>
<p>如果所有对象共享一个全局的 SideTable，那么每次访问 SideTable 都需要加锁，这会成为性能瓶颈。StripedMap 通过将多个 SideTable 分散存储，减少锁竞争，提高并发性能。</p>
<h3 id="stripedmap-的结构" tabindex="-1"><a class="header-anchor" href="#stripedmap-的结构"><span>StripedMap 的结构</span></a></h3>
<table>
<thead>
<tr>
<th>属性</th>
<th>类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>array</strong></td>
<td>SideTable[64]</td>
<td>包含 64 个 SideTable 的数组（iOS 中通常是 8 或 64 个）</td>
</tr>
<tr>
<td><strong>count</strong></td>
<td>静态常量</td>
<td>SideTable 的数量（通常是 8 或 64）</td>
</tr>
</tbody>
</table>
<h3 id="如何找到对象的-sidetable" tabindex="-1"><a class="header-anchor" href="#如何找到对象的-sidetable"><span>如何找到对象的 SideTable？</span></a></h3>
<p>通过对象地址计算哈希值，从 StripedMap 中选择对应的 SideTable。具体流程如下：</p>
<h4 id="查找步骤" tabindex="-1"><a class="header-anchor" href="#查找步骤"><span>查找步骤</span></a></h4>
<table>
<thead>
<tr>
<th>步骤</th>
<th>操作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1. 获取对象地址</strong></td>
<td><code v-pre>void *p = (__bridge void *)obj</code></td>
<td>将对象指针转换为 void*</td>
</tr>
<tr>
<td><strong>2. 地址转整数</strong></td>
<td><code v-pre>uintptr_t addr = (uintptr_t)p</code></td>
<td>将指针地址转换为无符号整数</td>
</tr>
<tr>
<td><strong>3. 计算索引</strong></td>
<td><code v-pre>index = (addr &gt;&gt; 4) &amp; 63</code></td>
<td>右移4位后取低6位（64个SideTable需要6位）</td>
</tr>
<tr>
<td><strong>4. 获取 SideTable</strong></td>
<td><code v-pre>SideTable&amp; table = stripedMap.array[index]</code></td>
<td>从数组中取出对应索引的 SideTable</td>
</tr>
</tbody>
</table>
<h4 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现"><span>代码实现</span></a></h4>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-cpp"><code><span class="line"><span class="line"><span style="color:#6A737D">// 实际实现（简化版）</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">SideTable</span><span style="color:#D73A49">&#x26;</span><span style="color:#6F42C1"> tableForPointer</span><span style="color:#24292E">(</span><span style="color:#D73A49">const</span><span style="color:#D73A49"> void</span><span style="color:#D73A49"> *</span><span style="color:#E36209">p</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 1. 将对象地址转换为整数</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    uintptr_t</span><span style="color:#24292E"> addr </span><span style="color:#D73A49">=</span><span style="color:#D73A49"> reinterpret_cast&#x3C;uintptr_t></span><span style="color:#24292E">(p);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 2. 计算索引：右移4位，然后与63（0x3F）做与运算</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    //    这样可以得到 0-63 之间的索引值</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    size_t</span><span style="color:#24292E"> index </span><span style="color:#D73A49">=</span><span style="color:#24292E"> (addr </span><span style="color:#D73A49">>></span><span style="color:#005CC5"> 4</span><span style="color:#24292E">) </span><span style="color:#D73A49">&#x26;</span><span style="color:#24292E"> (STRIPED_MAP_COUNT </span><span style="color:#D73A49">-</span><span style="color:#005CC5"> 1</span><span style="color:#24292E">);</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 等价于：index = (addr >> 4) &#x26; 63;</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 3. 返回对应的 SideTable 引用</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    return</span><span style="color:#24292E"> SideTablesMap.array[index];</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h4 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h4>
<p>假设对象地址为 <code v-pre>0x100012340</code>：</p>
<ul>
<li>地址转整数：<code v-pre>addr = 0x100012340</code></li>
<li>右移4位：<code v-pre>addr &gt;&gt; 4 = 0x10001234</code></li>
<li>与63做与运算：<code v-pre>0x10001234 &amp; 0x3F = 0x34 = 52</code></li>
<li>结果：使用 <code v-pre>SideTable[52]</code></li>
</ul>
<h4 id="为什么右移4位" tabindex="-1"><a class="header-anchor" href="#为什么右移4位"><span>为什么右移4位？</span></a></h4>
<ul>
<li>对象地址通常是8字节对齐的（最低3位为0）</li>
<li>右移4位可以去除对齐位，同时保留足够的地址信息用于哈希</li>
<li>这样可以让不同对象更均匀地分布到64个 SideTable 中</li>
</ul>
<h3 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理"><span>工作原理</span></a></h3>
<table>
<thead>
<tr>
<th>步骤</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1. 计算索引</strong></td>
<td>根据对象地址计算哈希值，取模得到 SideTable 的索引（0 到 63）</td>
</tr>
<tr>
<td><strong>2. 获取 SideTable</strong></td>
<td>从 StripedMap 的数组中取出对应索引的 SideTable</td>
</tr>
<tr>
<td><strong>3. 加锁操作</strong></td>
<td>只对选中的 SideTable 加锁，其他 SideTable 不受影响</td>
</tr>
<tr>
<td><strong>4. 查找数据</strong></td>
<td>在 SideTable 内部的哈希表中查找对象的数据（引用计数、weak 引用等）</td>
</tr>
</tbody>
</table>
<h3 id="优势" tabindex="-1"><a class="header-anchor" href="#优势"><span>优势</span></a></h3>
<ul>
<li><strong>减少锁竞争</strong>：不同对象可能使用不同的 SideTable，可以并发访问</li>
<li><strong>提高性能</strong>：多个线程可以同时操作不同的 SideTable，减少等待时间</li>
<li><strong>简单高效</strong>：通过地址哈希快速定位，O(1) 时间复杂度</li>
</ul>
<h3 id="示例-1" tabindex="-1"><a class="header-anchor" href="#示例-1"><span>示例</span></a></h3>
<p>假设有 3 个对象：</p>
<ul>
<li>对象 A（地址 0x1000）：索引 = (0x1000 &gt;&gt; 4) &amp; 63 = 0，使用 SideTable[0]</li>
<li>对象 B（地址 0x2000）：索引 = (0x2000 &gt;&gt; 4) &amp; 63 = 0，使用 SideTable[0]（与 A 共享）</li>
<li>对象 C（地址 0x3000）：索引 = (0x3000 &gt;&gt; 4) &amp; 63 = 0，使用 SideTable[0]（与 A、B 共享）</li>
</ul>
<p>虽然多个对象可能共享同一个 SideTable，但 SideTable 内部使用哈希表存储，仍然可以快速区分不同对象的数据。</p>
<h2 id="完整存储结构" tabindex="-1"><a class="header-anchor" href="#完整存储结构"><span>完整存储结构</span></a></h2>
<p>Side Table 存储在全局的 <strong>StripedMap</strong> 中（包含多个 SideTable 的数组），通过对象地址的哈希值选择使用哪个 SideTable。多个对象可以共享同一个 SideTable（通过 SideTable 内的哈希表区分）。</p>
<div class="language-cpp line-numbers-mode" data-highlighter="prismjs" data-ext="cpp"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-cpp"><code><span class="line"><span class="line"><span style="color:#6A737D">// 全局 StripedMap 实例</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">static</span><span style="color:#24292E"> StripedMap</span><span style="color:#D73A49">&#x3C;</span><span style="color:#24292E">SideTable</span><span style="color:#D73A49">></span><span style="color:#24292E"> SideTablesMap;</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 获取对象的 SideTable</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">SideTable</span><span style="color:#D73A49">&#x26;</span><span style="color:#6F42C1"> tableForPointer</span><span style="color:#24292E">(</span><span style="color:#D73A49">const</span><span style="color:#D73A49"> void</span><span style="color:#D73A49"> *</span><span style="color:#E36209">p</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    return</span><span style="color:#24292E"> SideTablesMap.</span><span style="color:#6F42C1">get</span><span style="color:#24292E">(p);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></div></template>


