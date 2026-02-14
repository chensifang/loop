/**
 * Mermaid 图表点击放大功能
 * 支持鼠标滚轮缩放、触摸手势缩放、拖拽移动
 */

// 立即保存所有 Mermaid 图表的原始代码（在渲染之前）
document.addEventListener('DOMContentLoaded', () => {
    // 立即保存原始代码
    document.querySelectorAll('.mermaid').forEach(chart => {
        if (!chart.dataset.originalCode) {
            const code = chart.textContent.trim();
            if (code) {
                chart.dataset.originalCode = code;
            }
        }
    });
    
    // 等待一小段时间确保 Mermaid 已经初始化
    setTimeout(() => {
        initMermaidZoom();
    }, 500);
});

function initMermaidZoom() {
    const mermaidCharts = document.querySelectorAll('.mermaid');
    if (mermaidCharts.length === 0) return;
    
    // 创建模态框（如果还没有）
    let modal = document.querySelector('.mermaid-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'mermaid-modal';
        modal.innerHTML = `
            <div class="mermaid-modal-content">
                <span class="mermaid-modal-close">&times;</span>
                <div class="mermaid-container"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const modalContent = modal.querySelector('.mermaid-container');
    const closeBtn = modal.querySelector('.mermaid-modal-close');
    
    // 为每个 Mermaid 图表添加点击事件
    mermaidCharts.forEach((chart, index) => {
        // 如果已经添加过事件监听器，跳过
        if (chart.dataset.zoomInitialized) return;
        chart.dataset.zoomInitialized = 'true';
        
        // 保存原始的 Mermaid 代码
        // 优先从 textContent 获取（Mermaid 渲染前）
        let originalCode = chart.textContent.trim();
        
        // 如果已经被渲染成 SVG，尝试从 data-code 属性获取
        if (!originalCode || chart.querySelector('svg')) {
            // 检查是否有保存的代码
            if (chart.dataset.originalCode) {
                originalCode = chart.dataset.originalCode;
            } else {
                // 尝试从 innerText 获取（可能包含文本）
                originalCode = chart.innerText.trim();
            }
        }
        
        // 如果还是没有，保存当前文本内容到 data 属性
        if (originalCode && !chart.dataset.originalCode) {
            chart.dataset.originalCode = originalCode;
        }
        
        chart.addEventListener('click', async () => {
            // 获取要渲染的代码（优先使用保存的原始代码）
            let codeToRender = chart.dataset.originalCode || originalCode;
            
            if (!codeToRender) {
                console.warn('无法获取 Mermaid 代码，请检查图表是否正确渲染');
                return;
            }
            
            // 动态导入 mermaid（如果还没有加载）
            let mermaidModule;
            try {
                mermaidModule = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
                const mermaid = mermaidModule.default || mermaidModule;
                
                // 创建新的容器用于显示放大的图表
                const newChart = document.createElement('div');
                newChart.className = 'mermaid';
                newChart.textContent = codeToRender;
                newChart.id = `mermaid-modal-${index}-${Date.now()}`;
                
                modalContent.innerHTML = '';
                modalContent.appendChild(newChart);
                modal.classList.add('active');
                
                // 重新渲染 Mermaid 图表
                try {
                    await mermaid.run({
                        nodes: [newChart]
                    });
                    
                    // 等待 SVG 渲染完成后再初始化缩放
                    setTimeout(() => {
                        initZoom(newChart, modalContent);
                    }, 100);
                } catch (e) {
                    console.error('Mermaid render error:', e);
                }
            } catch (e) {
                console.error('Failed to load mermaid:', e);
            }
        });
    });
    
    // 关闭按钮事件
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// 缩放功能
function initZoom(element, container) {
    const svg = element.querySelector('svg');
    if (!svg) return;
    
    let scale = 1.5; // 默认放大 1.5 倍
    let isDragging = false;
    let startX, startY, startScrollLeft, startScrollTop;
    
    // 设置初始缩放和位置
    svg.style.transform = `scale(${scale})`;
    svg.style.transformOrigin = 'top left';
    
    // 确保容器可以滚动
    const updateContainerSize = () => {
        const svgRect = svg.getBoundingClientRect();
        const scaledWidth = svgRect.width * scale;
        const scaledHeight = svgRect.height * scale;
        
        // 设置容器的最小尺寸，确保可以滚动到所有区域
        element.style.minWidth = `${scaledWidth}px`;
        element.style.minHeight = `${scaledHeight}px`;
    };
    
    updateContainerSize();
    
    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        // 减小缩放增量，让缩放更精细
        const delta = e.deltaY > 0 ? -0.03 : 0.03;
        const oldScale = scale;
        scale = Math.max(0.5, Math.min(5, scale + delta));
        
        // 缩放时保持鼠标位置不变
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + container.scrollLeft;
        const mouseY = e.clientY - rect.top + container.scrollTop;
        
        svg.style.transform = `scale(${scale})`;
        svg.style.transformOrigin = 'top left';
        
        // 调整滚动位置，使鼠标下的点保持在同一位置
        container.scrollLeft = mouseX * (scale / oldScale) - (e.clientX - rect.left);
        container.scrollTop = mouseY * (scale / oldScale) - (e.clientY - rect.top);
        
        updateContainerSize();
    }, { passive: false });
    
    // 触摸手势缩放
    let touchStartDistance = 0;
    let initialScale = scale;
    let touchStartScrollLeft = 0;
    let touchStartScrollTop = 0;
    
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            touchStartDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = scale;
            touchStartScrollLeft = container.scrollLeft;
            touchStartScrollTop = container.scrollTop;
        } else if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startScrollLeft = container.scrollLeft;
            startScrollTop = container.scrollTop;
        }
    }, { passive: false });
    
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            scale = Math.max(0.5, Math.min(5, initialScale * (currentDistance / touchStartDistance)));
            svg.style.transform = `scale(${scale})`;
            svg.style.transformOrigin = 'top left';
            updateContainerSize();
        } else if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            const deltaX = startX - e.touches[0].clientX;
            const deltaY = startY - e.touches[0].clientY;
            container.scrollLeft = startScrollLeft + deltaX;
            container.scrollTop = startScrollTop + deltaY;
        }
    }, { passive: false });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
        touchStartDistance = 0;
    });
    
    // 鼠标拖拽
    container.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !e.ctrlKey && !e.metaKey) { // 左键且不是 Ctrl/Cmd
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startScrollLeft = container.scrollLeft;
            startScrollTop = container.scrollTop;
            container.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const deltaX = startX - e.clientX;
            const deltaY = startY - e.clientY;
            container.scrollLeft = startScrollLeft + deltaX;
            container.scrollTop = startScrollTop + deltaY;
        }
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });
    
    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });
    
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
