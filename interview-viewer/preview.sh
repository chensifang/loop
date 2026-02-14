#!/bin/bash
# HTML 文件预览脚本

# 获取当前文件路径
FILE_PATH="$1"

if [ -z "$FILE_PATH" ]; then
    echo "用法: ./preview.sh <html文件路径>"
    exit 1
fi

# 打开文件
open "$FILE_PATH"
