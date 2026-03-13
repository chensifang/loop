<template><div><h1 id="synchronized-原理" tabindex="-1"><a class="header-anchor" href="#synchronized-原理"><span>@synchronized 原理</span></a></h1>
<h2 id="_1-synchronized-是什么" tabindex="-1"><a class="header-anchor" href="#_1-synchronized-是什么"><span>1. @synchronized 是什么</span></a></h2>
<p><code v-pre>synchronized</code> 是 Objective-C 提供的同步指令，用于在多线程环境中保护代码块，确保同一时刻只有一个线程能够执行被保护的代码。</p>
<div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#6A737D">// 基本用法</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@synchronized</span><span style="color:#24292E">(obj) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 临界区代码</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 同一时刻只有一个线程能执行这里的代码</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="_2-synchronized-的实现原理" tabindex="-1"><a class="header-anchor" href="#_2-synchronized-的实现原理"><span>2. @synchronized 的实现原理</span></a></h2>
<p><code v-pre>synchronized(obj)</code> 在编译时会被转换为对运行时函数的调用：</p>
<h3 id="_2-1-编译后的代码" tabindex="-1"><a class="header-anchor" href="#_2-1-编译后的代码"><span>2.1 编译后的代码</span></a></h3>
<div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#6A737D">// 源代码</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@synchronized</span><span style="color:#24292E">(obj) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 代码块</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">// 编译后等价于</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">objc_sync_enter</span><span style="color:#24292E">(obj);</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@try</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 代码块</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">} </span><span style="color:#D73A49">@finally</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#6F42C1">    objc_sync_exit</span><span style="color:#24292E">(obj);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="_2-2-核心函数" tabindex="-1"><a class="header-anchor" href="#_2-2-核心函数"><span>2.2 核心函数</span></a></h3>
<table>
<thead>
<tr>
<th>函数</th>
<th>作用</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>objc_sync_enter(obj)</code></td>
<td>获取与对象 obj 关联的锁，如果锁被占用则等待</td>
</tr>
<tr>
<td><code v-pre>objc_sync_exit(obj)</code></td>
<td>释放与对象 obj 关联的锁</td>
</tr>
</tbody>
</table>
<h3 id="_2-3-内部数据结构" tabindex="-1"><a class="header-anchor" href="#_2-3-内部数据结构"><span>2.3 内部数据结构</span></a></h3>
<p>运行时使用以下数据结构来管理锁：</p>
<table>
<thead>
<tr>
<th>数据结构</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SyncData</strong></td>
<td>存储锁信息的结构，包含：<br>- 指向下一个 SyncData 的指针（链表结构）<br>- 同步对象的指针（disguised pointer）<br>- 线程计数<br>- 递归互斥锁（pthread_mutex_t，支持递归加锁）</td>
</tr>
<tr>
<td><strong>StripedMap&lt;SyncList&gt;</strong></td>
<td>分片哈希表，将对象指针映射到 SyncData 链表，减少不同对象之间的锁竞争</td>
</tr>
<tr>
<td><strong>SyncCache</strong></td>
<td>线程本地缓存，快速查找最近同步的对象，避免频繁的内存分配</td>
</tr>
</tbody>
</table>
<h3 id="_2-4-工作流程" tabindex="-1"><a class="header-anchor" href="#_2-4-工作流程"><span>2.4 工作流程</span></a></h3>
<Mermaid code="eJyVU09vEkEcvfdTzFET+wU4NCb2qB7UO1lhIquw4LKY6gkUWqhQEQg0QgtoUGIDxURtSyl8GX6zuye+gr+Z2eVPl1TdA2R33nvz3pv5xenLBNUCdFtVnulKZIPgE1N0Qw2oMUUzyJOQTpUgUeLEHE7M7nsP4FFCM9QI5QhrUrTaeVb77QHdUwIhAXn8WguIl9koKwXNURl6h7NRzkN6oMQExdDVGA3iG3Ig04UfSXbYgkHaanfX0e5HAy84z06W4Ko0HZZYtWNXUhsC+DBqUBJ9RXUn2B2O9pG7cfQV0qOa+oYGb0WfPr9NWO4bD/MrxUMLrmRsbm05kX3EGrwzK12C+ICfK/ipZlBd8AXDASJFZPYR1uyw3JgTiPkpja54pMmJnWxaZ6cwTrt5xI8SNohsBz5eTc974iN/hNjmipFJBerHEozCouZtxVAEhYbj1BFije/XtBYWsWA02Lpghb5rEBoDOEpa/bbZr0E5C+f52SjvZHC3IHZ5jCcxF0QZV8xOFeBgV64vJYfTCxhWPDbdyAiD7MC75op7c6/Hesuv/2TVgSxijhTlYC1yV89mThLI1uFyyNlLrvnZ5TNQxONbuWnuId5sGsWk6toi/iOAFpSnjP/XLp28284ljRni+vojCYPu+MO4hP6l8yXPi/mQZPj6lh03EGB9PoFCC4XwBjiD28vBOCNYHLsa8eAMPlSRxrJF2G+u+EKcnCTeRB0yHSjmWa8DR7X1I4q5xSjOYbCbwc6ml1/MljPV/zKZO6qxbjBv6Cih8ZbWB7T39lll/NeAdjIJe8NFwD9YeWBw"></Mermaid><h3 id="_2-5-关键特性" tabindex="-1"><a class="header-anchor" href="#_2-5-关键特性"><span>2.5 关键特性</span></a></h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>基于对象地址</strong></td>
<td>锁与对象的地址（指针值）关联，不同对象有不同的锁</td>
</tr>
<tr>
<td><strong>递归锁</strong></td>
<td>同一线程可以多次对同一对象加锁，需要相同次数的解锁</td>
</tr>
<tr>
<td><strong>自动释放</strong></td>
<td>使用 @try/@finally 确保即使发生异常也能释放锁</td>
</tr>
<tr>
<td><strong>性能优化</strong></td>
<td>使用线程本地缓存和分片哈希表，减少锁竞争和内存分配</td>
</tr>
</tbody>
</table>
<h2 id="_3-如果-obj-在同步块内部被置为-nil" tabindex="-1"><a class="header-anchor" href="#_3-如果-obj-在同步块内部被置为-nil"><span>3. 如果 obj 在同步块内部被置为 nil</span></a></h2>
<p>这是一个常见的陷阱问题。让我们分析一下会发生什么：</p>
<h3 id="_3-1-代码示例" tabindex="-1"><a class="header-anchor" href="#_3-1-代码示例"><span>3.1 代码示例</span></a></h3>
<div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#005CC5">NSObject</span><span style="color:#D73A49"> *</span><span style="color:#24292E">obj </span><span style="color:#D73A49">=</span><span style="color:#24292E"> [[</span><span style="color:#005CC5">NSObject</span><span style="color:#005CC5"> alloc</span><span style="color:#24292E">] </span><span style="color:#005CC5">init</span><span style="color:#24292E">];</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">@synchronized</span><span style="color:#24292E">(obj) {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 在同步块内部将 obj 置为 nil</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    obj </span><span style="color:#D73A49">=</span><span style="color:#005CC5"> nil</span><span style="color:#24292E">;</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">    // 继续执行代码...</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="_3-2-会发生什么" tabindex="-1"><a class="header-anchor" href="#_3-2-会发生什么"><span>3.2 会发生什么？</span></a></h3>
<table>
<thead>
<tr>
<th>方面</th>
<th>说明</th>
<th>结果</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>当前线程的锁</strong></td>
<td>锁是在进入同步块时基于 obj 的原始地址获取的</td>
<td>✅ 不会影响当前线程，锁已经获取，会正常释放</td>
</tr>
<tr>
<td><strong>其他线程的行为</strong></td>
<td>其他线程尝试用 nil 同步时，会使用不同的锁（nil 对象的锁）</td>
<td>⚠️ 可能导致同步失效，多个线程可能同时执行</td>
</tr>
<tr>
<td><strong>是否会死锁</strong></td>
<td>当前线程已经获取锁，退出时会正常释放</td>
<td>❌ 不会死锁</td>
</tr>
<tr>
<td><strong>是否会崩溃</strong></td>
<td>运行时处理 nil 对象，不会崩溃</td>
<td>❌ 不会崩溃</td>
</tr>
</tbody>
</table>
<h3 id="_3-3-详细分析" tabindex="-1"><a class="header-anchor" href="#_3-3-详细分析"><span>3.3 详细分析</span></a></h3>
<Mermaid code="eJyNk01v2kAQhu/8ij22UiMBR6Tm1HMPFffIRVblqjEpOFV6o0r4rAuuCiQhgZQmKEgVmKhVC/6o/4xn1z7xFzprOxRESuKTd2femXkfzebFt/uinBGfScKrnLAbI/jtCTlFykh7gqyQdIIIecIMhw0/JtajyX/R5Fr0xb6sSLsiT/Eczeur9PhXLMh6nlVEkn0n5rD+k3QyReDcoKf63OpkX77GwxA0lY4G0D2GUtE/HHrfvjN77E4NIktvwhLpxNb2dtQhRVCW2cm/lzM7oqyIuUd4fky2+DVWm0C3wLXxg0Q8Hg/UkXC5hFf/DY12mB2lEtY58psfVhQoSSduszFIKxrULuaW6jlnUBwsBl83miK0eo0UFimuecm+htUDNzyFT/yUu5xbFf7P6hPEQdUyaJ/Da9W1S7zviQ4XhmvUl2adW9UITnITHCzD4cCk6+mtcJqA63/AYIiAPvNu+q7tsOaQVWd0XAvR4JS00gbHZq0B777q+Y4SKIOrI6aVaHsGVoMTL/1AFzDuodU10nw1Grp3aLOzn7Q+8AsdzyljU3f6yT8xod9bWF4lzcxrZo7u4X0XoANJueWDnHEq/7Tol2u0+QcnR+YbNmOpYKh46C75hQKUjQ2bEzwRZn6hvXN8Ivgk6egSptPQXrgRkTpgBVc3tFWJ/QUi+dH5"></Mermaid><blockquote>
<p><strong>关键理解：</strong></p>
<ul>
<li><strong>锁是基于对象地址获取的</strong>：进入同步块时，锁已经基于 obj 的原始地址获取</li>
<li><strong>修改 obj 不影响已获取的锁</strong>：当前线程的锁不会受影响，会正常释放</li>
<li><strong>但会导致同步失效</strong>：其他线程使用 nil 同步时，会使用不同的锁，可能导致多个线程同时执行</li>
<li><strong>不会死锁或崩溃</strong>：运行时处理 nil 对象，不会导致死锁或崩溃</li>
</ul>
</blockquote>
<h3 id="_3-4-nil-对象的处理" tabindex="-1"><a class="header-anchor" href="#_3-4-nil-对象的处理"><span>3.4 nil 对象的处理</span></a></h3>
<p>根据 Objective-C 运行时的实现，<code v-pre>@synchronized(nil)</code> 的行为：</p>
<table>
<thead>
<tr>
<th>情况</th>
<th>行为</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>objc_sync_enter(nil)</strong></td>
<td>通常会被忽略或使用特殊的全局锁，不会阻塞</td>
</tr>
<tr>
<td><strong>objc_sync_exit(nil)</strong></td>
<td>通常会被忽略，不会释放任何锁</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>实际影响：</strong></p>
<ul>
<li>如果多个线程都使用同一个对象同步，但在同步块内部将对象置为 nil，会导致同步失效</li>
<li>不同线程可能使用不同的锁（原始对象的锁 vs nil 的锁），无法实现同步</li>
<li>虽然不会死锁或崩溃，但会导致数据竞争和不确定的行为</li>
</ul>
</blockquote>
<h2 id="_4-最佳实践" tabindex="-1"><a class="header-anchor" href="#_4-最佳实践"><span>4. 最佳实践</span></a></h2>
<table>
<thead>
<tr>
<th>实践</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>使用稳定的对象</strong></td>
<td>不要在同步块内部修改或释放同步对象</td>
</tr>
<tr>
<td><strong>避免使用 self</strong></td>
<td>使用 <code v-pre>@synchronized(self)</code> 可能导致死锁，建议使用专门的锁对象</td>
</tr>
<tr>
<td><strong>避免使用 nil</strong></td>
<td>不要使用 <code v-pre>@synchronized(nil)</code>，会导致同步失效</td>
</tr>
<tr>
<td><strong>性能考虑</strong></td>
<td><code v-pre>@synchronized</code> 性能较低，对于高性能场景，考虑使用其他锁（如 os_unfair_lock）</td>
</tr>
</tbody>
</table>
<h2 id="_5-总结" tabindex="-1"><a class="header-anchor" href="#_5-总结"><span>5. 总结</span></a></h2>
<table>
<thead>
<tr>
<th>问题</th>
<th>答案</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>@synchronized 如何实现？</strong></td>
<td>编译为 objc_sync_enter/exit 调用，运行时使用 SyncData 结构管理对象与锁的映射，使用递归互斥锁实现同步</td>
</tr>
<tr>
<td><strong>obj 在同步块内部被置为 nil 会死锁吗？</strong></td>
<td>❌ 不会。锁已经基于原始对象地址获取，退出时会正常释放</td>
</tr>
<tr>
<td><strong>obj 在同步块内部被置为 nil 会崩溃吗？</strong></td>
<td>❌ 不会。运行时处理 nil 对象，不会崩溃</td>
</tr>
<tr>
<td><strong>obj 在同步块内部被置为 nil 有什么影响？</strong></td>
<td>⚠️ 可能导致同步失效，其他线程使用 nil 同步时会使用不同的锁，无法实现同步</td>
</tr>
</tbody>
</table>
</div></template>


