<template><div><h1 id="isa-指针与类对象、元类对象的关系" tabindex="-1"><a class="header-anchor" href="#isa-指针与类对象、元类对象的关系"><span>isa 指针与类对象、元类对象的关系</span></a></h1>
<h2 id="_1-核心概念" tabindex="-1"><a class="header-anchor" href="#_1-核心概念"><span>1. 核心概念</span></a></h2>
<p>Objective-C 中的对象系统基于三个核心实体：<strong>实例对象</strong>、<strong>类对象</strong>和<strong>元类对象</strong>。它们通过 <code v-pre>isa</code> 指针和 <code v-pre>superclass</code> 指针形成复杂的关系网络。</p>
<blockquote>
<p><strong>重要说明</strong>：本文档中提到的**根类（Root class）**就是 <code v-pre>NSObject</code>。NSObject 是所有 Objective-C 类的基类，它的 <code v-pre>superclass</code> 指针指向 <code v-pre>nil</code>，表示没有父类。所有其他类都直接或间接继承自 NSObject。</p>
</blockquote>
<h2 id="_2-三种实体类型" tabindex="-1"><a class="header-anchor" href="#_2-三种实体类型"><span>2. 三种实体类型</span></a></h2>
<table>
<thead>
<tr>
<th>实体类型</th>
<th>作用</th>
<th>存储内容</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>实例对象（Instance）</strong></td>
<td>实际创建的对象</td>
<td>实例变量（ivar）的值</td>
<td><code v-pre>[[Person alloc] init]</code></td>
</tr>
<tr>
<td><strong>类对象（Class）</strong></td>
<td>描述实例的结构</td>
<td>实例方法列表、属性列表、协议列表等</td>
<td><code v-pre>[Person class]</code></td>
</tr>
<tr>
<td><strong>元类对象（Meta-class）</strong></td>
<td>描述类对象的结构</td>
<td>类方法列表</td>
<td>通过 <code v-pre>object_getClass([Person class])</code> 获取</td>
</tr>
</tbody>
</table>
<h2 id="_3-两种关键指针" tabindex="-1"><a class="header-anchor" href="#_3-两种关键指针"><span>3. 两种关键指针</span></a></h2>
<table>
<thead>
<tr>
<th>指针类型</th>
<th>作用</th>
<th>指向关系</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>isa 指针</strong></td>
<td>指向对象的类型（类或元类）</td>
<td>实例 → 类，类 → 元类，元类 → 根元类</td>
</tr>
<tr>
<td><strong>superclass 指针</strong></td>
<td>指向父类（继承关系）</td>
<td>子类 → 父类 → 根类 → nil</td>
</tr>
</tbody>
</table>
<h2 id="_4-isa-指针的指向关系" tabindex="-1"><a class="header-anchor" href="#_4-isa-指针的指向关系"><span>4. isa 指针的指向关系</span></a></h2>
<h3 id="_4-1-实例对象的-isa" tabindex="-1"><a class="header-anchor" href="#_4-1-实例对象的-isa"><span>4.1 实例对象的 isa</span></a></h3>
<table>
<thead>
<tr>
<th>对象</th>
<th>isa 指向</th>
<th>作用</th>
</tr>
</thead>
<tbody>
<tr>
<td>子类实例</td>
<td>子类（类对象）</td>
<td>通过 isa 找到类对象，查找实例方法</td>
</tr>
<tr>
<td>父类实例</td>
<td>父类（类对象）</td>
<td>通过 isa 找到类对象，查找实例方法</td>
</tr>
<tr>
<td>根类实例</td>
<td>根类（类对象）</td>
<td>通过 isa 找到类对象，查找实例方法</td>
</tr>
</tbody>
</table>
<h3 id="_4-2-类对象的-isa" tabindex="-1"><a class="header-anchor" href="#_4-2-类对象的-isa"><span>4.2 类对象的 isa</span></a></h3>
<table>
<thead>
<tr>
<th>类对象</th>
<th>isa 指向</th>
<th>作用</th>
</tr>
</thead>
<tbody>
<tr>
<td>子类（类对象）</td>
<td>子类（元类）</td>
<td>通过 isa 找到元类对象，查找类方法</td>
</tr>
<tr>
<td>父类（类对象）</td>
<td>父类（元类）</td>
<td>通过 isa 找到元类对象，查找类方法</td>
</tr>
<tr>
<td>根类（类对象）</td>
<td>根类（元类）</td>
<td>通过 isa 找到元类对象，查找类方法</td>
</tr>
</tbody>
</table>
<h3 id="_4-3-元类对象的-isa" tabindex="-1"><a class="header-anchor" href="#_4-3-元类对象的-isa"><span>4.3 元类对象的 isa</span></a></h3>
<table>
<thead>
<tr>
<th>元类对象</th>
<th>isa 指向</th>
<th>作用</th>
</tr>
</thead>
<tbody>
<tr>
<td>子类（元类）</td>
<td>根类（元类）</td>
<td>所有元类的 isa 都指向根元类</td>
</tr>
<tr>
<td>父类（元类）</td>
<td>根类（元类）</td>
<td>所有元类的 isa 都指向根元类</td>
</tr>
<tr>
<td>根类（元类）</td>
<td>根类（元类）<strong>（自身）</strong></td>
<td>根元类的 isa 指向自身，形成闭环</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>关键点</strong>：所有元类的 <code v-pre>isa</code> 指针最终都指向根元类（根类（元类）），而根元类的 <code v-pre>isa</code> 指向自身，形成一个闭环。这意味着根元类是所有元类的&quot;类&quot;。</p>
</blockquote>
<h2 id="_5-superclass-指针的继承关系" tabindex="-1"><a class="header-anchor" href="#_5-superclass-指针的继承关系"><span>5. superclass 指针的继承关系</span></a></h2>
<h3 id="_5-1-类对象的继承链" tabindex="-1"><a class="header-anchor" href="#_5-1-类对象的继承链"><span>5.1 类对象的继承链</span></a></h3>
<table>
<thead>
<tr>
<th>类对象</th>
<th>superclass 指向</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>子类（类对象）</td>
<td>父类（类对象）</td>
<td>子类的父类</td>
</tr>
<tr>
<td>父类（类对象）</td>
<td>根类（类对象）</td>
<td>父类的父类</td>
</tr>
<tr>
<td>根类（类对象）</td>
<td><strong>nil</strong></td>
<td>根类没有父类</td>
</tr>
</tbody>
</table>
<h3 id="_5-2-元类对象的继承链" tabindex="-1"><a class="header-anchor" href="#_5-2-元类对象的继承链"><span>5.2 元类对象的继承链</span></a></h3>
<table>
<thead>
<tr>
<th>元类对象</th>
<th>superclass 指向</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>子类（元类）</td>
<td>父类（元类）</td>
<td>子元类的父元类</td>
</tr>
<tr>
<td>父类（元类）</td>
<td>根类（元类）</td>
<td>父元类的父元类</td>
</tr>
<tr>
<td>根类（元类）</td>
<td><strong>根类（类对象）</strong></td>
<td><strong>特殊：根元类的 superclass 指向根类对象</strong></td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>重要特性</strong>：根元类的 <code v-pre>superclass</code> 指向根类对象（而不是 nil），这是一个特殊设计。它允许当在元类链中找不到类方法时，可以回退到根类中查找实例方法。例如，<code v-pre>description</code> 类方法实际上是在根类（NSObject）的实例方法中实现的。</p>
</blockquote>
<h2 id="_6-方法查找机制" tabindex="-1"><a class="header-anchor" href="#_6-方法查找机制"><span>6. 方法查找机制</span></a></h2>
<h3 id="_6-1-实例方法查找" tabindex="-1"><a class="header-anchor" href="#_6-1-实例方法查找"><span>6.1 实例方法查找</span></a></h3>
<p>当向实例对象发送消息时，查找流程如下：</p>
<ol>
<li>通过实例的 <code v-pre>isa</code> 指针找到类对象</li>
<li>在类对象的方法列表中查找方法</li>
<li>如果找不到，通过 <code v-pre>superclass</code> 指针向上查找父类</li>
<li>重复步骤 2-3，直到找到方法或到达 nil</li>
</ol>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 示例：查找实例方法</span></span>
<span class="line">Person <span class="token operator">*</span>person <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>Person alloc<span class="token punctuation">]</span> init<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">[</span>person sayHello<span class="token punctuation">]</span><span class="token punctuation">;</span>  <span class="token comment">// 查找路径：person(isa) → Person（类对象） → 查找 sayHello</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 如果 Person 中没有，继续向上查找</span></span>
<span class="line"><span class="token comment">// Person（类对象） → NSObject（类对象） → 查找 sayHello</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-类方法查找" tabindex="-1"><a class="header-anchor" href="#_6-2-类方法查找"><span>6.2 类方法查找</span></a></h3>
<p>当向类对象发送消息时，查找流程如下：</p>
<ol>
<li>通过类的 <code v-pre>isa</code> 指针找到元类对象</li>
<li>在元类对象的方法列表中查找方法</li>
<li>如果找不到，通过 <code v-pre>superclass</code> 指针向上查找父元类</li>
<li>重复步骤 2-3，直到找到方法或到达根元类</li>
<li>如果根元类中也没有，通过根元类的 <code v-pre>superclass</code> 回退到根类对象查找实例方法</li>
</ol>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 示例：查找类方法</span></span>
<span class="line"><span class="token punctuation">[</span>Person sharedInstance<span class="token punctuation">]</span><span class="token punctuation">;</span>  </span>
<span class="line"><span class="token comment">// 查找路径：Person（类对象）(isa) → Person（元类） → 查找 sharedInstance</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 如果 Person（元类）中没有，继续向上查找</span></span>
<span class="line"><span class="token comment">// Person（元类） → NSObject（元类） → 查找 sharedInstance</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 如果 NSObject（元类）中也没有，通过 superclass 回退</span></span>
<span class="line"><span class="token comment">// NSObject（元类）(superclass) → NSObject（类对象） → 查找实例方法</span></span>
<span class="line"><span class="token comment">// 例如：[NSObject description] 实际上调用的是 NSObject 的实例方法</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-内存布局中的体现" tabindex="-1"><a class="header-anchor" href="#_7-内存布局中的体现"><span>7. 内存布局中的体现</span></a></h2>
<p>在对象的内存布局中，<code v-pre>isa</code> 指针位于对象的第一个位置（偏移 0），占用 8 字节。这是 Objective-C 对象的基础结构。</p>
<table>
<thead>
<tr>
<th>对象类型</th>
<th>偏移 0</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>实例对象</td>
<td>isa 指针（指向类对象）</td>
<td>通过 isa 找到类对象，查找实例方法</td>
</tr>
<tr>
<td>类对象</td>
<td>isa 指针（指向元类对象）</td>
<td>通过 isa 找到元类对象，查找类方法</td>
</tr>
<tr>
<td>元类对象</td>
<td>isa 指针（指向根元类）</td>
<td>通过 isa 找到根元类，继续查找类方法</td>
</tr>
</tbody>
</table>
<h2 id="_8-验证代码" tabindex="-1"><a class="header-anchor" href="#_8-验证代码"><span>8. 验证代码</span></a></h2>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 验证 isa 指针的指向</span></span>
<span class="line">Person <span class="token operator">*</span>person <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span>Person alloc<span class="token punctuation">]</span> init<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 1. 实例对象的 isa 指向类对象</span></span>
<span class="line">Class personClass <span class="token operator">=</span> <span class="token function">object_getClass</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"实例对象的类: %@"</span><span class="token punctuation">,</span> personClass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Person</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 2. 类对象的 isa 指向元类对象</span></span>
<span class="line">Class personMetaClass <span class="token operator">=</span> <span class="token function">object_getClass</span><span class="token punctuation">(</span>personClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"类对象的元类: %@"</span><span class="token punctuation">,</span> personMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Person (meta)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 3. 元类对象的 isa 指向根元类</span></span>
<span class="line">Class rootMetaClass <span class="token operator">=</span> <span class="token function">object_getClass</span><span class="token punctuation">(</span>personMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"元类对象的元类: %@"</span><span class="token punctuation">,</span> rootMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// NSObject (meta)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 4. 根元类的 isa 指向自身</span></span>
<span class="line">Class rootMetaMetaClass <span class="token operator">=</span> <span class="token function">object_getClass</span><span class="token punctuation">(</span>rootMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"根元类的元类: %@"</span><span class="token punctuation">,</span> rootMetaMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// NSObject (meta) - 指向自身</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"是否相等: %d"</span><span class="token punctuation">,</span> rootMetaClass <span class="token operator">==</span> rootMetaMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 1 (YES)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 5. 验证 superclass 指针</span></span>
<span class="line">Class personSuperclass <span class="token operator">=</span> <span class="token function">class_getSuperclass</span><span class="token punctuation">(</span>personClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"Person 的父类: %@"</span><span class="token punctuation">,</span> personSuperclass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// NSObject</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 6. 验证根元类的 superclass 指向根类</span></span>
<span class="line">Class rootMetaSuperclass <span class="token operator">=</span> <span class="token function">class_getSuperclass</span><span class="token punctuation">(</span>rootMetaClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">NSLog</span><span class="token punctuation">(</span><span class="token string">@"根元类的父类: %@"</span><span class="token punctuation">,</span> rootMetaSuperclass<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// NSObject (class) - 指向根类对象</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-关键要点总结" tabindex="-1"><a class="header-anchor" href="#_9-关键要点总结"><span>9. 关键要点总结</span></a></h2>
<table>
<thead>
<tr>
<th>要点</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>isa 指针的作用</strong></td>
<td>指向对象的类型，用于方法查找。实例 → 类，类 → 元类</td>
</tr>
<tr>
<td><strong>superclass 指针的作用</strong></td>
<td>指向父类，形成继承链，用于向上查找方法</td>
</tr>
<tr>
<td><strong>元类的 isa 统一指向根元类</strong></td>
<td>所有元类的 isa 都指向根元类，根元类的 isa 指向自身</td>
</tr>
<tr>
<td><strong>根元类的 superclass 特殊指向</strong></td>
<td>根元类的 superclass 指向根类对象，允许类方法回退到实例方法</td>
</tr>
<tr>
<td><strong>方法查找路径</strong></td>
<td>实例方法：isa → 类 → superclass 链；类方法：isa → 元类 → superclass 链 → 根类</td>
</tr>
<tr>
<td><strong>内存布局</strong></td>
<td>所有对象（实例、类、元类）的第一个字段都是 isa 指针，偏移为 0</td>
</tr>
</tbody>
</table>
<h2 id="_10-实际应用场景" tabindex="-1"><a class="header-anchor" href="#_10-实际应用场景"><span>10. 实际应用场景</span></a></h2>
<h3 id="_10-1-方法交换-method-swizzling" tabindex="-1"><a class="header-anchor" href="#_10-1-方法交换-method-swizzling"><span>10.1 方法交换（Method Swizzling）</span></a></h3>
<p>理解 isa 和 superclass 的关系，有助于理解方法交换的原理：</p>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 交换实例方法：在类对象的方法列表中交换</span></span>
<span class="line">Method originalMethod <span class="token operator">=</span> <span class="token function">class_getInstanceMethod</span><span class="token punctuation">(</span><span class="token punctuation">[</span>Person class<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">@selector</span><span class="token punctuation">(</span>sayHello<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Method swizzledMethod <span class="token operator">=</span> <span class="token function">class_getInstanceMethod</span><span class="token punctuation">(</span><span class="token punctuation">[</span>Person class<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">@selector</span><span class="token punctuation">(</span>swizzled_sayHello<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">method_exchangeImplementations</span><span class="token punctuation">(</span>originalMethod<span class="token punctuation">,</span> swizzledMethod<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 交换类方法：在元类对象的方法列表中交换</span></span>
<span class="line">Method originalClassMethod <span class="token operator">=</span> <span class="token function">class_getClassMethod</span><span class="token punctuation">(</span><span class="token punctuation">[</span>Person class<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">@selector</span><span class="token punctuation">(</span>sharedInstance<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Method swizzledClassMethod <span class="token operator">=</span> <span class="token function">class_getClassMethod</span><span class="token punctuation">(</span><span class="token punctuation">[</span>Person class<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">@selector</span><span class="token punctuation">(</span>swizzled_sharedInstance<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">method_exchangeImplementations</span><span class="token punctuation">(</span>originalClassMethod<span class="token punctuation">,</span> swizzledClassMethod<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-动态创建类" tabindex="-1"><a class="header-anchor" href="#_10-2-动态创建类"><span>10.2 动态创建类</span></a></h3>
<p>理解类对象和元类对象的关系，有助于理解动态创建类的过程：</p>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// 动态创建类时，需要同时创建类对象和元类对象</span></span>
<span class="line">Class newClass <span class="token operator">=</span> <span class="token function">objc_allocateClassPair</span><span class="token punctuation">(</span><span class="token punctuation">[</span>NSObject class<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">"DynamicClass"</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// objc_allocateClassPair 会同时创建类对象和元类对象，并正确设置它们的 isa 和 superclass 指针</span></span>
<span class="line"><span class="token function">objc_registerClassPair</span><span class="token punctuation">(</span>newClass<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-kvo-实现原理" tabindex="-1"><a class="header-anchor" href="#_10-3-kvo-实现原理"><span>10.3 KVO 实现原理</span></a></h3>
<p>KVO 的实现依赖于动态创建子类，并修改 isa 指针的指向：</p>
<div class="language-objectivec line-numbers-mode" data-highlighter="prismjs" data-ext="objectivec"><pre v-pre><code class="language-objectivec"><span class="line"><span class="token comment">// KVO 会动态创建一个子类（如 NSKVONotifying_Person）</span></span>
<span class="line"><span class="token comment">// 然后将原对象的 isa 指针指向这个新创建的子类</span></span>
<span class="line"><span class="token comment">// 这样在调用方法时，会先查找子类的方法（重写了 setter），实现观察者通知</span></span>
<span class="line"><span class="token function">object_setClass</span><span class="token punctuation">(</span>person<span class="token punctuation">,</span> NSKVONotifying_Person<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 修改 isa 指针</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


