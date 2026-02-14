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
from pathlib import Path

def main():
    # 项目根目录
    project_root = Path(__file__).parent.parent
    notes_dir = project_root / 'interview' / 'html-version'
    public_dir = Path(__file__).parent / 'public'
    notes_public_dir = public_dir / 'notes'
    
    # 创建 public 目录
    public_dir.mkdir(exist_ok=True)
    notes_public_dir.mkdir(exist_ok=True, parents=True)
    
    # 扫描笔记文件
    html_files = []
    if notes_dir.exists():
        print(f"📁 扫描笔记文件: {notes_dir}")
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
        
        # 复制 style.css
        style_css = notes_dir / 'style.css'
        if style_css.exists():
            target_style = notes_public_dir / 'style.css'
            shutil.copy2(style_css, target_style)
            print(f"  ✓ style.css")
    
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
