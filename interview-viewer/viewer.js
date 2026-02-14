// 自动获取文件列表（从 files.json 读取）
async function getFileList() {
    try {
        const response = await fetch('/files.json');
        if (!response.ok) {
            throw new Error('无法获取文件列表');
        }
        const files = await response.json();
        return files;
    } catch (error) {
        console.error('获取文件列表失败:', error);
        // 如果 files.json 不存在，使用默认列表（本地开发时的后备方案）
        return [
            '01-问题合集.html',
            '内存管理/ARC内存管理与循环引用/01-简述ARC的工作原理.html',
            '内存管理/ARC内存管理与循环引用/02-循环引用的产生与解决.html',
            '内存管理/ARC内存管理与循环引用/03-weak和unowned的区别和使用场景.html'
        ];
    }
}

// 构建文件树结构
function buildFileTree(files) {
    const tree = { name: '笔记', type: 'folder', children: [] };
    const pathMap = {};
    
    files.forEach(filePath => {
        const parts = filePath.split('/');
        let current = tree;
        
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const key = parts.slice(0, index + 1).join('/');
            
            if (!pathMap[key]) {
                const node = {
                    name: part,
                    type: isFile ? 'file' : 'folder',
                    path: isFile ? filePath : null,
                    children: isFile ? null : []
                };
                
                pathMap[key] = node;
                current.children.push(node);
            }
            
            current = pathMap[key];
        });
    });
    
    return tree;
}

// 渲染文件树
function renderFileTree(node, container, level = 0, parentExpanded = true) {
    const item = document.createElement('div');
    item.className = `file-tree-item ${node.type}`;
    item.style.paddingLeft = `${level * 14 + 6}px`;
    
    // 文件夹展开/收起状态（默认根节点展开，其他收起）
    const isExpanded = node.expanded !== undefined ? node.expanded : (level === 0);
    const hasChildren = node.children && node.children.length > 0;
    
    // 三角形图标（仅文件夹显示）- 使用等边三角形 SVG
    let triangleIcon = '';
    if (node.type === 'folder' && hasChildren) {
        // 等边三角形：向右（收起）和向下（展开）
        // 等边三角形路径：顶点在 (2,1), (2,7), (6,4)
        const triangleSvg = isExpanded 
            ? '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1l4 3-4 3V1z" fill="currentColor" transform="rotate(90 4 4)"/></svg>'
            : '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1l4 3-4 3V1z" fill="currentColor"/></svg>';
        triangleIcon = `<span class="tree-toggle">${triangleSvg}</span>`;
    } else if (node.type === 'folder') {
        const triangleSvg = '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1l4 3-4 3V1z" fill="currentColor" opacity="0.3"/></svg>';
        triangleIcon = `<span class="tree-toggle">${triangleSvg}</span>`;
    } else {
        triangleIcon = '<span class="tree-toggle"></span>'; // 文件占位
    }
    
    // 文件夹显示图标，文件不显示图标
    let iconHtml = '';
    if (node.type === 'folder') {
        const icon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H6.58579C6.98361 2 7.36514 2.15804 7.64645 2.43934L8.35355 3.14645C8.63486 3.42776 9.01639 3.58579 9.41421 3.58579H13.5C14.3284 3.58579 15 4.25722 15 5.08579V12.5C15 13.3284 14.3284 14 13.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z" fill="currentColor" opacity="0.6"/></svg>';
        iconHtml = `<span class="icon">${icon}</span>`;
    }
    
    item.innerHTML = `${triangleIcon}${iconHtml}<span class="file-name">${node.name}</span>`;
    
    container.appendChild(item);
    
    // 文件夹点击展开/收起
    if (node.type === 'folder' && hasChildren) {
        // 创建子节点容器（始终创建，但根据展开状态显示/隐藏）
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        childrenContainer.style.display = isExpanded ? 'block' : 'none';
        
        // 渲染子节点
        node.children.forEach(child => {
            renderFileTree(child, childrenContainer, level + 1, isExpanded && parentExpanded);
        });
        
        container.appendChild(childrenContainer);
        
        // 添加点击事件 - 点击文件夹任何地方都可以展开/收起
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            node.expanded = !node.expanded;
            
            // 更新三角形图标
            const toggle = item.querySelector('.tree-toggle');
            if (toggle) {
                const triangleSvg = node.expanded 
                    ? '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1l4 3-4 3V1z" fill="currentColor" transform="rotate(90 4 4)"/></svg>'
                    : '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1l4 3-4 3V1z" fill="currentColor"/></svg>';
                toggle.innerHTML = triangleSvg;
            }
            
            // 切换子节点显示
            childrenContainer.style.display = node.expanded ? 'block' : 'none';
        });
    }
    
    // 文件点击加载
    if (node.type === 'file' && node.path) {
        // 保存文件路径到 data 属性，方便刷新后恢复选中状态
        item.dataset.path = node.path;
        
        item.addEventListener('click', () => {
            loadFile(node.path);
            document.querySelectorAll('.file-tree-item').forEach(el => {
                el.classList.remove('active');
            });
            item.classList.add('active');
        });
        
        // 如果是当前选中的文件，标记为 active
        if (currentFilePath === node.path) {
            item.classList.add('active');
        }
    }
}

// 当前选中的文件路径（用于刷新后恢复）
let currentFilePath = null;

// 加载文件内容
async function loadFile(filePath) {
    // 记住当前文件路径
    currentFilePath = filePath;
    try {
        // 判断是本地开发环境还是生产环境
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // 本地开发：文件通过服务器提供（server.py 从 html-version 目录提供）
        // 生产环境（Vercel）：文件在 /notes/ 目录下
        const basePath = isLocalDev ? '' : '/notes';
        const url = `${basePath}/${filePath}?t=${Date.now()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`无法加载文件: ${filePath}`);
        }
        
        const html = await response.text();
        
        // 使用正则表达式提取 body 内容
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        
        if (bodyMatch) {
            let bodyContent = bodyMatch[1];
            
            // 移除 script 标签
            bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            
            // 更新内容
            const contentBody = document.getElementById('contentBody');
            contentBody.innerHTML = bodyContent;
            
            // 重新渲染 Mermaid 图表
            setTimeout(() => {
                if (window.mermaid) {
                    const mermaidElements = contentBody.querySelectorAll('pre.mermaid');
                    if (mermaidElements.length > 0) {
                        window.mermaid.run({
                            nodes: Array.from(mermaidElements)
                        });
                    }
                }
            }, 300);
        } else {
            // 如果没有 body 标签，直接显示整个 HTML
            document.getElementById('contentBody').innerHTML = html;
            
            // 尝试渲染 Mermaid
            setTimeout(() => {
                if (window.mermaid) {
                    window.mermaid.run();
                }
            }, 300);
        }
        
        // 滚动到顶部
        document.getElementById('contentBody').scrollTop = 0;
        
    } catch (error) {
        console.error('加载文件失败:', error);
        document.getElementById('contentBody').innerHTML = `
            <div class="error-message">
                <p>❌ 无法加载文件: ${filePath}</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// 刷新当前文件
function refreshCurrentFile() {
    if (currentFilePath) {
        // 重新加载当前文件（强制刷新，不使用缓存）
        loadFile(currentFilePath);
        
        // 更新文件树中的 active 状态
        setTimeout(() => {
            document.querySelectorAll('.file-tree-item').forEach(el => {
                el.classList.remove('active');
                if (el.dataset.path === currentFilePath) {
                    el.classList.add('active');
                }
            });
        }, 100);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    const fileTreeContainer = document.getElementById('fileTree');
    
    // 获取文件列表
    const htmlFiles = await getFileList();
    
    // 构建并渲染文件树
    const fileTreeData = buildFileTree(htmlFiles);
    renderFileTree(fileTreeData, fileTreeContainer);
    
    // 注意：在 Vercel 部署后，文件是静态的，不需要检查更新
    // 如果需要实时更新，需要重新部署
});
