/**
 * Maximum Secure Static Site - Zero-Dependency Web Server
 * 
 * A lightweight static file server written in pure Node.js.
 * Requires ZERO external npm packages (no sync lock issues on Google Drive!).
 * Supports dev and production directories, correct MIME types, and path security.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Determine directory mode: dev (src/) or production (dist/)
const isProd = process.argv.includes('--prod');
const baseDir = isProd ? path.join(__dirname, 'dist') : path.join(__dirname, 'src');

// Basic MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Strip query strings
  let safeUrl = req.url.split('?')[0];
  if (safeUrl === '/') {
    safeUrl = '/index.html';
  }
  
  const filePath = path.join(baseDir, safeUrl);
  
  // Direct directory traversal guard
  if (!filePath.startsWith(baseDir)) {
    res.statusCode = 403;
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden - Directory Traversal Blocked');
    return;
  }
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.statusCode = 500;
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Internal Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store, must-revalidate' // Clear browser cache to see live changes
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\x1b[36m==========================================================\x1b[0m`);
  console.log(`\x1b[32m[+] MSSS Static Web Server is actively running!\x1b[0m`);
  console.log(`\x1b[35m[*] Mode: ${isProd ? 'PRODUCTION (Obfuscated & Shielded)' : 'DEVELOPMENT (Source Portal)'}\x1b[0m`);
  console.log(`\x1b[36m[*] Local URL: http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[33m[*] Tip: Press Ctrl+C in terminal to stop server.\x1b[0m`);
  console.log(`\x1b[36m==========================================================\x1b[0m`);
});
