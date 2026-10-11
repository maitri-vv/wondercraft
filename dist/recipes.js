/* Curated local recipe provider. Replace resolveRecipe() with your own API later. */
const ELEMENTS = {};
const RECIPES = new Map();
const pairKey = (a,b) => [a,b].sort().join('|');
function element(name,emoji,family='wonder'){ ELEMENTS[name]={name,emoji,family}; }
[['Water','💧','nature'],['Fire','🔥','energy'],['Wind','🌬️','sky'],['Earth','🌱','nature']].forEach(e=>element(...e));
function recipe(a,b,c,emoji,family){if(!ELEMENTS[c])element(c,emoji,family);RECIPES.set(pairKey(a,b),c);}
const recipeData = [
['Water','Fire','Steam','☁️','sky'],['Water','Earth','Plant','🌿','nature'],['Fire','Earth','Lava','🌋','energy'],['Wind','Earth','Dust','💨','nature'],['Wind','Water','Wave','🌊','water'],['Fire','Wind','Energy','⚡','energy'],['Water','Water','Lake','🏞️','water'],['Fire','Fire','Sun','☀️','sky'],['Earth','Earth','Mountain','⛰️','nature'],['Wind','Wind','Tornado','🌪️','sky'],
['Steam','Wind','Cloud','☁️','sky'],['Steam','Water','Cloud','☁️'],['Cloud','Water','Rain','🌧️','sky'],['Cloud','Cloud','Rain','🌧️'],['Rain','Sun','Rainbow','🌈','sky'],['Water','Sun','Rainbow','🌈'],['Plant','Water','Tree','🌳','nature'],['Plant','Plant','Garden','🌷','nature'],['Tree','Tree','Forest','🌲','nature'],['Plant','Sun','Flower','🌼','nature'],['Flower','Wind','Dandelion','🌻','nature'],['Flower','Flower','Bouquet','💐','nature'],['Garden','Water','Pond','🪷','water'],['Lake','Lake','Ocean','🌊','water'],['Lake','Water','Ocean','🌊'],['Ocean','Wind','Sailboat','⛵','journey'],['Lava','Water','Stone','🪨','nature'],['Stone','Wind','Sand','🏜️','nature'],['Stone','Stone','Boulder','🪨','nature'],['Sand','Fire','Glass','🔮','wonder'],['Sand','Water','Beach','🏖️','journey'],['Ocean','Earth','Island','🏝️','journey'],['Island','Tree','Palm','🌴','nature'],['Fire','Tree','Campfire','🏕️','journey'],['Forest','Fire','Campfire','🏕️'],['Campfire','Cloud','Smoke','💭','sky'],['Fire','Plant','Smoke','💭'],['Smoke','Wind','Cloud','☁️'],['Earth','Rain','Mud','🟤','nature'],['Mud','Fire','Brick','🧱','maker'],['Brick','Brick','House','🏠','maker'],['House','House','Village','🏘️','maker'],['Village','Village','City','🏙️','maker'],['Mountain','Wind','Snow','❄️','sky'],['Cloud','Mountain','Snow','❄️'],['Snow','Water','Ice','🧊','water'],['Snow','Snow','Snowman','⛄','wonder'],['Mountain','Fire','Volcano','🌋','energy'],['Mountain','Mountain','Range','🏔️','nature'],['Sun','Mountain','Sunset','🌅','sky'],['Sunset','Cloud','Night','🌌','sky'],['Sun','Night','Moon','🌙','sky'],['Night','Earth','Moon','🌙'],['Moon','Energy','Star','⭐','sky'],['Night','Fire','Star','⭐'],['Star','Star','Galaxy','🌌','sky'],['Galaxy','Galaxy','Universe','🪐','sky'],['Star','Wind','Comet','☄️','sky'],['Moon','Water','Tide','🌊','water'],['Ocean','Moon','Tide','🌊'],['Garden','Flower','Butterfly','🦋','life'],['Flower','Energy','Bee','🐝','life'],['Bee','Flower','Honey','🍯','food'],['Water','Energy','Life','✨','life'],['Life','Ocean','Fish','🐠','life'],['Life','Water','Fish','🐠'],['Fish','Fish','School','🐟','life'],['Life','Wind','Bird','🐦','life'],['Bird','Fire','Phoenix','🐦‍🔥','wonder'],['Bird','Night','Owl','🦉','life'],['Life','Earth','Human','🧑','life'],['Human','Tree','Wood','🪵','maker'],['Wood','Water','Boat','🛶','journey'],['Wood','Wind','Flute','🪈','maker'],['Flute','Human','Music','🎵','wonder'],['Bird','Human','Music','🎵'],['Music','Night','Lullaby','🎶','wonder'],['Human','Flower','Love','💚','wonder'],['Love','Paper','Letter','💌','maker'],['Wood','Stone','Paper','📄','maker'],['Paper','Paper','Book','📖','maker'],['Book','Book','Library','📚','maker'],['Book','Night','Dream','💫','wonder'],['Moon','Human','Dream','💫'],['Dream','Star','Wish','🌠','wonder'],['Rainbow','Life','Unicorn','🦄','wonder'],['Rainbow','Horse','Unicorn','🦄'],['Life','Plant','Animal','🐾','life'],['Animal','Wind','Horse','🐎','life'],['Animal','House','Cat','🐈','life'],['Cat','Night','Magic','🪄','wonder'],['Magic','Book','Spellbook','📕','wonder'],['Magic','Stone','Crystal','💎','wonder'],['Crystal','Light','Prism','🔺','wonder'],['Energy','Glass','Light','💡','maker'],['Light','Water','Rainbow','🌈'],['Human','Stone','Tool','🔨','maker'],['Tool','Earth','Farm','🌾','maker'],['Farm','Water','Wheat','🌾','food'],['Wheat','Stone','Flour','🥡','food'],['Flour','Water','Dough','🥣','food'],['Dough','Fire','Bread','🍞','food'],['Bread','Honey','Toast','🍯','food'],['Plant','Steam','Tea','🍵','food'],['Tea','Ice','Iced Tea','🧋','food'],['Tree','Sun','Fruit','🍎','food'],['Fruit','Water','Juice','🧃','food'],['Juice','Ice','Popsicle','🍧','food'],['Fruit','Dough','Pie','🥧','food'],['Human','Ocean','Sailor','🧑‍✈️','journey'],['Boat','Wind','Sailboat','⛵'],['Sailboat','Star','Adventure','🧭','journey'],['Adventure','Island','Treasure','🏴‍☠️','journey'],['Treasure','Paper','Map','🗺️','journey'],['Map','Star','Constellation','✨','sky'],['Fire','Sand','Glass','🔮'],['Glass','Water','Bottle','🍶','maker'],['Bottle','Letter','Message in a Bottle','💌','journey'],['Ocean','Star','Starfish','⭐','life'],['Ocean','Flower','Coral','🪸','life'],['Coral','Fish','Reef','🐠','nature'],['Snow','Tree','Christmas','🎄','wonder'],['Snow','Mountain','Glacier','🏔️','nature'],['Glacier','Sun','River','🏞️','water'],['Mountain','Water','River','🏞️'],['River','Mountain','Waterfall','🌊','water'],['Cloud','Energy','Lightning','🌩️','sky'],['Rain','Wind','Storm','⛈️','sky'],['Storm','Ocean','Maelstrom','🌀','water'],['Dust','Star','Stardust','✨','wonder'],['Stardust','Life','Alien','👽','wonder'],['Alien','Boat','UFO','🛸','journey'],['Energy','Tool','Machine','⚙️','maker'],['Machine','Human','Robot','🤖','maker'],['Machine','Bird','Airplane','✈️','journey'],['Airplane','Star','Rocket','🚀','journey'],['Rocket','Human','Astronaut','🧑‍🚀','journey'],['Astronaut','Moon','Moonwalk','👣','journey'],['Music','Human','Dance','💃','wonder'],['Dance','Fire','Festival','🎉','wonder'],['Music','Ocean','Whale','🐋','life'],['Forest','Animal','Deer','🦌','life'],['Animal','Snow','Polar Bear','🐻‍❄️','life'],['Life','Stone','Fossil','🐚','nature'],['Fossil','Life','Dinosaur','🦕','life'],['Dinosaur','Fire','Dragon','🐉','wonder'],['Dragon','Book','Fairytale','📔','wonder'],['Fairytale','House','Castle','🏰','maker'],['Castle','Night','Ghost','👻','wonder'],['Ghost','Pumpkin','Halloween','🎃','wonder'],['Farm','Sun','Pumpkin','🎃','food'],['Love','House','Home','🏡','wonder'],['Home','Tea','Cozy','🧶','wonder']
];
recipeData.forEach(r=>recipe(...r));
// Deterministic, local procedural invention. No AI or network calls.
const modifiers={nature:['Mossy','Blooming','Wild','Ancient','Fern','Verdant','Rooted','Petal'],energy:['Ember','Solar','Glowing','Electric','Blazing','Golden','Spark','Radiant'],sky:['Cloud','Lunar','Starry','Floating','Cosmic','Aurora','Celestial','Breezy'],water:['Coral','Tidal','Ocean','Misty','Pearl','Crystal','Rain','Ripple'],life:['Living','Winged','Gentle','Feral','Tiny','Singing','Feathered','Dreaming'],maker:['Clockwork','Mechanical','Glass','Copper','Paper','Woven','Silver','Porcelain'],food:['Honey','Sugar','Velvet','Spiced','Sweet','Frosted','Cinnamon','Candied'],journey:['Wandering','Hidden','Lost','Drifting','Secret','Nomad','Traveling','Roaming'],wonder:['Enchanted','Dream','Moonlit','Phantom','Lucky','Rainbow','Whispering','Mythic']};
const nouns={nature:['Grove','Garden','Orchard','Terrarium','Willow','Meadow','Lotus','Bonsai'],energy:['Lantern','Beacon','Spark','Reactor','Firefly','Crown','Torch','Furnace'],sky:['Nebula','Comet','Observatory','Kite','Planet','Eclipse','Cloud','Constellation'],water:['Lagoon','Fountain','Reef','Seashell','Waterfall','Spring','Glacier','Geyser'],life:['Fox','Owl','Moth','Whale','Dragon','Sprite','Turtle','Mushroom'],maker:['Automaton','Music Box','Compass','Telescope','Workshop','Key','Hourglass','Windmill'],food:['Elixir','Cake','Tea','Sorbet','Truffle','Potion','Pudding','Nectar'],journey:['Airship','Lighthouse','Caravan','Portal','Sanctuary','Island','Harbor','Voyager'],wonder:['Mirage','Wisp','Amulet','Dreamcatcher','Oracle','Phoenix','Unicorn','Fairy']};
function hashWord(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function inventRecipe(a,b){
 if(!Object.hasOwn(ELEMENTS,a)||!Object.hasOwn(ELEMENTS,b))throw Error('Unknown ingredient');
 const key=pairKey(a,b),known=RECIPES.get(key);if(known)return {...ELEMENTS[known]};
 const [left,right]=[a,b].sort(),ea=ELEMENTS[left],eb=ELEMENTS[right],h=hashWord(key);
 const fa=modifiers[ea.family]?ea.family:'wonder',fb=modifiers[eb.family]?eb.family:'wonder';
 const family=h%2?fa:fb,other=h%2?fb:fa;
 // A pair's result depends only on its ingredient names, not discovery order.
 let name=modifiers[other][h%8]+' '+modifiers[family][(h>>>5)%8]+' '+nouns[family][(h>>>10)%8];
 if(name===a||name===b)name='Ever '+name;
 const emoji={nature:'🌿',energy:'🔥',sky:'🌌',water:'🪸',life:'🦋',maker:'⚙️',food:'🍯',journey:'🧭',wonder:'🔮'}[family];
 // Derive metadata from the result itself so name collisions remain consistent.
 const last=name.split(' ').slice(-1)[0];
 const canonicalFamily=Object.keys(nouns).find(f=>nouns[f].some(n=>n.split(' ').slice(-1)[0]===last))||family;
 if(!Object.hasOwn(ELEMENTS,name))ELEMENTS[name]={name,emoji:({nature:'🌿',energy:'🔥',sky:'🌌',water:'🪸',life:'🦋',maker:'⚙️',food:'🍯',journey:'🧭',wonder:'🔮'})[canonicalFamily],family:canonicalFamily,procedural:true};
 return {...ELEMENTS[name]};
}
// Keep these checks aligned with server/craft.cjs. Model names are untrusted.
const FAMILIES=['nature','energy','sky','water','life','maker','food','journey','wonder'];
const FAMILY_EMOJI={nature:'🌿',energy:'🔥',sky:'🌌',water:'🪸',life:'🦋',maker:'⚙️',food:'🍯',journey:'🧭',wonder:'🔮'};
const REJECT_NAMES=new Set(['nothing','null','undefined','error','n/a','na','none']);
function cleanName(name){return String(name).trim().replace(/^["'`]+|["'`]+$/g,'').replace(/\s+/g,' ');}
function validCraftName(name){if(typeof name!=='string')return false;const trimmed=cleanName(name);if(trimmed.length<1||trimmed.length>40)return false;if(['__proto__','constructor','prototype'].includes(trimmed))return false;if(REJECT_NAMES.has(trimmed.toLowerCase()))return false;return /^[\p{L}\p{N}][\p{L}\p{N}'’&.+-]*(?: [\p{L}\p{N}][\p{L}\p{N}'’&.+-]*){0,3}$/u.test(trimmed);}
function validCraftEmoji(emoji){if(typeof emoji!=='string')return false;const s=emoji.trim();if(!s||s.length>16)return false;if(/[<>&{}\[\]\\]/.test(s))return false;if(/\p{L}/u.test(s))return false;return true;}
function rememberElement(name,emoji,family,flags){const trimmed=cleanName(name);if(!validCraftName(trimmed))return null;if(Object.hasOwn(ELEMENTS,trimmed))return {...ELEMENTS[trimmed]};const fam=FAMILIES.includes(family)?family:'wonder';ELEMENTS[trimmed]={name:trimmed,emoji:validCraftEmoji(emoji)?emoji.trim():FAMILY_EMOJI[fam],family:fam,...flags};return {...ELEMENTS[trimmed]};}
function restoreInventions(journal){
 const valid=[];if(!Array.isArray(journal))return valid;
 for(const r of journal){
  if(!r||!Object.hasOwn(ELEMENTS,r.a)||!Object.hasOwn(ELEMENTS,r.b))continue;
  const date=typeof r.date==='string'?r.date.slice(0,10):'';
  if(r.source==='model'){
   const key=pairKey(r.a,r.b);
   if(RECIPES.has(key)&&RECIPES.get(key)!==r.result)continue;
   const el=rememberElement(r.result,r.emoji,r.family,{model:true});
   if(!el||el.name!==cleanName(r.result))continue;
   if(!RECIPES.has(key))RECIPES.set(key,el.name);
   valid.push({a:r.a,b:r.b,result:el.name,emoji:el.emoji,family:el.family,source:'model',date});
   continue;
  }
  const result=inventRecipe(r.a,r.b);if(result.name===r.result)valid.push({a:r.a,b:r.b,result:r.result,date});
 }
 return valid;
}
function acceptServerCraft(a,b,data){
 if(!data||data.source==='procedural')return null;
 if(data.source==='curated'){const local=inventRecipe(a,b);return {...local,source:'curated',isNew:false};}
 if(data.source!=='model')return null;
 const el=rememberElement(data.name,data.emoji,data.family,{model:true});
 if(!el)return null;
 const key=pairKey(a,b);
 if(RECIPES.has(key)&&RECIPES.get(key)!==el.name)return {...ELEMENTS[RECIPES.get(key)],source:ELEMENTS[RECIPES.get(key)].model?'model':'curated',isNew:false};
 if(!RECIPES.has(key))RECIPES.set(key,el.name);
 return {...ELEMENTS[el.name],source:'model',isNew:!!data.isNew,model:true};
}
async function resolveRecipe(a,b){
 const started=Date.now();
 try{
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),20000);
  const res=await fetch('/api/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({a,b}),signal:ctrl.signal});
  clearTimeout(timer);
  if(res.ok){const crafted=acceptServerCraft(a,b,await res.json());if(crafted)return crafted;}
 }catch{}
 const wait=Math.max(0,260-(Date.now()-started));
 if(wait)await new Promise(r=>setTimeout(r,wait));
 const local=inventRecipe(a,b);
 return {...local,source:local.procedural?'procedural':'curated',isNew:false};
}
