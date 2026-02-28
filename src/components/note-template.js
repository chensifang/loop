/**
 * 笔记模板组件系统
 * 提供统一的笔记页面结构和 block 组件
 */

// 笔记页面基础模板
export function createNoteTemplate(title) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'loop'}</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/swift.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/objectivec.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cpp.min.js"></script>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightElement(block);
            });
        });
        mermaid.initialize({ startOnLoad: true });
    </script>
    <script src="/table-wrapper.js"></script>
    <script src="/components/table-component.js"></script>
</head>
<body>
    <div class="container">
        <h1>${title || ''}</h1>
        <!-- 内容区域 -->
    </div>
</body>
</html>`;
}

// Block 组件：代码块
export function createCodeBlock(code, language = '') {
    return `<div class="code-block"><code>${escapeHtml(code)}</code></div>`;
}

// Block 组件：表格
export function createTable(headers, rows) {
    let html = '<table><thead><tr>';
    headers.forEach(header => {
        html += `<th>${escapeHtml(header)}</th>`;
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${typeof cell === 'string' ? escapeHtml(cell) : cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

// Block 组件：信息表格（时间点、触发时机等）
export function createInfoTable(items) {
    const rows = items.map(item => [
        `<strong>${item.label}</strong>`,
        typeof item.value === 'string' ? escapeHtml(item.value) : item.value
    ]);
    return createTable(['项目', '内容'], rows);
}

// Block 组件：步骤表格
export function createStepsTable(steps) {
    const rows = steps.map(step => [
        `<strong>${step.step}</strong>`,
        step.action || '',
        step.description || ''
    ]);
    return createTable(['步骤', '操作', '说明'], rows);
}

// Block 组件：对比表格
export function createCompareTable(items, compareKeys) {
    const headers = ['对比项', ...compareKeys];
    const rows = items.map(item => {
        const row = [item.label];
        compareKeys.forEach(key => {
            row.push(item[key] || '');
        });
        return row;
    });
    return createTable(headers, rows);
}

// Block 组件：Mermaid 图表
export function createMermaidDiagram(code) {
    return `<div class="mermaid">${escapeHtml(code)}</div>`;
}

// Block 组件：关键点列表
export function createKeyPoints(points) {
    let html = '<p><strong>关键点</strong>：</p><ul>';
    points.forEach(point => {
        html += `<li>${escapeHtml(point)}</li>`;
    });
    html += '</ul>';
    return html;
}

// Block 组件：关键点表格
export function createKeyPointsTable(points) {
    const rows = points.map(point => [
        `<strong>${point.label}</strong>`,
        typeof point.value === 'string' ? escapeHtml(point.value) : point.value
    ]);
    return createTable(['要点', '说明'], rows);
}

// 工具函数：HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 在浏览器环境中使用
if (typeof window !== 'undefined') {
    window.NoteBlocks = {
        createCodeBlock,
        createTable,
        createInfoTable,
        createStepsTable,
        createCompareTable,
        createMermaidDiagram,
        createKeyPoints,
        createKeyPointsTable
    };
}
