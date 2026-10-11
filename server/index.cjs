'use strict';
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {createCraftService, loadEnv, GEMMA_MODEL} = require('./craft.cjs');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
loadEnv(path.join(root, '.env'));

const craft = createCraftService({
  recipesPath: path.join(dist, 'recipes.js'),
  cacheFile: path.join(__dirname, 'data', 'pairs.json'),
  log: message => console.log(message)
});

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function send(res, status, body, type) {
  res.writeHead(status, {'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
  res.end(body);
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body), 'application/json; charset=utf-8');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 4096) { reject(new Error('large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function staticFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(dist, rel));
  if (file !== dist && !file.startsWith(dist + path.sep)) return null;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return file;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/api/health') return sendJson(res, 200, craft.health());
    if (req.method === 'POST' && url.pathname === '/api/pair') {
      let payload;
      try { payload = JSON.parse(await readBody(req)); } catch { return sendJson(res, 400, {error: 'bad json'}); }
      const result = await craft.resolve(payload.a, payload.b);
      return sendJson(res, result.status, result.body);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, {error: 'method'});
    const file = staticFile(url.pathname);
    if (!file) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    const body = req.method === 'HEAD' ? undefined : fs.readFileSync(file);
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff'});
    res.end(body);
  } catch (err) {
    if (!res.headersSent) sendJson(res, 500, {error: 'server'});
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  const status = craft.health();
  console.log(`Wondercraft http://localhost:${port}`);
  console.log(status.gemma ? `Gemma ${GEMMA_MODEL} is on. New pairs are saved for every player.` : 'No GEMINI_API_KEY. Handcrafted recipes work; other pairs use the local mixer.');
  console.log(status.llama ? 'Llama fallback is on for when Gemma quota runs out.' : 'No OPENROUTER_API_KEY. Llama fallback is off.');
});
