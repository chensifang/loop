#!/usr/bin/env python3
"""
Vercel 构建脚本：
1. 扫描 interview/html-version/ 目录下的所有笔记文件
2. 生成 files.json 文件列表
3. 复制笔记文件到 public/notes/ 目录
4. 复制 viewer 文件到 public/ 目录
"""
import os
import json
import shutil
import sys
from pathlib import Path

def main():
    # 获取当前脚本所在目录
    script_dir = Path(__file__).parent
    current_dir = Path.cwd()
    
    print(f"📂 脚本目录: {script_dir}")
    print(f"📂 当前工作目录: {current_dir}")
    
    # 尝试找到 interview/html-version 目录
    # 可能的位置：
    # 1. 从脚本目录向上查找（如果脚本在 interview-viewer/）
    # 2. 从当前工作目录查找（Vercel 可能在项目根目录）
    possible_notes_dirs = [
        script_dir.parent / 'interview' / 'html-version',  # 从脚本目录向上
        current_dir / 'interview' / 'html-version',         # 从当前目录
        current_dir.parent / 'interview' / 'html-version',  # 从当前目录向上
    ]
    
    notes_dir = None
    for test_dir in possible_notes_dirs:
        if test_dir.exists():
            notes_dir = test_dir
            print(f"✅ 找到笔记目录: {notes_dir}")
            break
    
    if not notes_dir:
        print("❌ 错误: 找不到 interview/html-version 目录")
        print("   尝试的路径:")
        for test_dir in possible_notes_dirs:
            print(f"     - {test_dir} (存在: {test_dir.exists()})")
        sys.exit(1)
    
    # public 目录应该在脚本所在目录
    public_dir = script_dir / 'public'
    notes_public_dir = public_dir / 'notes'
    
    # 创建 public 目录
    public_dir.mkdir(exist_ok=True)
    notes_public_dir.mkdir(exist_ok=True, parents=True)
    
    # 扫描笔记文件
    html_files = []
    print(f"📁 扫描笔记文件: {notes_dir}")
    print(f"📁 输出目录: {public_dir}")
    
    for root, dirs, files in os.walk(notes_dir):
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                file_path = Path(root) / file
                # 计算相对于 notes_dir 的路径
                rel_path = file_path.relative_to(notes_dir)
                rel_path_str = str(rel_path).replace('\\', '/')
                html_files.append(rel_path_str)
                
                # 复制文件到 public/notes/，保持目录结构
                target_path = notes_public_dir / rel_path
                target_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, target_path)
                print(f"  ✓ {rel_path_str}")
    
    # 复制 style.css 到两个位置：
    # 1. public/notes/style.css（保持笔记文件中的相对路径引用）
    # 2. public/style.css（供主页面使用）
    style_css = notes_dir / 'style.css'
    if style_css.exists():
        # 复制到 notes 目录
        target_style_notes = notes_public_dir / 'style.css'
        shutil.copy2(style_css, target_style_notes)
        print(f"  ✓ notes/style.css")
        
        # 复制到 public 根目录
        target_style_root = public_dir / 'style.css'
        shutil.copy2(style_css, target_style_root)
        print(f"  ✓ style.css (根目录)")
    
    # 排序文件列表
    html_files.sort()
    
    # 生成 files.json
    files_json_path = public_dir / 'files.json'
    with open(files_json_path, 'w', encoding='utf-8') as f:
        json.dump(html_files, f, ensure_ascii=False, indent=2)
    print(f"\n📄 生成文件列表: {files_json_path}")
    print(f"   共 {len(html_files)} 个文件")
    
    # 复制 viewer 文件到 public
    viewer_files = ['index.html', 'viewer.js', 'viewer.css']
    for file in viewer_files:
        src = Path(__file__).parent / file
        if src.exists():
            dst = public_dir / file
            shutil.copy2(src, dst)
            print(f"  ✓ {file}")
    
    print("\n✅ 构建完成！")

if __name__ == '__main__':
    main()
