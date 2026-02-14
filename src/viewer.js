// 自动获取文件列表（从 files.json 读取）
async function getFileList() {
    try {
        const response = await fetch(`/files.json?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error('无法获取文件列表');
        }
        const files = await response.json();
        return files;
    } catch (error) {
        console.error('获取文件列表失败:', error);
        return [];
    }
}

// 构建文件树数据结构
function buildFileTree(files) {
    const root = { name: 'loop', type: 'folder', children: [], expanded: true };
    
    files.forEach(file => {
        const parts = file.split('/');
        let current = root;
        
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            
            if (isFile) {
                // 文件节点
                const fileNode = {
                    name: part,
                    type: 'file',
                    path: file,
                    children: []
                };
                current.children.push(fileNode);
            } else {
                // 文件夹节点
                let folder = current.children.find(child => child.name === part && child.type === 'folder');
                if (!folder) {
                    folder = {
                        name: part,
                        type: 'folder',
                        children: [],
                        expanded: true  // 默认展开
                    };
                    current.children.push(folder);
                }
                current = folder;
            }
        });
    });
    
    return root;
}

// 渲染文件树
function renderFileTree(node, container, level = 0) {
    if (node.type === 'folder') {
        const item = document.createElement('div');
        item.className = 'file-tree-item folder';
        
        const toggle = document.createElement('span');
        toggle.className = 'tree-toggle';
        // 文件夹默认展开，显示向下等边三角形（实心）
        toggle.innerHTML = '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2L4 6L7 2" fill="currentColor"/></svg>';
        
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = node.name;
        
        item.appendChild(toggle);
        item.appendChild(name);
        
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        childrenContainer.style.display = node.expanded ? 'block' : 'none';
        
        // 渲染子节点
        node.children.forEach(child => {
            renderFileTree(child, childrenContainer, level + 1);
        });
        
        container.appendChild(item);
        container.appendChild(childrenContainer);
        
        // 添加点击事件 - 展开/收起文件夹
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            node.expanded = !node.expanded;
            
            // 更新等边三角形图标（实心）
            const triangleSvg = node.expanded 
                ? '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2L4 6L7 2" fill="currentColor"/></svg>'
                : '<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1L6 4L2 7" fill="currentColor"/></svg>';
            toggle.innerHTML = triangleSvg;
            
            // 切换子节点显示
            childrenContainer.style.display = node.expanded ? 'block' : 'none';
        });
    }
    
    // 文件点击跳转
    if (node.type === 'file' && node.path) {
        const item = document.createElement('div');
        item.className = 'file-tree-item file';
        
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = node.name.replace('.html', '');
        item.appendChild(name);
        
        // 文件链接：直接跳转到笔记页面
        item.addEventListener('click', () => {
            // 直接跳转到笔记页面
            window.location.href = `/notes/${node.path}`;
        });
        
        container.appendChild(item);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    const fileTreeContainer = document.getElementById('fileTree');
    
    // 获取文件列表
    const htmlFiles = await getFileList();
    
    // 构建并渲染文件树（默认全部展开）
    const fileTreeData = buildFileTree(htmlFiles);
    renderFileTree(fileTreeData, fileTreeContainer);
});
