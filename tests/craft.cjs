'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {parseModelText, validCraftName, isQuota, createCraftService} = require('../server/craft.cjs');

assert.equal(parseModelText('sure {"name":"Moss Tea","emoji":"🍵","family":"food"}').name, 'Moss Tea');
assert.equal(parseModelText('{"name":"<script>","emoji":"🔥","family":"wonder"}'), null);
assert.equal(parseModelText('{"name":"Nothing","emoji":"🔥","family":"wonder"}'), null);
assert.equal(validCraftName('__proto__'), false);
assert.equal(isQuota(429, {}), true);
assert.equal(isQuota(200, {error: {status: 'RESOURCE_EXHAUSTED'}}), true);

function jsonResponse(status, body) {
  return {status, ok: status >= 200 && status < 300, text: async () => JSON.stringify(body)};
}
function gemmaResult(name) {
  return jsonResponse(200, {candidates: [{content: {parts: [{text: JSON.stringify({name, emoji: '🍵', family: 'food'})}]}}]});
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wondercraft-'));
const cacheFile = path.join(dir, 'pairs.json');
const recipesPath = path.join(__dirname, '..', 'dist', 'recipes.js');
let calls = [];

function service(env, handler) {
  calls = [];
  return createCraftService({
    recipesPath,
    cacheFile,
    env,
    log() {},
    fetchImpl: async (url, opts) => {
      calls.push(String(url));
      return handler(url, opts);
    }
  });
}

(async () => {
  const curated = service({}, () => { throw new Error('network'); });
  const steam = await curated.resolve('Fire', 'Water');
  assert.equal(steam.body.name, 'Steam');
  assert.equal(steam.body.source, 'curated');
  assert.equal(calls.length, 0);

  const offline = service({}, () => { throw new Error('network'); });
  const mixed = await offline.resolve('Alien', 'Bread');
  assert.equal(mixed.body.source, 'procedural');
  assert.equal(fs.existsSync(cacheFile), false);

  const gemma = service({GEMINI_API_KEY: 'test-key'}, () => gemmaResult('Moss Tea'));
  const first = await gemma.resolve('Alien', 'Bread');
  assert.equal(first.body.name, 'Moss Tea');
  assert.equal(first.body.source, 'model');
  assert.equal(first.body.isNew, true);
  assert.equal(first.body.model, 'gemma-4-26b-a4b-it');
  const second = await gemma.resolve('Bread', 'Alien');
  assert.equal(second.body.name, 'Moss Tea');
  assert.equal(second.body.isNew, false);
  assert.equal(calls.length, 1);

  calls = [];
  const junk = service({GEMINI_API_KEY: 'test-key'}, () => jsonResponse(200, {candidates: [{content: {parts: [{text: '{"name":"<img>","emoji":"x","family":"wonder"}'}]}}]}));
  const rejected = await junk.resolve('Dragon', 'Tea');
  assert.equal(rejected.body.source, 'procedural');
  assert.equal(calls.length, 2);
  assert.equal(junk.cache().pairs['Dragon|Tea'], undefined);

  calls = [];
  const fallback = service({GEMINI_API_KEY: 'test-key', OPENROUTER_API_KEY: 'test-key'}, url => {
    if (String(url).includes('generativelanguage')) return jsonResponse(429, {error: {status: 'RESOURCE_EXHAUSTED'}});
    return jsonResponse(200, {choices: [{message: {content: '{"name":"Star Bread","emoji":"🍞","family":"food"}'}}]});
  });
  const llama = await fallback.resolve('Star', 'Bread');
  assert.equal(llama.body.name, 'Star Bread');
  assert.equal(llama.body.model, 'meta-llama/llama-3.3-70b-instruct:free');
  assert.ok(calls.some(url => url.includes('openrouter')));

  console.log('PASS: curated pairs skip the model; new pairs cache; junk is rejected; Llama runs only after Gemma quota.');
})().catch(err => { console.error(err); process.exit(1); });
