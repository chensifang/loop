import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  root: 'src',
  server: {
    port: 8000,
    host: '0.0.0.0', // 允许外部访问
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
    },
    // 构建时复制 notes 目录到 dist 并生成 files.json
    {
      name: 'copy-notes-and-generate-files',
      closeBundle() {
        const notesDir = resolve(__dirname, 'src/notes');
        const distNotesDir = resolve(__dirname, 'dist/notes');
        const distFilesJson = resolve(__dirname, 'dist/files.json');
        
        function copyDir(src, dest) {
          if (!fs.existsSync(src)) {
            return;
          }
          
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          
          const files = fs.readdirSync(src);
          files.forEach(file => {
            const srcPath = resolve(src, file);
            const destPath = resolve(dest, file);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
              copyDir(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          });
        }
        
        function scanDir(dir, basePath = '') {
          const htmlFiles = [];
          
          function scan(dir, basePath) {
            try {
              const files = fs.readdirSync(dir);
              files.forEach(file => {
                const fullPath = resolve(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                  scan(fullPath, basePath ? `${basePath}/${file}` : file);
                } else if (file.endsWith('.html') && file !== 'index.html') {
                  const relPath = basePath ? `${basePath}/${file}` : file;
                  htmlFiles.push(relPath);
                }
              });
            } catch (e) {
              console.error(`Error scanning ${dir}:`, e);
            }
          }
          
          scan(dir, basePath);
          return htmlFiles;
        }
        
        if (fs.existsSync(notesDir)) {
          copyDir(notesDir, distNotesDir);
          console.log('✓ Copied notes directory to dist');
          
          // 生成 files.json
          const htmlFiles = scanDir(distNotesDir);
          htmlFiles.sort();
          fs.writeFileSync(distFilesJson, JSON.stringify(htmlFiles));
          console.log('✓ Generated files.json');
        }
        
        // 复制 style.css 到 dist
        const styleCss = resolve(__dirname, 'src/style.css');
        const distStyleCss = resolve(__dirname, 'dist/style.css');
        if (fs.existsSync(styleCss)) {
          fs.copyFileSync(styleCss, distStyleCss);
          console.log('✓ Copied style.css to dist');
        }
        
        // 复制 table-wrapper.js 到 dist
        const tableWrapperJs = resolve(__dirname, 'src/table-wrapper.js');
        const distTableWrapperJs = resolve(__dirname, 'dist/table-wrapper.js');
        if (fs.existsSync(tableWrapperJs)) {
          fs.copyFileSync(tableWrapperJs, distTableWrapperJs);
          console.log('✓ Copied table-wrapper.js to dist');
        }
        
        // 复制 components 目录到 dist
        const componentsDir = resolve(__dirname, 'src/components');
        const distComponentsDir = resolve(__dirname, 'dist/components');
        if (fs.existsSync(componentsDir)) {
          copyDir(componentsDir, distComponentsDir);
          console.log('✓ Copied components directory to dist');
        }
        
        // 复制其他 JS 文件到 dist
        const jsFiles = ['mermaid-zoom.js', 'table-structure-zoom.js'];
        jsFiles.forEach(file => {
          const srcFile = resolve(__dirname, `src/${file}`);
          const distFile = resolve(__dirname, `dist/${file}`);
          if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, distFile);
            console.log(`✓ Copied ${file} to dist`);
          }
        });
      }
    }
  ]
});
