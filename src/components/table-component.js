// 通用表格组件
// 使用方法: 调用 renderTable(data, containerId) 即可
// data 格式: { headers: ['列1', '列2', ...], rows: [['单元格1', '单元格2', ...], ...] }
// 或者: { headers: [{ text: '列1', html: '<strong>列1</strong>' }], rows: [...] }
// 或者: 从现有 HTML 表格提取数据: renderTableFromHTML(tableElement, containerId)

function renderTable(data, containerId) {
    const container = document.getElementById(containerId) || document.querySelector(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    // 创建表格包装容器
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    
    // 创建表格
    const table = document.createElement('table');
    
    // 创建表头
    if (data.headers && data.headers.length > 0) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        
        data.headers.forEach(header => {
            const th = document.createElement('th');
            // 支持字符串或对象格式
            if (typeof header === 'string') {
                th.textContent = header;
            } else if (header.html) {
                th.innerHTML = header.html;
            } else if (header.text) {
                th.textContent = header.text;
            }
            tr.appendChild(th);
        });
        
        thead.appendChild(tr);
        table.appendChild(thead);
    }
    
    // 创建表体
    if (data.rows && data.rows.length > 0) {
        const tbody = document.createElement('tbody');
        
        data.rows.forEach(row => {
            const tr = document.createElement('tr');
            
            row.forEach(cell => {
                const td = document.createElement('td');
                // 支持字符串或对象格式
                if (typeof cell === 'string') {
                    td.textContent = cell;
                } else if (cell.html) {
                    td.innerHTML = cell.html;
                } else if (cell.text) {
                    td.textContent = cell.text;
                }
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
    }
    
    // 组装
    wrapper.appendChild(table);
    container.appendChild(wrapper);
    
    // 确保表格宽度正确计算（强制重排）
    void table.offsetWidth;
    
    // 动态调整 wrapper 的宽度和对齐方式
    adjustTableWrapper(wrapper, table, container);
    
    // 监听窗口大小变化
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            adjustTableWrapper(wrapper, table, container);
        }, 100);
    });
    
    return wrapper;
}

// 调整表格包装容器的宽度和对齐方式
function adjustTableWrapper(wrapper, table, container) {
    // 获取表格实际宽度
    const tableWidth = table.offsetWidth;
    
    // 获取容器宽度（父容器）
    const containerWidth = container.offsetWidth;
    
    // 获取视口宽度
    const viewportWidth = window.innerWidth;
    const maxWidth = viewportWidth - 80; // 左右各 40px 边距
    
    // 状态1：表格宽度 <= 容器宽度
    if (tableWidth <= containerWidth) {
        wrapper.style.width = tableWidth + 'px';
        wrapper.style.maxWidth = 'none';
        wrapper.style.marginLeft = '0';
        wrapper.style.marginRight = 'auto';
        wrapper.style.display = 'block';
        wrapper.style.position = 'relative';
        wrapper.style.left = '0';
    }
    // 状态2：容器宽度 < 表格宽度 <= (100vw - 80px)
    else if (tableWidth <= maxWidth) {
        wrapper.style.width = tableWidth + 'px'; // wrapper 宽度 = 表格实际宽度
        wrapper.style.maxWidth = 'none';
        wrapper.style.display = 'block';
        wrapper.style.position = 'relative';
        // 计算表格在视口中的居中位置：视口中心 - 表格宽度的一半 + 左边距 40px
        // left = 50vw - tableWidth/2 - containerLeft + 40px
        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const leftValue = (viewportWidth / 2) - (tableWidth / 2) - containerLeft + 40;
        wrapper.style.left = leftValue + 'px';
        wrapper.style.marginLeft = '0';
        wrapper.style.marginRight = 'auto';
    }
    // 状态3：表格宽度 > (100vw - 80px)
    else {
        wrapper.style.width = 'calc(100vw - 80px)';
        wrapper.style.maxWidth = 'none';
        wrapper.style.display = 'block';
        wrapper.style.position = 'relative';
        wrapper.style.left = 'calc(50% - 50vw + 40px)'; // 相对于视口居中，左边距 40px
        wrapper.style.marginLeft = '0';
        wrapper.style.marginRight = 'auto';
    }
    
    // 强制重排确保样式生效
    void wrapper.offsetWidth;
}

// 从现有 HTML 表格提取数据并渲染
function renderTableFromHTML(sourceTableId, containerId) {
    const sourceTable = document.getElementById(sourceTableId) || document.querySelector(sourceTableId);
    if (!sourceTable) {
        console.error('Source table not found:', sourceTableId);
        return;
    }
    
    const headers = [];
    const rows = [];
    
    // 提取表头
    const thead = sourceTable.querySelector('thead');
    if (thead) {
        const headerRow = thead.querySelector('tr');
        if (headerRow) {
            headerRow.querySelectorAll('th').forEach(th => {
                headers.push({ html: th.innerHTML });
            });
        }
    }
    
    // 提取表体
    const tbody = sourceTable.querySelector('tbody');
    if (tbody) {
        tbody.querySelectorAll('tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach(td => {
                row.push({ html: td.innerHTML });
            });
            rows.push(row);
        });
    }
    
    // 隐藏原表格
    sourceTable.style.display = 'none';
    
    // 渲染新表格
    const wrapper = renderTable({ headers, rows }, containerId);
    
    return wrapper;
}
