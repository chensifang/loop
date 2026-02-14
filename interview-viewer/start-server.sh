#!/bin/bash
# 启动本地服务器并打开浏览器

cd "$(dirname "$0")"
PORT=8000

echo "🚀 启动本地服务器..."
echo "📖 访问地址: http://localhost:$PORT/index.html"
echo "📁 笔记目录: ../interview/html-version"
echo "⏹️  按 Ctrl+C 停止服务器"
echo ""

# 使用 Python 服务器（支持 API）
python3 server.py &
SERVER_PID=$!

# 等待服务器启动
sleep 1

# 检查服务器是否启动成功
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ 服务器已启动 (PID: $SERVER_PID)"
    echo "🌐 正在打开浏览器..."
    open "http://localhost:$PORT/index.html"
    
    # 等待用户按 Ctrl+C
    trap "echo ''; echo '🛑 正在停止服务器...'; kill $SERVER_PID; exit" INT
    wait $SERVER_PID
else
    echo "❌ 服务器启动失败"
    exit 1
fi
