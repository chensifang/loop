// 表格包装功能已禁用，使用默认 HTML 表格样式
// document.addEventListener('DOMContentLoaded', function() {
//     const tables = document.querySelectorAll('table');
//     
//     tables.forEach(table => {
//         // 如果表格已经有包装容器，跳过
//         if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
//             return;
//         }
//         
//         // 创建包装容器
//         const wrapper = document.createElement('div');
//         wrapper.className = 'table-wrapper';
//         
//         // 将表格插入到包装容器中
//         if (table.parentNode) {
//             table.parentNode.insertBefore(wrapper, table);
//             wrapper.appendChild(table);
//         }
//     });
//     
//     console.log('已为', tables.length, '个表格添加滚动包装');
// });
