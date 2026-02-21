// 自动为表格添加滚动包装容器
document.addEventListener('DOMContentLoaded', function() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // 如果表格已经有包装容器，跳过
        if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
            return;
        }
        
        // 创建包装容器
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        
        // 将表格插入到包装容器中
        if (table.parentNode) {
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
    
    console.log('已为', tables.length, '个表格添加滚动包装');
    
    // 调试：检查包装后的结构
    setTimeout(() => {
        const wrappers = document.querySelectorAll('.table-wrapper');
        console.log('找到', wrappers.length, '个表格包装容器');
        wrappers.forEach((wrapper, index) => {
            const table = wrapper.querySelector('table');
            if (table) {
                console.log(`表格 ${index + 1}:`, {
                    wrapperWidth: wrapper.offsetWidth,
                    tableWidth: table.offsetWidth,
                    tableScrollWidth: table.scrollWidth,
                    canScroll: table.scrollWidth > wrapper.offsetWidth
                });
            }
        });
    }, 100);
});
