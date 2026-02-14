#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import time
from urllib.parse import urlparse, parse_qs

PORT = 8000

# 存储文件的修改时间
file_mtimes = {}

def get_file_mtime(file_path):
    """获取文件的修改时间"""
    try:
        return os.path.getmtime(file_path)
    except:
        return 0

def check_files_changed():
    """检查文件是否有变化"""
    changed = False
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                file_path = os.path.join(root, file)
                current_mtime = get_file_mtime(file_path)
                
                if file_path not in file_mtimes:
                    file_mtimes[file_path] = current_mtime
                elif file_mtimes[file_path] != current_mtime:
                    file_mtimes[file_path] = current_mtime
                    changed = True
    return changed

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 如果是请求 files.json（用于文件列表）
        if self.path == '/files.json':
            # 尝试从 public 目录读取（如果存在）
            script_dir = os.path.dirname(os.path.abspath(__file__))
            public_files_json = os.path.join(script_dir, 'public', 'files.json')
            
            if os.path.exists(public_files_json):
                # 如果存在构建好的 files.json，直接返回
                try:
                    with open(public_files_json, 'rb') as f:
                        content = f.read()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(content)
                    return
                except:
                    pass
            
            # 否则动态生成文件列表
            html_files = []
            for root, dirs, files in os.walk('.'):
                for file in files:
                    if file.endswith('.html') and file != 'index.html':
                        rel_path = os.path.join(root, file)
                        rel_path = rel_path.replace('\\', '/').lstrip('./')
                        html_files.append(rel_path)
            
            html_files.sort()
            import json
            response = json.dumps(html_files, ensure_ascii=False)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response.encode('utf-8'))
        # 如果是请求文件列表 API（兼容旧版本）
        elif self.path == '/api/files':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # 扫描所有 HTML 文件（排除 index.html）
            html_files = []
            for root, dirs, files in os.walk('.'):
                for file in files:
                    if file.endswith('.html') and file != 'index.html':
                        rel_path = os.path.join(root, file)
                        # 标准化路径（去掉 ./ 前缀，使用 / 分隔符）
                        rel_path = rel_path.replace('\\', '/').lstrip('./')
                        html_files.append(rel_path)
            
            html_files.sort()
            response = json.dumps(html_files, ensure_ascii=False)
            self.wfile.write(response.encode('utf-8'))
        elif self.path.startswith('/api/check-updates'):
            # 检查文件更新 API（轮询方式）
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # 检查文件是否有变化
            changed = check_files_changed()
            response = json.dumps({
                'updated': changed,
                'timestamp': time.time()
            })
            self.wfile.write(response.encode('utf-8'))
        elif self.path == '/index.html' or self.path == '/':
            # 返回 interview-viewer 目录下的 index.html
            script_dir = os.path.dirname(os.path.abspath(__file__))
            index_path = os.path.join(script_dir, 'index.html')
            try:
                with open(index_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(content)
            except:
                self.send_error(404)
        elif self.path.startswith('/viewer.'):
            # 返回 interview-viewer 目录下的 viewer.js 或 viewer.css
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, self.path.lstrip('/'))
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                if file_path.endswith('.js'):
                    self.send_header('Content-type', 'application/javascript')
                elif file_path.endswith('.css'):
                    self.send_header('Content-type', 'text/css')
                self.end_headers()
                self.wfile.write(content)
            except:
                self.send_error(404)
        elif self.path == '/files.json':
            # 提供 files.json（本地开发时动态生成）
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # 动态扫描 HTML 文件
            html_files = []
            for root, dirs, files in os.walk('.'):
                for file in files:
                    if file.endswith('.html') and file != 'index.html':
                        rel_path = os.path.join(root, file)
                        rel_path = rel_path.replace('\\', '/').lstrip('./')
                        html_files.append(rel_path)
            
            html_files.sort()
            response = json.dumps(html_files, ensure_ascii=False)
            self.wfile.write(response.encode('utf-8'))
        elif self.path == '/style.css':
            # 提供 style.css（从当前目录）
            try:
                with open('style.css', 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-type', 'text/css')
                self.end_headers()
                self.wfile.write(content)
            except:
                self.send_error(404)
        else:
            # 其他请求使用默认的文件服务（从 html-version 目录）
            super().do_GET()

if __name__ == "__main__":
    # 切换到 interview/html-version 目录（笔记文件所在目录）
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_version_dir = os.path.join(script_dir, '..', 'interview', 'html-version')
    os.chdir(html_version_dir)
    
    # 初始化文件修改时间
    check_files_changed()
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 服务器启动在 http://localhost:{PORT}")
        print(f"📖 访问: http://localhost:{PORT}/index.html")
        print(f"📁 工作目录: {os.getcwd()}")
        print("⏹️  按 Ctrl+C 停止服务器")
        httpd.serve_forever()
