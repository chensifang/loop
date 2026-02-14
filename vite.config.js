import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'src',
  server: {
    port: 8000,
    open: '/',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    // 生成文件列表（用于目录页面）
    {
      name: 'generate-files-json',
      configureServer(server) {
        const notesDir = resolve(__dirname, 'src/notes');
        
        server.middlewares.use('/files.json', (req, res, next) => {
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
      }
    }
  ]
});
