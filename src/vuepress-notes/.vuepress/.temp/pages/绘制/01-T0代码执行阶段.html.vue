<template><div><h1 id="t0-代码执行阶段-主线程" tabindex="-1"><a class="header-anchor" href="#t0-代码执行阶段-主线程"><span>T0：代码执行阶段（主线程）</span></a></h1>
<table>
<thead>
<tr>
<th>项目</th>
<th>内容</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>时间点</strong></td>
<td>代码执行时，在主线程同步执行</td>
</tr>
<tr>
<td><strong>这个阶段发生了什么</strong></td>
<td>（见下方表格）</td>
</tr>
</tbody>
</table>
<h2 id="执行步骤" tabindex="-1"><a class="header-anchor" href="#执行步骤"><span>执行步骤</span></a></h2>
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
<td><strong>1. 创建 UIButton 对象</strong></td>
<td><code v-pre>UIButton(type: .system)</code></td>
<td>在堆上分配内存；创建 UIButton 的 <code v-pre>CALayer</code>（此时 <code v-pre>contents</code> 为 nil）；创建内部的 <code v-pre>UIImageView</code> 和 <code v-pre>UILabel</code>（各自也有 <code v-pre>CALayer</code>）</td>
</tr>
<tr>
<td><strong>2. 设置 frame</strong></td>
<td><code v-pre>button.frame = ...</code></td>
<td>实际设置的是 <code v-pre>layer.frame</code>；Layer 的 frame 属性被修改；此时还没有布局计算，只是属性值被设置</td>
</tr>
<tr>
<td><strong>3. 设置文字</strong></td>
<td><code v-pre>button.setTitle(...)</code></td>
<td>内部 <code v-pre>UILabel</code> 的 text 属性被设置；<code v-pre>UILabel</code> 的 Layer 标记需要更新（内部调用类似 <code v-pre>setNeedsDisplay</code>）；但此时还没有生成 bitmap</td>
</tr>
<tr>
<td><strong>4. 设置图片</strong></td>
<td><code v-pre>button.setImage(...)</code></td>
<td>内部 <code v-pre>UIImageView</code> 的 image 属性被设置；<code v-pre>UIImageView</code> 的 Layer 标记需要更新；图片文件还在内存中，还没有解码成 bitmap</td>
</tr>
<tr>
<td><strong>5. 设置背景色和圆角</strong></td>
<td><code v-pre>backgroundColor</code>、<code v-pre>cornerRadius</code></td>
<td>Layer 的属性被设置；UIButton 自身的 Layer 标记需要更新</td>
</tr>
<tr>
<td><strong>6. 添加到视图层级</strong></td>
<td><code v-pre>view.addSubview(button)</code></td>
<td>button 被添加到视图树；button 的 Layer 被添加到 Layer 树（Model Tree）；此时 Layer 树已经建立，但还没有渲染</td>
</tr>
</tbody>
</table>
<p><strong>关键点</strong>：</p>
<ul>
<li>这个阶段只修改属性值，不进行实际绘制</li>
<li>所有 Layer 的 <code v-pre>contents</code> 都还是 nil（或之前的值）</li>
<li>系统只是标记哪些 Layer 需要更新，但不立即执行</li>
</ul>
<h2 id="标记机制" tabindex="-1"><a class="header-anchor" href="#标记机制"><span>标记机制</span></a></h2>
<p>每个 Layer 内部有多种标记位（dirty flags），用于标记不同类型的更新需求：</p>
<table>
<thead>
<tr>
<th>标记类型</th>
<th>对应方法</th>
<th>作用</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Layout 标记</strong></td>
<td><code v-pre>setNeedsLayout</code></td>
<td>需要重新计算布局</td>
</tr>
<tr>
<td><strong>Display 标记</strong></td>
<td><code v-pre>setNeedsDisplay</code></td>
<td>需要重新生成 bitmap</td>
</tr>
<tr>
<td><strong>Commit 标记</strong></td>
<td>系统自动设置</td>
<td>需要提交到 Render Server</td>
</tr>
</tbody>
</table>
<p>修改 Layer 属性时，系统会根据属性类型自动设置相应的标记位，但更新操作会延迟到后续阶段执行。</p>
<h2 id="系统自动标记的情况" tabindex="-1"><a class="header-anchor" href="#系统自动标记的情况"><span>系统自动标记的情况</span></a></h2>
<p>系统会自动标记，不需要手动调用 <code v-pre>setNeedsLayout</code>：</p>
<table>
<thead>
<tr>
<th>情况</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>视图被添加到父视图时</td>
<td><code v-pre>addSubview</code> → 系统自动标记</td>
</tr>
<tr>
<td>父视图的 frame 改变时</td>
<td>系统自动标记子视图需要布局</td>
</tr>
<tr>
<td>Auto Layout 约束更新时</td>
<td>系统自动标记</td>
</tr>
<tr>
<td>设备旋转时</td>
<td>系统自动标记</td>
</tr>
<tr>
<td>视图的 <code v-pre>bounds</code> 改变时</td>
<td>如果 <code v-pre>autoresizesSubviews</code> 为 true → 系统自动标记</td>
</tr>
</tbody>
</table>
</div></template>


