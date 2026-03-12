<template><div><h1 id="t4-render-server-处理阶段-准备渲染" tabindex="-1"><a class="header-anchor" href="#t4-render-server-处理阶段-准备渲染"><span>T4：Render Server 处理阶段（准备渲染）</span></a></h1>
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
<td>T3 阶段提交数据后，Render Server 接收并处理</td>
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
<td><strong>1. 接收 Render Tree 数据</strong></td>
<td>通过 IPC 接收</td>
<td>Render Server 通过 IPC 接收序列化的 Render Tree 数据；反序列化，重建 Render Tree 结构</td>
</tr>
<tr>
<td><strong>2. 处理位图数据</strong></td>
<td>位图上传到 GPU</td>
<td>对于有 <code v-pre>contents</code> 的 Layer（如 UIImageView、UILabel）；位图 → 纹理：位图从 CPU 内存复制到 GPU 显存，变成纹理；GPU 可以直接读取纹理进行渲染</td>
</tr>
<tr>
<td><strong>3. 准备渲染数据</strong></td>
<td>构建渲染命令</td>
<td>根据 Render Tree 构建渲染命令；包括：几何信息、视觉属性、层级关系、渲染顺序和混合模式</td>
</tr>
<tr>
<td><strong>4. 等待 VSync 信号</strong></td>
<td>等待硬件信号</td>
<td>Render Server 准备好渲染数据后，等待 VSync 信号；VSync 信号由显示硬件发出，每秒 60 次（或 120 次，取决于设备）；VSync 信号表示&quot;屏幕准备好显示新的一帧&quot;</td>
</tr>
</tbody>
</table>
<p><strong>关键点</strong>：</p>
<table>
<thead>
<tr>
<th>要点</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>独立进程</strong></td>
<td>Render Server 是独立进程，不受应用进程影响</td>
</tr>
<tr>
<td><strong>异步操作</strong></td>
<td>位图上传到 GPU 是异步操作，不阻塞应用进程</td>
</tr>
<tr>
<td><strong>等待信号</strong></td>
<td>Render Server 准备好数据后，等待 VSync 信号才开始渲染</td>
</tr>
</tbody>
</table>
</div></template>


