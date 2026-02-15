// 组件 1: Excel 风格表格结构可视化组件
// 使用方法: 调用 renderTableStructure(data, containerId) 即可

// 先定义绘制函数
function drawTableLinksForContainer(container) {
    if (!container) return;
    
    const svg = container.querySelector('.table-link-svg');
    const svgByTag = container.querySelector('svg');
    if (!svg) {
        // 如果通过 class 找不到，尝试通过 tag 找并修复
        if (svgByTag) {
            // 修复 class（SVG 元素必须使用 setAttribute）
            svgByTag.setAttribute('class', 'table-link-svg');
            const svgFixed = container.querySelector('.table-link-svg');
            if (svgFixed) {
                drawPaths(svgFixed, container);
                return;
            }
        }
        return;
    }
    
    drawPaths(svg, container);
}

function drawPaths(svg, container) {
    
    // 清除之前的路径
    svg.querySelectorAll('path').forEach(path => path.remove());
    
    // 获取容器位置
    const containerRect = container.getBoundingClientRect();
    
    // 查找所有需要连接的行
    const linkRows = container.querySelectorAll('.table-row-link[data-link-to]');
    
    linkRows.forEach(row => {
        const linkTo = row.getAttribute('data-link-to');
        const linkFrom = row.getAttribute('data-link-from') || 'right';
        const target = document.getElementById(linkTo);
        
        if (!target) return;
        
        const rowRect = row.getBoundingClientRect();
        const targetTitle = target.querySelector('.table-structure-title');
        
        // 计算起点：行的右边边缘中心（如果 linkFrom === 'right'）
        let startX, startY;
        if (linkFrom === 'left') {
            startX = rowRect.left - containerRect.left;
        } else {
            startX = rowRect.right - containerRect.left;
        }
        startY = rowRect.top + rowRect.height / 2 - containerRect.top;
        
        // 计算终点：目标块的标题行左侧边缘中心
        let endX, endY;
        if (targetTitle) {
            const titleRect = targetTitle.getBoundingClientRect();
            endX = titleRect.left - containerRect.left;
            endY = titleRect.top + titleRect.height / 2 - containerRect.top;
        } else {
            const targetRect = target.getBoundingClientRect();
            endX = targetRect.left - containerRect.left;
            endY = targetRect.top + targetRect.height / 2 - containerRect.top;
        }
        
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        const isHorizontal = deltaY < 10;
        const isVertical = deltaX < 10;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d;
        
        if (isHorizontal || isVertical) {
            d = `M ${startX} ${startY} L ${endX} ${endY}`;
        } else {
            // 使用三次贝塞尔曲线，确保终点处切线水平（箭头水平指向）
            // 计算中间点，让曲线平滑绕过块
            const midX = (startX + endX) / 2;
            const midY = startY + (endY - startY) * 0.3; // 中间点偏向起点，让曲线更平滑
            
            // 控制点1：起点附近，向右/左延伸
            const control1X = linkFrom === 'right' 
                ? startX + Math.max(30, deltaX * 0.3)
                : startX - Math.max(30, deltaX * 0.3);
            const control1Y = startY;
            
            // 控制点2：终点附近，确保切线水平（Y坐标与终点相同）
            const control2X = endX - Math.max(20, deltaX * 0.15);
            const control2Y = endY;
            
            // 使用三次贝塞尔曲线，终点处切线水平
            d = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('class', 'table-link-path');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(path);
    });
    
    svg.setAttribute('width', containerRect.width);
    svg.setAttribute('height', containerRect.height);
}

function renderTableStructure(data, containerId, options) {
    options = options || {};
    const layout = options.layout || 'hierarchical'; // 默认使用层级布局
    
    const container = document.getElementById(containerId) || document.querySelector(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    // 创建容器
    const wrapper = document.createElement('div');
    wrapper.className = 'table-structure-container';
    
    // 如果是层级布局，按层级深度分列
    if (layout === 'hierarchical') {
        wrapper.classList.add('table-structure-container-hierarchical');
        
        // 构建连接关系图
        const blockMap = {};
        const childrenMap = {}; // 每个块的子块列表
        const parentMap = {}; // 每个块的父块
        
        data.blocks.forEach(block => {
            blockMap[block.id] = block;
            childrenMap[block.id] = [];
        });
        
        // 找出所有连接关系
        data.blocks.forEach(block => {
            if (block.rows) {
                block.rows.forEach(row => {
                    if (row.linkTo) {
                        if (!childrenMap[block.id]) {
                            childrenMap[block.id] = [];
                        }
                        childrenMap[block.id].push(row.linkTo);
                        parentMap[row.linkTo] = block.id;
                    }
                });
            }
        });
        
        // 找出根块（没有被指向的块）
        const rootBlocks = [];
        data.blocks.forEach(block => {
            if (!parentMap[block.id]) {
                rootBlocks.push(block.id);
            }
        });
        
        // 计算每个块的层级深度
        const levelMap = {}; // blockId -> level
        function calculateLevel(blockId, level) {
            if (levelMap[blockId] !== undefined) {
                return levelMap[blockId];
            }
            if (!parentMap[blockId]) {
                levelMap[blockId] = 0;
                return 0;
            }
            const parentLevel = calculateLevel(parentMap[blockId], level);
            levelMap[blockId] = parentLevel + 1;
            return levelMap[blockId];
        }
        
        data.blocks.forEach(block => {
            calculateLevel(block.id, 0);
        });
        
        // 找出最大层级
        const maxLevel = Math.max(...Object.values(levelMap));
        
        // 按层级创建列
        for (let level = 0; level <= maxLevel; level++) {
            const column = document.createElement('div');
            column.className = 'table-structure-column';
            
            // 找出这一层级的所有块
            data.blocks.forEach(block => {
                if (levelMap[block.id] === level) {
                    const structure = createStructureBlock(block, 0);
                    column.appendChild(structure);
                }
            });
            
            wrapper.appendChild(column);
        }
    } else {
        // 原有布局逻辑
        if (layout === 'column' || layout === 'auto') {
            wrapper.classList.add('table-structure-container-column');
        }
        
        // 渲染所有结构块
        data.blocks.forEach((block, index) => {
            const structure = createStructureBlock(block, index);
            wrapper.appendChild(structure);
        });
    }
    
    // 创建 SVG（完全按照原来的方式）
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'table-link-svg'); // SVG 元素必须使用 setAttribute 设置 class
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // 创建 defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // 创建 marker
    // 箭头三角形：points="0 0, 6 3, 0 6"，中心点约在 (3, 3)
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX', '3'); // 三角形中心点 X
    marker.setAttribute('refY', '3'); // 三角形中心点 Y
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 6 3, 0 6');
    polygon.setAttribute('class', 'table-link-arrow');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // SVG 必须是第一个子元素（和原来一样）
    wrapper.insertBefore(svg, wrapper.firstChild);
    
    container.appendChild(wrapper);
    
    // 绘制连接线（完全按照原来的方式）
    setTimeout(function() {
        drawTableLinksForContainer(wrapper);
    }, 100);
    
    // 窗口大小改变时重新绘制（完全按照原来的方式）
    window.addEventListener('resize', function() {
        drawTableLinksForContainer(wrapper);
    });
}

function createStructureBlock(block, index) {
    const structure = document.createElement('div');
    structure.className = 'table-structure';
    if (block.id) {
        structure.id = block.id;
    }
    
    // 如果块需要独立滚动，添加滚动包装
    if (block.scrollable) {
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'table-structure-scroll-wrapper';
        structure.appendChild(scrollWrapper);
        
        // 标题
        const title = document.createElement('div');
        title.className = 'table-structure-title';
        title.textContent = block.title;
        scrollWrapper.appendChild(title);
        
        // 表格块
        const tableBlock = document.createElement('div');
        tableBlock.className = 'table-block';
        scrollWrapper.appendChild(tableBlock);
        
        // 继续处理表格内容
        processTableBlock(block, tableBlock);
        
        return structure;
    }
    
    // 标题
    const title = document.createElement('div');
    title.className = 'table-structure-title';
    title.textContent = block.title;
    structure.appendChild(title);
    
    // 表格块
    const tableBlock = document.createElement('div');
    tableBlock.className = 'table-block';
    
    // 检查哪些列有数据（检查所有行）
    const hasOffset = block.rows && block.rows.some(row => row.offset);
    const hasSize = block.rows && block.rows.some(row => row.size);
    const hasContent = block.rows && block.rows.some(row => row.name || row.type || row.desc || row.linkTo);
    
    // 表头（如果有）
    if (block.headers) {
        const headerRow = document.createElement('div');
        headerRow.className = 'table-row table-row-header';
        block.headers.forEach(header => {
            const headerType = header.type || 'content';
            // 只创建有数据的列的表头
            if ((headerType === 'offset' && hasOffset) ||
                (headerType === 'size' && hasSize) ||
                (headerType === 'content' && hasContent)) {
                const cell = document.createElement('div');
                cell.className = `table-${headerType}`;
                cell.textContent = header.text;
                headerRow.appendChild(cell);
            }
        });
        if (headerRow.children.length > 0) {
            tableBlock.appendChild(headerRow);
        }
    }
    
    // 数据行
    block.rows.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'table-row';
        if (row.linkTo) {
            rowEl.className += ' table-row-link';
            rowEl.setAttribute('data-link-to', row.linkTo);
            // 默认链接方向为 right，只在非默认时设置属性
            if (row.linkFrom && row.linkFrom !== 'right') {
                rowEl.setAttribute('data-link-from', row.linkFrom);
            }
        }
        
        // 创建简单单元格的辅助函数
        function createSimpleCell(className, value, headerType) {
            if (!value && (!block.headers || !block.headers.some(h => h.type === headerType))) {
                return null;
            }
            const cell = document.createElement('div');
            cell.className = className;
            cell.textContent = value || '';
            return cell;
        }
        
        // 偏移列（如果有数据）
        if (hasOffset) {
            const offsetCell = createSimpleCell('table-offset', row.offset, 'offset');
            if (offsetCell) {
                rowEl.appendChild(offsetCell);
            }
        }
        
        // 内容列（如果有数据）
        if (hasContent) {
            const contentCell = document.createElement('div');
            contentCell.className = 'table-content';
            let contentText = [];
            // 按照习惯：类型 变量名 描述
            if (row.name && row.type) {
                contentText.push(`${row.type} ${row.name}`);
            } else if (row.name) {
                contentText.push(row.name);
            } else if (row.type) {
                contentText.push(row.type);
            }
            if (row.desc) contentText.push(row.desc);
            contentCell.textContent = contentText.join(' ');
            // 只有当有内容数据时才添加单元格
            if (contentText.length > 0 || (block.headers && block.headers.some(h => h.type === 'content'))) {
                rowEl.appendChild(contentCell);
            }
        }
        
        // 大小列（如果有数据）
        if (hasSize) {
            const sizeCell = createSimpleCell('table-size', row.size, 'size');
            if (sizeCell) {
                rowEl.appendChild(sizeCell);
            }
        }
        
        tableBlock.appendChild(rowEl);
    });
    
    structure.appendChild(tableBlock);
    return structure;
}
