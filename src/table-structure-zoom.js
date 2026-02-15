/**
 * 组件 1 (table-structure) 点击放大功能
 * 支持鼠标滚轮缩放、触摸手势缩放、拖拽移动
 */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initTableStructureZoom();
    }, 500);
});

function initTableStructureZoom() {
    const containers = document.querySelectorAll('.table-structure-container');
    if (containers.length === 0) return;
    
    // 创建模态框（如果还没有）
    let modal = document.querySelector('.table-structure-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'table-structure-modal';
        modal.innerHTML = `
            <div class="table-structure-modal-content">
                <span class="table-structure-modal-close">&times;</span>
                <div class="table-structure-container-zoom"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const modalContent = modal.querySelector('.table-structure-container-zoom');
    const closeBtn = modal.querySelector('.table-structure-modal-close');
    
    // 屏蔽放大功能 - 不再添加点击事件
    // containers.forEach((container, index) => {
    //     // 如果已经添加过事件监听器，跳过
    //     if (container.dataset.zoomInitialized) return;
    //     container.dataset.zoomInitialized = 'true';
    //     
    //     // 添加点击样式提示
    //     container.style.cursor = 'pointer';
    //     container.style.transition = 'opacity 0.2s';
    //     
    //     container.addEventListener('mouseenter', () => {
    //         container.style.opacity = '0.9';
    //     });
    //     
    //     container.addEventListener('mouseleave', () => {
    //         container.style.opacity = '1';
    //     });
    //     
    //     // 跟踪鼠标移动，区分点击和拖拽
    //     let mouseDownX = 0;
    //     let mouseDownY = 0;
    //     let hasMoved = false;
    //     let isSelecting = false;
    //     
    //     container.addEventListener('mousedown', (e) => {
    //         mouseDownX = e.clientX;
    //         mouseDownY = e.clientY;
    //         hasMoved = false;
    //         isSelecting = false;
    //     });
    //     
    //     container.addEventListener('mousemove', (e) => {
    //         if (mouseDownX !== 0 || mouseDownY !== 0) {
    //             const deltaX = Math.abs(e.clientX - mouseDownX);
    //             const deltaY = Math.abs(e.clientY - mouseDownY);
    //             // 如果移动超过 5 像素，认为是拖拽/选择文本
    //             if (deltaX > 5 || deltaY > 5) {
    //                 hasMoved = true;
    //                 // 检查是否有文本被选中
    //                 const selection = window.getSelection();
    //                 if (selection && selection.toString().length > 0) {
    //                     isSelecting = true;
    //                 }
    //             }
    //         }
    //     });
    //     
    //     container.addEventListener('mouseup', () => {
    //         mouseDownX = 0;
    //         mouseDownY = 0;
    //     });
    //     
    //     container.addEventListener('click', (e) => {
    //         // 如果点击的是连接线或箭头，不触发放大
    //         if (e.target.closest('.table-link-svg') || e.target.closest('.table-row-link')) {
    //             return;
    //         }
    //         
    //         // 如果用户移动了鼠标（拖拽/选择文本），不触发放大
    //         if (hasMoved || isSelecting) {
    //             hasMoved = false;
    //             isSelecting = false;
    //             return;
    //         }
    //         
    //         // 检查是否有文本被选中
    //         const selection = window.getSelection();
    //         if (selection && selection.toString().length > 0) {
    //             return;
    //         }
    //         
    //         // 克隆整个容器
    //         const clonedContainer = container.cloneNode(true);
    //         clonedContainer.id = `table-structure-modal-${index}-${Date.now()}`;
    //         
    //         // 移除克隆容器的点击事件，避免重复触发
    //         clonedContainer.dataset.zoomInitialized = 'false';
    //         
    //         modalContent.innerHTML = '';
    //         modalContent.appendChild(clonedContainer);
    //         modal.classList.add('active');
    //         
    //         // 等待 DOM 更新后初始化缩放
    //         setTimeout(() => {
    //             initZoom(clonedContainer, modalContent);
    //         }, 100);
    //     });
    // });
    
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
    let scale = 1.5; // 默认放大 1.5 倍
    let isDragging = false;
    let startX, startY, startScrollLeft, startScrollTop;
    
    // 设置初始缩放和位置
    element.style.transform = `scale(${scale})`;
    element.style.transformOrigin = 'top left';
    
    // 确保容器可以滚动
    const updateContainerSize = () => {
        const rect = element.getBoundingClientRect();
        const scaledWidth = rect.width * scale;
        const scaledHeight = rect.height * scale;
        
        // 设置容器的最小尺寸，确保可以滚动到所有区域
        element.style.minWidth = `${scaledWidth}px`;
        element.style.minHeight = `${scaledHeight}px`;
    };
    
    updateContainerSize();
    
    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.03 : 0.03;
        const oldScale = scale;
        scale = Math.max(0.5, Math.min(5, scale + delta));
        
        // 缩放时保持鼠标位置不变
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + container.scrollLeft;
        const mouseY = e.clientY - rect.top + container.scrollTop;
        
        element.style.transform = `scale(${scale})`;
        element.style.transformOrigin = 'top left';
        
        // 调整滚动位置，使鼠标下的点保持在同一位置
        container.scrollLeft = mouseX * (scale / oldScale) - (e.clientX - rect.left);
        container.scrollTop = mouseY * (scale / oldScale) - (e.clientY - rect.top);
        
        updateContainerSize();
    }, { passive: false });
    
    // 触摸手势缩放
    let touchStartDistance = 0;
    let initialScale = scale;
    
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            touchStartDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = scale;
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
            element.style.transform = `scale(${scale})`;
            element.style.transformOrigin = 'top left';
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
