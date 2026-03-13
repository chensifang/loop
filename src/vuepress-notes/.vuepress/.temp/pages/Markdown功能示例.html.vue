<template><div><h1 id="markdown-功能示例" tabindex="-1"><a class="header-anchor" href="#markdown-功能示例"><span>Markdown 功能示例</span></a></h1>
<p>本文档展示了 VuePress 支持的常用 Markdown 功能。</p>
<h2 id="_1-代码块" tabindex="-1"><a class="header-anchor" href="#_1-代码块"><span>1. 代码块</span></a></h2>
<h3 id="基础代码块" tabindex="-1"><a class="header-anchor" href="#基础代码块"><span>基础代码块</span></a></h3>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-javascript"><code><span class="line"><span class="line"><span style="color:#D73A49">function</span><span style="color:#6F42C1"> greet</span><span style="color:#24292E">(</span><span style="color:#E36209">name</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">  return</span><span style="color:#032F62"> `Hello, ${</span><span style="color:#24292E">name</span><span style="color:#032F62">}!`</span><span style="color:#24292E">;</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span>
<span class="line"><span class="line"></span></span>
<span class="line"><span class="line"><span style="color:#24292E">console.</span><span style="color:#6F42C1">log</span><span style="color:#24292E">(</span><span style="color:#6F42C1">greet</span><span style="color:#24292E">(</span><span style="color:#032F62">'VuePress'</span><span style="color:#24292E">));</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="带行号的代码块" tabindex="-1"><a class="header-anchor" href="#带行号的代码块"><span>带行号的代码块</span></a></h3>
<div class="language-swift line-numbers-mode" data-highlighter="prismjs" data-ext="swift"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-swift"><code><span class="line"><span class="line"><span style="color:#D73A49">class</span><span style="color:#6F42C1"> ViewController</span><span style="color:#24292E">: </span><span style="color:#6F42C1">UIViewController </span><span style="color:#24292E">{</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    override</span><span style="color:#D73A49"> func</span><span style="color:#6F42C1"> viewDidLoad</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">        super</span><span style="color:#24292E">.</span><span style="color:#005CC5">viewDidLoad</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">        setupUI</span><span style="color:#24292E">()</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    </span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    private</span><span style="color:#D73A49"> func</span><span style="color:#6F42C1"> setupUI</span><span style="color:#24292E">() {</span></span></span>
<span class="line"><span class="line"><span style="color:#6A737D">        // 设置界面</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h3 id="内联代码" tabindex="-1"><a class="header-anchor" href="#内联代码"><span>内联代码</span></a></h3>
<p>使用 <code v-pre>console.log()</code> 可以输出信息到控制台。</p>
<h2 id="_2-表格" tabindex="-1"><a class="header-anchor" href="#_2-表格"><span>2. 表格</span></a></h2>
<h3 id="基础表格" tabindex="-1"><a class="header-anchor" href="#基础表格"><span>基础表格</span></a></h3>
<table>
<thead>
<tr>
<th>功能</th>
<th>支持情况</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>代码块</td>
<td>✅</td>
<td>支持语法高亮</td>
</tr>
<tr>
<td>表格</td>
<td>✅</td>
<td>支持对齐和格式化</td>
</tr>
<tr>
<td>高亮块</td>
<td>✅</td>
<td>支持多种类型</td>
</tr>
<tr>
<td>链接</td>
<td>✅</td>
<td>支持内部和外部链接</td>
</tr>
<tr>
<td>图片</td>
<td>✅</td>
<td>支持相对和绝对路径</td>
</tr>
</tbody>
</table>
<h3 id="对齐表格" tabindex="-1"><a class="header-anchor" href="#对齐表格"><span>对齐表格</span></a></h3>
<table>
<thead>
<tr>
<th style="text-align:left">左对齐</th>
<th style="text-align:center">居中</th>
<th style="text-align:right">右对齐</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">内容1</td>
<td style="text-align:center">内容2</td>
<td style="text-align:right">内容3</td>
</tr>
<tr>
<td style="text-align:left">较长的内容</td>
<td style="text-align:center">中间</td>
<td style="text-align:right">数字 123</td>
</tr>
<tr>
<td style="text-align:left">短</td>
<td style="text-align:center">中</td>
<td style="text-align:right">456</td>
</tr>
</tbody>
</table>
<h3 id="复杂表格" tabindex="-1"><a class="header-anchor" href="#复杂表格"><span>复杂表格</span></a></h3>
<table>
<thead>
<tr>
<th>图表类型</th>
<th>用途</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td>Mermaid</td>
<td>流程图、时序图</td>
<td>功能强大，语法简洁</td>
</tr>
<tr>
<td>Chart.js</td>
<td>数据可视化</td>
<td>轻量级，易于使用</td>
</tr>
<tr>
<td>ECharts</td>
<td>交互式图表</td>
<td>功能丰富，性能优秀</td>
</tr>
<tr>
<td>PlantUML</td>
<td>UML 图表</td>
<td>服务端渲染，无需客户端库</td>
</tr>
</tbody>
</table>
<h2 id="_3-高亮块-提示框" tabindex="-1"><a class="header-anchor" href="#_3-高亮块-提示框"><span>3. 高亮块（提示框）</span></a></h2>
<h3 id="信息提示" tabindex="-1"><a class="header-anchor" href="#信息提示"><span>信息提示</span></a></h3>
<div class="hint-container info">
<p class="hint-container-title">提示信息</p>
<p>这是一个信息提示框，用于展示一般性信息。</p>
</div>
<h3 id="提示-tip" tabindex="-1"><a class="header-anchor" href="#提示-tip"><span>提示（Tip）</span></a></h3>
<div class="hint-container tip">
<p class="hint-container-title">小贴士</p>
<p>使用 VuePress 可以快速搭建文档网站，支持实时预览和热更新。</p>
</div>
<h3 id="警告" tabindex="-1"><a class="header-anchor" href="#警告"><span>警告</span></a></h3>
<div class="hint-container warning">
<p class="hint-container-title">注意事项</p>
<p>修改配置文件后需要重启开发服务器才能生效。</p>
</div>
<h3 id="危险警告" tabindex="-1"><a class="header-anchor" href="#危险警告"><span>危险警告</span></a></h3>
<div class="hint-container caution">
<p class="hint-container-title">危险操作</p>
<p>删除文件操作不可恢复，请谨慎操作！</p>
</div>
<h3 id="详细信息" tabindex="-1"><a class="header-anchor" href="#详细信息"><span>详细信息</span></a></h3>
<details class="hint-container details"><summary>点击展开查看详情</summary>
<p>这里可以放置详细的内容，默认是折叠状态。</p>
<ul>
<li>支持多行内容</li>
<li>支持列表</li>
<li>支持代码块</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-javascript"><code><span class="line"><span class="line"><span style="color:#6A737D">// 甚至可以在详情块中使用代码</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">const</span><span style="color:#005CC5"> example</span><span style="color:#D73A49"> =</span><span style="color:#032F62"> 'Hello'</span><span style="color:#24292E">;</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div></details>
<h2 id="_4-列表" tabindex="-1"><a class="header-anchor" href="#_4-列表"><span>4. 列表</span></a></h2>
<h3 id="无序列表" tabindex="-1"><a class="header-anchor" href="#无序列表"><span>无序列表</span></a></h3>
<ul>
<li>第一项</li>
<li>第二项
<ul>
<li>嵌套项 1</li>
<li>嵌套项 2</li>
</ul>
</li>
<li>第三项</li>
</ul>
<h3 id="有序列表" tabindex="-1"><a class="header-anchor" href="#有序列表"><span>有序列表</span></a></h3>
<ol>
<li>第一步：安装依赖</li>
<li>第二步：配置插件</li>
<li>第三步：启动服务器
<ol>
<li>检查端口是否被占用</li>
<li>运行 <code v-pre>npm run docs:dev</code></li>
</ol>
</li>
</ol>
<h3 id="任务列表" tabindex="-1"><a class="header-anchor" href="#任务列表"><span>任务列表</span></a></h3>
<ul>
<li>[x] 完成 VuePress 集成</li>
<li>[x] 转换所有 HTML 笔记为 Markdown</li>
<li>[x] 配置图表插件</li>
<li>[ ] 添加更多示例内容</li>
<li>[ ] 优化样式和布局</li>
</ul>
<h2 id="_5-引用" tabindex="-1"><a class="header-anchor" href="#_5-引用"><span>5. 引用</span></a></h2>
<h3 id="单层引用" tabindex="-1"><a class="header-anchor" href="#单层引用"><span>单层引用</span></a></h3>
<blockquote>
<p>这是一段引用文字。
可以包含多行内容。</p>
</blockquote>
<h3 id="嵌套引用" tabindex="-1"><a class="header-anchor" href="#嵌套引用"><span>嵌套引用</span></a></h3>
<blockquote>
<p>第一层引用</p>
<blockquote>
<p>第二层引用</p>
<blockquote>
<p>第三层引用</p>
</blockquote>
</blockquote>
</blockquote>
<h2 id="_6-强调" tabindex="-1"><a class="header-anchor" href="#_6-强调"><span>6. 强调</span></a></h2>
<p><strong>粗体文字</strong></p>
<p><em>斜体文字</em></p>
<p><em><strong>粗斜体文字</strong></em></p>
<p><s>删除线文字</s></p>
<h2 id="_7-链接和图片" tabindex="-1"><a class="header-anchor" href="#_7-链接和图片"><span>7. 链接和图片</span></a></h2>
<h3 id="内部链接" tabindex="-1"><a class="header-anchor" href="#内部链接"><span>内部链接</span></a></h3>
<ul>
<li><RouteLink to="/">首页</RouteLink></li>
<li><RouteLink to="/%E5%9B%BE%E8%A1%A8%E7%A4%BA%E4%BE%8B.html">图表示例</RouteLink></li>
<li><RouteLink to="/%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/01-iOS%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%86%85%E5%AD%98%E5%B8%83%E5%B1%80.html">内存管理笔记</RouteLink></li>
</ul>
<h3 id="外部链接" tabindex="-1"><a class="header-anchor" href="#外部链接"><span>外部链接</span></a></h3>
<ul>
<li><a href="https://v2.vuepress.vuejs.org/" target="_blank" rel="noopener noreferrer">VuePress 官网</a></li>
<li><a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js 官网</a></li>
</ul>
<h3 id="图片" tabindex="-1"><a class="header-anchor" href="#图片"><span>图片</span></a></h3>
<p><img src="https://via.placeholder.com/400x200?text=示例图片" alt="示例图片"></p>
<h2 id="_8-分割线" tabindex="-1"><a class="header-anchor" href="#_8-分割线"><span>8. 分割线</span></a></h2>
<hr>
<h2 id="_9-数学公式-如果支持" tabindex="-1"><a class="header-anchor" href="#_9-数学公式-如果支持"><span>9. 数学公式（如果支持）</span></a></h2>
<p>行内公式：$E = mc^2$</p>
<p>块级公式：</p>
<p>$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$</p>
<h2 id="_10-图表示例" tabindex="-1"><a class="header-anchor" href="#_10-图表示例"><span>10. 图表示例</span></a></h2>
<h3 id="mermaid-流程图" tabindex="-1"><a class="header-anchor" href="#mermaid-流程图"><span>Mermaid 流程图</span></a></h3>
<Mermaid code="eJxLL0osyFAIceFSAALH6Kd7Gp4u745V0NW1U3Cqftqx5Nm0tbVgOSeQWM2zGetrFJyjn3Uuf7GwxzEWSebphGU1Ci5QGSeIjDPYHNfo57snP5s7HyLmAhHjAgDxWCwQ"></Mermaid><h3 id="chart-js-图表" tabindex="-1"><a class="header-anchor" href="#chart-js-图表"><span>Chart.js 图表</span></a></h3>
<ChartJS config="eJyr5lJQUCqpLEhVslJQSkosUtIBCaQkliQCBUCSQF5OYlJqTjGQH63kqKSjoOQEIpyVYkFKoYqLU0vACiA6YHpAZj6buuFZ7zqwsXDVIJWGBjoKRkBsaBoLlqoFUbVctVwAdN0kIw==" title="%E7%A4%BA%E4%BE%8B%E5%9B%BE%E8%A1%A8"></ChartJS><h2 id="_11-html-标签" tabindex="-1"><a class="header-anchor" href="#_11-html-标签"><span>11. HTML 标签</span></a></h2>
<p>VuePress 支持在 Markdown 中使用 HTML 标签：</p>
<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
这是一个使用 HTML 标签的样式块。
</div>
<h2 id="_12-转义字符" tabindex="-1"><a class="header-anchor" href="#_12-转义字符"><span>12. 转义字符</span></a></h2>
<p>如果需要显示 Markdown 语法本身，可以使用反斜杠转义：</p>
<p>**这不是粗体**</p>
<p>`这不是代码`</p>
<h2 id="_13-脚注" tabindex="-1"><a class="header-anchor" href="#_13-脚注"><span>13. 脚注</span></a></h2>
<p>这是一个带脚注的句子<a href="%E8%BF%99%E6%98%AF%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%84%9A%E6%B3%A8%E7%9A%84%E5%86%85%E5%AE%B9%E3%80%82">^1</a>。</p>
<p>这是另一个脚注<a href="%E8%BF%99%E6%98%AF%E7%AC%AC%E4%BA%8C%E4%B8%AA%E8%84%9A%E6%B3%A8%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%8C%E5%8F%AF%E4%BB%A5%E5%8C%85%E5%90%AB**%E6%A0%BC%E5%BC%8F%E5%8C%96**%E6%96%87%E5%AD%97%E3%80%82">^note</a>。</p>
<h2 id="_14-定义列表" tabindex="-1"><a class="header-anchor" href="#_14-定义列表"><span>14. 定义列表</span></a></h2>
<p>术语1
: 这是术语1的定义。</p>
<p>术语2
: 这是术语2的定义。
: 可以包含多个定义。</p>
<h2 id="_15-代码块中的语言标识" tabindex="-1"><a class="header-anchor" href="#_15-代码块中的语言标识"><span>15. 代码块中的语言标识</span></a></h2>
<p>支持多种语言的语法高亮：</p>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-python"><code><span class="line"><span class="line"><span style="color:#D73A49">def</span><span style="color:#6F42C1"> hello</span><span style="color:#24292E">():</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">    print</span><span style="color:#24292E">(</span><span style="color:#032F62">"Hello, World!"</span><span style="color:#24292E">)</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-java"><code><span class="line"><span class="line"><span style="color:#D73A49">public</span><span style="color:#D73A49"> class</span><span style="color:#6F42C1"> Hello</span><span style="color:#24292E"> {</span></span></span>
<span class="line"><span class="line"><span style="color:#D73A49">    public</span><span style="color:#D73A49"> static</span><span style="color:#D73A49"> void</span><span style="color:#6F42C1"> main</span><span style="color:#24292E">(</span><span style="color:#D73A49">String</span><span style="color:#24292E">[] </span><span style="color:#E36209">args</span><span style="color:#24292E">) {</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">        System.out.</span><span style="color:#6F42C1">println</span><span style="color:#24292E">(</span><span style="color:#032F62">"Hello, World!"</span><span style="color:#24292E">);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    }</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><div class="language-objective-c line-numbers-mode" data-highlighter="prismjs" data-ext="objective-c"><pre  class="shiki github-light vp-code" style="background-color:#fff;color:#24292e" v-pre=" language-objective-c"><code><span class="line"><span class="line"><span style="color:#D73A49">-</span><span style="color:#24292E"> (</span><span style="color:#D73A49">void</span><span style="color:#24292E">)viewDidLoad {</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">    [</span><span style="color:#005CC5">super</span><span style="color:#005CC5"> viewDidLoad</span><span style="color:#24292E">];</span></span></span>
<span class="line"><span class="line"><span style="color:#005CC5">    NSLog</span><span style="color:#24292E">(</span><span style="color:#032F62">@"Hello, World!"</span><span style="color:#24292E">);</span></span></span>
<span class="line"><span class="line"><span style="color:#24292E">}</span></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>
<p>VuePress 支持丰富的 Markdown 功能，包括：</p>
<ul>
<li>✅ 代码块和语法高亮</li>
<li>✅ 表格</li>
<li>✅ 高亮块（提示框）</li>
<li>✅ 列表（有序、无序、任务列表）</li>
<li>✅ 引用</li>
<li>✅ 强调（粗体、斜体、删除线）</li>
<li>✅ 链接和图片</li>
<li>✅ 图表（Mermaid、Chart.js、ECharts 等）</li>
<li>✅ HTML 标签</li>
<li>✅ 脚注</li>
<li>✅ 定义列表</li>
</ul>
<p>这些功能可以帮助你创建丰富、美观的文档内容。</p>
</div></template>


