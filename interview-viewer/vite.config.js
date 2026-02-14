import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'src',
  server: {
    port: 8000,
    open: '/',
    // 允许访问父目录的文件（笔记文件）
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html')
    }
  },
  plugins: [
    // 自定义插件：在开发时动态生成 files.json
    {
      name: 'generate-files-json',
      configureServer(server) {
        server.middlewares.use('/files.json', (req, res, next) => {
          const notesDir = resolve(__dirname, '../../interview/html-version');
          const htmlFiles = [];
          
          function scanDir(dir, basePath = '') {
            try {
              const files = fs.readdirSync(dir);
              files.forEach(file => {
                const fullPath = resolve(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                  scanDir(fullPath, basePath ? `${basePath}/${file}` : file);
                } else if (file.endsWith('.html') && file !== 'index.html') {
                  const relPath = basePath ? `${basePath}/${file}` : file;
                  htmlFiles.push(relPath);
                }
              });
            } catch (e) {
              console.error(`Error scanning ${dir}:`, e);
            }
          }
          
          if (fs.existsSync(notesDir)) {
            scanDir(notesDir);
            htmlFiles.sort();
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(JSON.stringify(htmlFiles));
          } else {
            res.statusCode = 404;
            res.end('Notes directory not found');
          }
        });
        
        // 提供笔记文件的静态服务
        server.middlewares.use('/notes', (req, res, next) => {
          const notesDir = resolve(__dirname, '../../interview/html-version');
          // req.url 可能是 "/notes/xxx.html" 或 "/xxx.html"，需要去掉 /notes 前缀
          const relativePath = req.url.replace(/^\/notes/, '').replace(/^\//, '');
          const filePath = resolve(notesDir, relativePath);
          
          // 安全检查：确保文件在 notesDir 内
          if (!filePath.startsWith(notesDir + '/') && filePath !== notesDir) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
          }
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const content = fs.readFileSync(filePath);
            const ext = filePath.split('.').pop();
            const contentType = ext === 'html' ? 'text/html; charset=utf-8' : ext === 'css' ? 'text/css; charset=utf-8' : 'text/plain';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'no-cache');
            res.end(content);
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        });
        
        // 提供 style.css（从 notes 目录）
        server.middlewares.use('/style.css', (req, res, next) => {
          const stylePath = resolve(__dirname, '../../interview/html-version/style.css');
          if (fs.existsSync(stylePath)) {
            const content = fs.readFileSync(stylePath);
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(content);
          } else {
            next();
          }
        });
      }
    }
  ]
});
