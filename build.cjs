const fs=require('node:fs');
for(const f of ['index.html','style.css','recipes.js','app.js'])if(!fs.existsSync('dist/'+f))throw Error('Missing '+f);
console.log('Static site ready in dist/. No compilation or dependencies needed.');
