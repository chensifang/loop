<template><div><h1 id="ios-中的锁概述" tabindex="-1"><a class="header-anchor" href="#ios-中的锁概述"><span>iOS 中的锁概述</span></a></h1>
<h2 id="_1-什么是锁" tabindex="-1"><a class="header-anchor" href="#_1-什么是锁"><span>1. 什么是锁</span></a></h2>
<p>锁（Lock）是一种同步机制，用于在多线程环境中保护共享资源，确保同一时刻只有一个线程能够访问被保护的代码区域（临界区）。</p>
<h3 id="_1-1-为什么需要锁" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么需要锁"><span>1.1 为什么需要锁</span></a></h3>
<p>在多线程编程中，多个线程可能同时访问共享资源，导致：</p>
<ul>
<li><strong>数据竞争（Data Race）</strong>：多个线程同时读写同一数据，导致数据不一致</li>
<li><strong>竞态条件（Race Condition）</strong>：程序执行结果依赖于线程执行的顺序</li>
<li><strong>数据损坏</strong>：并发写入可能导致数据被破坏</li>
</ul>
<h2 id="_2-ios-中常见的锁类型" tabindex="-1"><a class="header-anchor" href="#_2-ios-中常见的锁类型"><span>2. iOS 中常见的锁类型</span></a></h2>
<table>
<thead>
<tr>
<th>锁类型</th>
<th>API</th>
<th>特点</th>
<th>性能</th>
<th>使用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>互斥锁</strong></td>
<td><code v-pre>pthread_mutex_t</code></td>
<td>不可重入，同一线程不能重复加锁</td>
<td>中等</td>
<td>一般同步场景</td>
</tr>
<tr>
<td><strong>递归锁</strong></td>
<td><code v-pre>pthread_mutex_t</code> (PTHREAD_MUTEX_RECURSIVE)</td>
<td>可重入，同一线程可以多次加锁</td>
<td>中等</td>
<td>递归调用场景</td>
</tr>
<tr>
<td><strong>自旋锁</strong></td>
<td><code v-pre>OSSpinLock</code> (已废弃)</td>
<td>忙等待，不进入睡眠</td>
<td>高（短时间等待）</td>
<td>等待时间短的场景（iOS 10+ 已废弃）</td>
</tr>
<tr>
<td><strong>信号量</strong></td>
<td><code v-pre>dispatch_semaphore_t</code></td>
<td>可以控制并发数量</td>
<td>高</td>
<td>控制并发数量、生产者消费者</td>
</tr>
<tr>
<td><strong>读写锁</strong></td>
<td><code v-pre>pthread_rwlock_t</code></td>
<td>读共享，写独占</td>
<td>高（读多写少）</td>
<td>读多写少的场景</td>
</tr>
<tr>
<td><strong>条件锁</strong></td>
<td><code v-pre>NSCondition</code></td>
<td>可以等待条件满足</td>
<td>中等</td>
<td>生产者消费者、等待条件</td>
</tr>
<tr>
<td><strong>@synchronized</strong></td>
<td><code v-pre>@synchronized(obj)</code></td>
<td>基于对象地址的递归锁</td>
<td>低</td>
<td>简单同步场景（性能要求不高）</td>
</tr>
<tr>
<td><strong>NSLock</strong></td>
<td><code v-pre>NSLock</code></td>
<td>互斥锁的封装</td>
<td>中等</td>
<td>一般同步场景</td>
</tr>
<tr>
<td><strong>NSRecursiveLock</strong></td>
<td><code v-pre>NSRecursiveLock</code></td>
<td>递归锁的封装</td>
<td>中等</td>
<td>递归调用场景</td>
</tr>
<tr>
<td><strong>os_unfair_lock</strong></td>
<td><code v-pre>os_unfair_lock</code></td>
<td>iOS 10+ 替代 OSSpinLock</td>
<td>高</td>
<td>高性能场景</td>
</tr>
</tbody>
</table>
<h2 id="_3-锁的分类" tabindex="-1"><a class="header-anchor" href="#_3-锁的分类"><span>3. 锁的分类</span></a></h2>
<h3 id="_3-1-按是否可重入分类" tabindex="-1"><a class="header-anchor" href="#_3-1-按是否可重入分类"><span>3.1 按是否可重入分类</span></a></h3>
<table>
<thead>
<tr>
<th>类型</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>不可重入锁</strong></td>
<td>同一线程不能重复加锁，否则会死锁</td>
<td><code v-pre>pthread_mutex_t</code>（默认）、<code v-pre>NSLock</code>、<code v-pre>os_unfair_lock</code></td>
</tr>
<tr>
<td><strong>可重入锁（递归锁）</strong></td>
<td>同一线程可以多次加锁，需要相同次数的解锁</td>
<td><code v-pre>pthread_mutex_t</code>（RECURSIVE）、<code v-pre>NSRecursiveLock</code>、<code v-pre>@synchronized</code></td>
</tr>
</tbody>
</table>
<h3 id="_3-2-按等待方式分类" tabindex="-1"><a class="header-anchor" href="#_3-2-按等待方式分类"><span>3.2 按等待方式分类</span></a></h3>
<table>
<thead>
<tr>
<th>类型</th>
<th>等待方式</th>
<th>特点</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>自旋锁</strong></td>
<td>忙等待（Busy Waiting）</td>
<td>CPU 持续检查锁状态，不进入睡眠</td>
<td><code v-pre>OSSpinLock</code>（已废弃）、<code v-pre>os_unfair_lock</code>（注意：不是传统自旋锁，而是自适应锁，会根据情况在自旋和睡眠之间切换）</td>
</tr>
<tr>
<td><strong>互斥锁</strong></td>
<td>睡眠等待（Sleep Waiting）</td>
<td>线程进入睡眠，等待被唤醒</td>
<td><code v-pre>pthread_mutex_t</code>、<code v-pre>NSLock</code></td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>自旋锁 vs 互斥锁</strong>：自旋锁适合等待时间短的场景（CPU 时间片内），互斥锁适合等待时间长的场景（避免 CPU 空转）。</p>
</blockquote>
<h3 id="_3-3-按功能分类" tabindex="-1"><a class="header-anchor" href="#_3-3-按功能分类"><span>3.3 按功能分类</span></a></h3>
<table>
<thead>
<tr>
<th>类型</th>
<th>功能</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>互斥锁</strong></td>
<td>保证同一时刻只有一个线程访问</td>
<td><code v-pre>pthread_mutex_t</code>、<code v-pre>NSLock</code></td>
</tr>
<tr>
<td><strong>读写锁</strong></td>
<td>读共享，写独占</td>
<td><code v-pre>pthread_rwlock_t</code></td>
</tr>
<tr>
<td><strong>条件锁</strong></td>
<td>可以等待条件满足</td>
<td><code v-pre>NSCondition</code>、<code v-pre>NSConditionLock</code></td>
</tr>
<tr>
<td><strong>信号量</strong></td>
<td>控制并发数量</td>
<td><code v-pre>dispatch_semaphore_t</code></td>
</tr>
</tbody>
</table>
<h2 id="_4-性能对比" tabindex="-1"><a class="header-anchor" href="#_4-性能对比"><span>4. 性能对比</span></a></h2>
<p>根据实际测试（仅供参考，实际性能取决于具体场景）：</p>
<table>
<thead>
<tr>
<th>锁类型</th>
<th>性能（相对）</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>os_unfair_lock</strong></td>
<td>⭐⭐⭐⭐⭐（最快）</td>
<td>iOS 10+ 推荐的高性能锁</td>
</tr>
<tr>
<td><strong>dispatch_semaphore</strong></td>
<td>⭐⭐⭐⭐</td>
<td>性能优秀，GCD 优化</td>
</tr>
<tr>
<td><strong>pthread_mutex</strong></td>
<td>⭐⭐⭐</td>
<td>性能中等，稳定可靠</td>
</tr>
<tr>
<td><strong>NSLock</strong></td>
<td>⭐⭐⭐</td>
<td>基于 pthread_mutex，性能相近</td>
</tr>
<tr>
<td><strong>NSRecursiveLock</strong></td>
<td>⭐⭐</td>
<td>递归锁性能略低</td>
</tr>
<tr>
<td><strong>@synchronized</strong></td>
<td>⭐（最慢）</td>
<td>性能最低，但使用简单</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>性能提示</strong>：性能对比仅供参考，实际选择应该根据具体场景。对于大多数应用，性能差异可以忽略不计，应该优先考虑代码的可读性和维护性。</p>
</blockquote>
<h2 id="_5-使用场景建议" tabindex="-1"><a class="header-anchor" href="#_5-使用场景建议"><span>5. 使用场景建议</span></a></h2>
<table>
<thead>
<tr>
<th>场景</th>
<th>推荐锁</th>
<th>说明</th>
<th>不推荐</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>一般同步场景</strong></td>
<td><code v-pre>pthread_mutex_t</code><br/><code v-pre>NSLock</code><br/><code v-pre>os_unfair_lock</code></td>
<td>性能好，稳定可靠</td>
<td><code v-pre>@synchronized</code>（性能较低）</td>
</tr>
<tr>
<td><strong>递归调用场景</strong></td>
<td><code v-pre>NSRecursiveLock</code><br/><code v-pre>pthread_mutex_t</code>（RECURSIVE）</td>
<td>支持同一线程多次加锁</td>
<td>-</td>
</tr>
<tr>
<td><strong>简单递归场景</strong></td>
<td><code v-pre>@synchronized</code></td>
<td>代码简洁，易用</td>
<td>-</td>
</tr>
<tr>
<td><strong>高性能场景</strong></td>
<td><code v-pre>os_unfair_lock</code>（iOS 10+）</td>
<td>性能最优</td>
<td>-</td>
</tr>
<tr>
<td><strong>高性能替代方案</strong></td>
<td><code v-pre>dispatch_semaphore</code></td>
<td>值为 1 时作为锁使用，性能优秀</td>
<td>-</td>
</tr>
<tr>
<td><strong>读多写少场景</strong></td>
<td><code v-pre>pthread_rwlock_t</code></td>
<td>多个读操作可以并发执行，提高性能</td>
<td>-</td>
</tr>
<tr>
<td><strong>控制并发数量</strong></td>
<td><code v-pre>dispatch_semaphore_t</code></td>
<td>限制同时执行的线程数量</td>
<td>-</td>
</tr>
<tr>
<td><strong>等待条件满足</strong></td>
<td><code v-pre>NSCondition</code><br/><code v-pre>NSConditionLock</code></td>
<td>生产者消费者模式、等待特定条件</td>
<td>-</td>
</tr>
</tbody>
</table>
<h2 id="_6-常见问题" tabindex="-1"><a class="header-anchor" href="#_6-常见问题"><span>6. 常见问题</span></a></h2>
<h3 id="_6-1-死锁问题" tabindex="-1"><a class="header-anchor" href="#_6-1-死锁问题"><span>6.1 死锁问题</span></a></h3>
<p><strong>原因</strong>：多个锁的加锁顺序不一致，导致循环等待</p>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre v-pre><code class="language-swift"><span class="line"><span class="token comment">// 错误示例：可能导致死锁</span></span>
<span class="line"><span class="token comment">// 线程 A：先锁 lock1，再锁 lock2</span></span>
<span class="line"><span class="token comment">// 线程 B：先锁 lock2，再锁 lock1</span></span>
<span class="line"><span class="token comment">// 解决方案：统一加锁顺序</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-性能问题" tabindex="-1"><a class="header-anchor" href="#_6-2-性能问题"><span>6.2 性能问题</span></a></h3>
<p><strong>原因</strong>：锁的粒度太大，锁持有时间过长</p>
<ul>
<li>减小锁的粒度，只保护必要的代码</li>
<li>减少锁持有时间，尽快释放锁</li>
<li>避免在锁内执行耗时操作</li>
</ul>
<h3 id="_6-3-优先级反转" tabindex="-1"><a class="header-anchor" href="#_6-3-优先级反转"><span>6.3 优先级反转</span></a></h3>
<p><strong>原因</strong>：低优先级线程持有锁，高优先级线程等待</p>
<ul>
<li>使用 <code v-pre>os_unfair_lock</code> 可以缓解优先级反转问题</li>
<li>避免长时间持有锁</li>
</ul>
<h2 id="_7-最佳实践" tabindex="-1"><a class="header-anchor" href="#_7-最佳实践"><span>7. 最佳实践</span></a></h2>
<ol>
<li><strong>选择合适的锁</strong>：根据场景选择最合适的锁类型</li>
<li><strong>统一加锁顺序</strong>：避免死锁</li>
<li><strong>减小锁粒度</strong>：只保护必要的代码</li>
<li><strong>避免嵌套锁</strong>：减少死锁风险</li>
<li><strong>及时释放锁</strong>：尽快释放锁，减少等待时间</li>
<li><strong>避免在锁内执行耗时操作</strong>：如网络请求、文件 I/O 等</li>
<li><strong>使用工具检测</strong>：使用 Thread Sanitizer 检测数据竞争</li>
</ol>
<h2 id="_8-总结" tabindex="-1"><a class="header-anchor" href="#_8-总结"><span>8. 总结</span></a></h2>
<table>
<thead>
<tr>
<th>场景</th>
<th>推荐锁</th>
<th>原因</th>
</tr>
</thead>
<tbody>
<tr>
<td>一般同步</td>
<td><code v-pre>os_unfair_lock</code> 或 <code v-pre>pthread_mutex_t</code></td>
<td>性能好，稳定可靠</td>
</tr>
<tr>
<td>递归调用</td>
<td><code v-pre>NSRecursiveLock</code></td>
<td>支持重入，避免死锁</td>
</tr>
<tr>
<td>简单场景</td>
<td><code v-pre>@synchronized</code></td>
<td>代码简洁，易用</td>
</tr>
<tr>
<td>读多写少</td>
<td><code v-pre>pthread_rwlock_t</code></td>
<td>读操作并发，性能好</td>
</tr>
<tr>
<td>控制并发</td>
<td><code v-pre>dispatch_semaphore_t</code></td>
<td>灵活控制并发数量</td>
</tr>
<tr>
<td>等待条件</td>
<td><code v-pre>NSCondition</code></td>
<td>支持条件等待</td>
</tr>
</tbody>
</table>
</div></template>


