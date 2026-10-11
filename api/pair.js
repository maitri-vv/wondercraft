'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {createCraftService} = require('../server/craft.cjs');

function recipesPath() {
  const candidates = [
    path.join(process.cwd(), 'dist', 'recipes.js'),
    path.join(__dirname, '..', 'dist', 'recipes.js')
  ];
  return candidates.find(file => fs.existsSync(file)) || candidates[0];
}

const craft = createCraftService({
  recipesPath: recipesPath(),
  cacheFile: process.env.VERCEL ? '/tmp/wondercraft-pairs.json' : path.join(__dirname, '..', 'server', 'data', 'pairs.json'),
  log: message => console.log(message)
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'method'});
    return;
  }
  let payload = req.body;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch { payload = null; }
  }
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({error: 'bad json'});
    return;
  }
  try {
    const result = await craft.resolve(payload.a, payload.b);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({error: 'server'});
  }
};
