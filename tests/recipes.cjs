const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('dist/recipes.js','utf8');
function fresh(){const c=vm.createContext({setTimeout});vm.runInContext(src+';globalThis.api={ELEMENTS,RECIPES,inventRecipe,restoreInventions};',c);return c.api;}
const a=fresh(),names=Object.keys(a.ELEMENTS);let pairs=0;
for(let i=0;i<names.length;i++)for(let j=i;j<names.length;j++){const r=a.inventRecipe(names[i],names[j]);assert.ok(r.name&&r.emoji);assert.equal(r.name,a.inventRecipe(names[j],names[i]).name);assert.equal(r.name,a.inventRecipe(names[i],names[j]).name);pairs++;}
const b=fresh(),journal=[];let left='Fire',right='Boat';
for(let i=0;i<150;i++){const r=b.inventRecipe(left,right);journal.push({a:left,b:right,result:r.name,date:'2026-10-11'});left=r.name;right=names[(i*17)%names.length];}
const c=fresh();assert.equal(c.restoreInventions(journal).length,journal.length);for(const r of journal)assert.equal(c.inventRecipe(r.a,r.b).name,r.result);
assert.equal(c.restoreInventions([{a:'<img onerror=alert(1)>',b:'Water',result:'bad'}]).length,0);
assert.equal(c.restoreInventions([{a:'__proto__',b:'Water',result:'bad'}]).length,0);
const old=[{a:'Water',b:'Fire',result:'Steam'},{a:'Steam',b:'Wind',result:'Cloud'}];assert.equal(c.restoreInventions(old).length,2);
assert.equal(c.inventRecipe('Fire','Water').name,'Steam');
const d=fresh();
const restored=d.restoreInventions([{source:'model',a:'Alien',b:'Bread',result:'Solar Tea',emoji:'🍵',family:'food',date:'2026-10-11'}]);
assert.equal(restored.length,1);
assert.equal(d.inventRecipe('Alien','Bread').name,'Solar Tea');
assert.equal(d.ELEMENTS['Solar Tea'].emoji,'🍵');
assert.equal(d.ELEMENTS['Solar Tea'].model,true);
assert.equal(d.restoreInventions([{source:'model',a:'Water',b:'Fire',result:'<img>',emoji:'x',family:'wonder'}]).length,0);
assert.equal(d.inventRecipe('Water','Fire').name,'Steam');
console.log(`PASS: ${pairs} pairs resolve; reversed/repeated pairs agree; 150 generated generations restore; old saves, model saves, and invalid inputs checked.`);
