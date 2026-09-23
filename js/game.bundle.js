'use strict';
// Abyss Garden v2.14.2 - classic browser bundle for file:// and http(s)

// ---- data.js ----
const BIOMES = [
  {id:'astral',era:'ERA I',name:'Lago Astral',effect:'Crescimento equilibrado',unlock:0,colors:['#071f2b','#0d5260','#52d8c5'],bonus:'+10% de velocidade de crescimento'},
  {id:'jurassic',era:'ERA II',name:'Recife Primordial',effect:'Fósseis e criaturas antigas',unlock:3,colors:['#16271e','#35633c','#a4d160'],bonus:'+25% de lúmens para Adultos e Anciãos'},
  {id:'abyss',era:'ERA III',name:'Fenda Leviatã',effect:'Raros aparecem com frequência',unlock:6,colors:['#100d2b','#342365','#a75dc6'],bonus:'+12 pontos de chance para espécies raras'},
  {id:'mutant',era:'ERA IV',name:'Núcleo Mutante',effect:'Mutações únicas',unlock:10,colors:['#171627','#454429','#d2e74d'],bonus:'10% de mutação ao evoluir + bônus genético'}
];

const SPECIES = [
  // Astral
  {id:'lumifin',name:'Lumifin',type:'Mágico',rarity:'Comum',color:'#6cf0d2',accent:'#effff9',shape:'fish',sheet:'astral',frame:0},
  {id:'moonscale',name:'Escama-Lua',type:'Mágico',rarity:'Raro',color:'#9ca7ff',accent:'#ffe8a3',shape:'ray',sheet:'astral',frame:1},
  {id:'stardrop',name:'Gota Estelar',type:'Mágico',rarity:'Épico',color:'#ff84ce',accent:'#fff1a8',shape:'jelly',sheet:'astral',frame:2},
  {id:'nebulacuda',name:'Nebulacuda',type:'Mágico',rarity:'Raro',color:'#7654ff',accent:'#ffd86e',shape:'fish',sheet:'astral',frame:3},
  {id:'cometkoi',name:'Carpa Cometa',type:'Mágico',rarity:'Épico',color:'#ffd784',accent:'#9fd7ff',shape:'fish',sheet:'astral',frame:4},
  {id:'aurorafin',name:'Aurorafin',type:'Mágico',rarity:'Lendário',color:'#5cd6ff',accent:'#ffd773',shape:'serpent',sheet:'astral',frame:5},

  // Jurassic
  {id:'trilofin',name:'Trilofin',type:'Primordial',rarity:'Comum',color:'#a8d96f',accent:'#654c31',shape:'ancient',sheet:'jurassic',frame:0},
  {id:'dunkle',name:'Dunkleosteus Mini',type:'Primordial',rarity:'Raro',color:'#c28d57',accent:'#f1d9a7',shape:'ancient',sheet:'jurassic',frame:1},
  {id:'plesio',name:'Plesio Azul',type:'Primordial',rarity:'Épico',color:'#58a6b8',accent:'#d4f4e8',shape:'serpent',sheet:'jurassic',frame:2},
  {id:'ammonish',name:'Ammonish',type:'Primordial',rarity:'Comum',color:'#e0c089',accent:'#6dbef5',shape:'fish',sheet:'jurassic',frame:3},
  {id:'mossback',name:'Celacanto Musgoso',type:'Primordial',rarity:'Raro',color:'#6bc16d',accent:'#d9e7a4',shape:'ancient',sheet:'jurassic',frame:4},
  {id:'coraljaw',name:'Coraljaw',type:'Primordial',rarity:'Lendário',color:'#ff724d',accent:'#7fd4ff',shape:'ancient',sheet:'jurassic',frame:5},

  // Abyss
  {id:'gloomjaw',name:'Mandíbula Sombria',type:'Abissal',rarity:'Comum',color:'#6658a8',accent:'#8effe1',shape:'fish',sheet:'abyss',frame:0},
  {id:'voidray',name:'Arraia do Vazio',type:'Abissal',rarity:'Raro',color:'#422a70',accent:'#ec82ff',shape:'ray',sheet:'abyss',frame:1},
  {id:'leviathan',name:'Leviatã Jovem',type:'Abissal',rarity:'Lendário',color:'#7346a6',accent:'#ffba72',shape:'serpent',sheet:'abyss',frame:2},
  {id:'riftmaw',name:'Fendaguelra',type:'Abissal',rarity:'Raro',color:'#8b5dff',accent:'#48d6ff',shape:'serpent',sheet:'abyss',frame:3},
  {id:'umbranaut',name:'Umbra Náutilo',type:'Abissal',rarity:'Épico',color:'#8d71ff',accent:'#56bcff',shape:'jelly',sheet:'abyss',frame:4},
  {id:'blackstar',name:'Manta Estrela-Negra',type:'Abissal',rarity:'Lendário',color:'#2b2c6e',accent:'#ffae4d',shape:'ray',sheet:'abyss',frame:5},

  // Mutant
  {id:'toxicfin',name:'Nadadeira Tóxica',type:'Mutante',rarity:'Comum',color:'#b9d938',accent:'#262b12',shape:'fish',sheet:'mutant',frame:0},
  {id:'radion',name:'Radion',type:'Mutante',rarity:'Épico',color:'#e0ff4f',accent:'#ff65ad',shape:'jelly',sheet:'mutant',frame:1},
  {id:'chimera',name:'Quimera Coral',type:'Mutante',rarity:'Lendário',color:'#e64f9d',accent:'#a8ff46',shape:'ancient',sheet:'mutant',frame:2},
  {id:'slimehydra',name:'Hidra Limo',type:'Mutante',rarity:'Raro',color:'#9eff53',accent:'#6040ff',shape:'fish',sheet:'mutant',frame:3},
  {id:'sporefin',name:'Sporefin Neon',type:'Mutante',rarity:'Épico',color:'#f56dff',accent:'#95ff58',shape:'fish',sheet:'mutant',frame:4},
  {id:'reactorpuff',name:'Puffer Reator',type:'Mutante',rarity:'Lendário',color:'#afff28',accent:'#384022',shape:'fish',sheet:'mutant',frame:5}
];

const DECORS = [
  {id:'coral',name:'Coral lunar',icon:'♨',price:180,color:'#ff7eb3'},
  {id:'ruin',name:'Ruína antiga',icon:'⌂',price:320,color:'#c7b58a'},
  {id:'crystal',name:'Cristal vivo',icon:'♦',price:460,color:'#9c8cff'},
  {id:'kelp',name:'Bosque kelp',icon:'♧',price:140,color:'#76d271'}
];

const rarityValue = {Comum:1,Raro:2,Épico:3,Lendário:4};
const rarityColors = {Comum:'#86a6ae',Raro:'#5bbfe4',Épico:'#b986ff',Lendário:'#ffd36b'};


// ---- systems/UpgradeSystem.js ----
const UPGRADES=[
  {id:'incubator',name:'Incubadora Temporal',desc:'Reduz em 12% o tempo de incubação por nível.',resource:'pearls',icon:'◈',max:4,baseCost:3},
  {id:'filtration',name:'Filtragem Profunda',desc:'Reduz em 15% a deterioração da água por nível.',resource:'fossils',icon:'◫',max:5,baseCost:3},
  {id:'production',name:'Reator de Lúmens',desc:'Aumenta em 8% toda produção de lúmens por nível.',resource:'essence',icon:'◆',max:5,baseCost:2},
  {id:'capacity',name:'Expansão de Habitat',desc:'Adiciona +2 espaços para criaturas por nível em todos os habitats.',resource:'pearls',icon:'◈',max:4,baseCost:4},
  {id:'genetics',name:'Sequenciador Genético',desc:'Adiciona +3% de chance de mutação em cruzamentos e no Núcleo Mutante.',resource:'dna',icon:'⬡',max:4,baseCost:5}
];

function ensureUpgrades(state){
  state.upgrades??={};
  for(const u of UPGRADES)state.upgrades[u.id]=Math.max(0,Math.min(u.max,Number(state.upgrades[u.id])||0));
  return state.upgrades;
}
function upgradeLevel(state,id){ensureUpgrades(state);return state.upgrades[id]||0}
function upgradeCost(state,id){const u=UPGRADES.find(x=>x.id===id);if(!u)return Infinity;const level=upgradeLevel(state,id);return Math.ceil(u.baseCost*(1+level*.75));}
function capacityBonus(state){return upgradeLevel(state,'capacity')*2}
function incubationMultiplier(state){return Math.max(.52,1-upgradeLevel(state,'incubator')*.12)}
function waterDecayMultiplier(state){return Math.max(.25,1-upgradeLevel(state,'filtration')*.15)}
function productionUpgradeMultiplier(state){return 1+upgradeLevel(state,'production')*.08}
function geneticsBonus(state){return upgradeLevel(state,'genetics')*.03}
function buyUpgrade(state,id){
  const u=UPGRADES.find(x=>x.id===id);if(!u)return {ok:false,reason:'Aprimoramento inválido'};
  const level=upgradeLevel(state,id);if(level>=u.max)return {ok:false,reason:'Nível máximo alcançado'};
  const cost=upgradeCost(state,id);if((state[u.resource]||0)<cost)return {ok:false,reason:'Recursos insuficientes'};
  state[u.resource]-=cost;state.upgrades[id]=level+1;return {ok:true,upgrade:u,level:level+1,cost};
}


// ---- systems/GeneticsSystem.js ----
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const round=(n,p=2)=>Number(n.toFixed(p));

const COLOR_PATTERNS=[
  {id:'natural',name:'Natural'},
  {id:'aurora',name:'Aurora'},
  {id:'stripes',name:'Listrado'},
  {id:'pearlescent',name:'Perolado'},
  {id:'shadow',name:'Sombrio'},
  {id:'prismatic',name:'Prismático'}
];

const MUTATIONS={
  luminous:{name:'Luminescente',desc:'+produção e brilho',hue:18},
  giant:{name:'Gigante',desc:'+tamanho máximo',hue:0},
  swift:{name:'Veloz',desc:'+velocidade e crescimento',hue:195},
  resilient:{name:'Resiliente',desc:'+vitalidade',hue:95},
  prismatic:{name:'Prismática',desc:'cor rara e produtividade',hue:115},
  shadow:{name:'Sombria',desc:'pigmentação escura rara',hue:245}
};

const qualityWeights={
  Comum:[42,31,18,7,2],
  Raro:[28,32,24,12,4],
  Épico:[14,26,32,20,8],
  Lendário:[7,16,30,29,18]
};

function weightedIndex(weights,random=Math.random){
  let roll=random()*weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<=0)return i}
  return weights.length-1;
}
function statForQuality(q,random=Math.random){
  const center=.88+(q-1)*.07;
  return round(clamp(center+(random()-.5)*.18,.78,1.34),3);
}
function randomPattern(random=Math.random){
  const i=weightedIndex([48,16,14,10,8,4],random);
  return COLOR_PATTERNS[i].id;
}
function lineageToken(random=Math.random){return Math.floor(random()*46655).toString(36).toUpperCase().padStart(3,'0')}
function makeLineage(species,random=Math.random){return {id:`${species.id}-${Date.now().toString(36)}-${lineageToken(random)}`,name:`Linhagem ${species.name} ${lineageToken(random)}`,generation:1,parents:[]}}

function rollQuality(rarity='Comum',random=Math.random){return weightedIndex(qualityWeights[rarity]||qualityWeights.Comum,random)+1}
function qualityStars(q=1){const n=clamp(Math.round(q),1,5);return '★'.repeat(n)+'☆'.repeat(5-n)}
function patternName(id='natural'){return COLOR_PATTERNS.find(p=>p.id===id)?.name||'Natural'}
function mutationName(id){return id?(MUTATIONS[id]?.name||'Mutação'):'Nenhuma'}

function createGeneticProfile(species,restored={},random=Math.random){
  const quality=clamp(Number(restored.quality)||rollQuality(species.rarity,random),1,5);
  const source=restored.genome||{};
  const pattern=source.pattern||randomPattern(random);
  const patternHue={natural:0,aurora:35,stripes:-12,pearlescent:12,shadow:175,prismatic:105}[pattern]??0;
  const genome={
    size:round(clamp(Number(source.size)||statForQuality(quality,random),.72,1.5),3),
    productivity:round(clamp(Number(source.productivity)||statForQuality(quality,random),.72,1.55),3),
    speed:round(clamp(Number(source.speed)||statForQuality(quality,random),.72,1.5),3),
    growth:round(clamp(Number(source.growth)||statForQuality(quality,random),.72,1.45),3),
    vitality:round(clamp(Number(source.vitality)||statForQuality(quality,random),.72,1.5),3),
    hue:round(clamp(Number.isFinite(Number(source.hue))?Number(source.hue):patternHue+(random()-.5)*24,-180,240),1),
    saturation:round(clamp(Number(source.saturation)||(.9+quality*.055+(pattern==='prismatic'?.25:0)),.75,1.65),2),
    pattern
  };
  const lineage=restored.lineage&&restored.lineage.id?{
    id:String(restored.lineage.id),name:String(restored.lineage.name||`Linhagem ${species.name}`),generation:Math.max(1,Number(restored.lineage.generation)||1),parents:Array.isArray(restored.lineage.parents)?restored.lineage.parents.slice(0,2):[]
  }:makeLineage(species,random);
  let mutationType=restored.mutationType||null;
  if(restored.mutated&&!mutationType)mutationType='luminous';
  return {quality,genome,lineage,mutationType};
}

function geneticScore(creature){
  const g=creature.genome||{};
  return Math.round(((g.size||1)+(g.productivity||1)+(g.speed||1)+(g.growth||1)+(g.vitality||1))/5*100);
}
function genePercent(value=1){return `${Math.round(value*100)}%`}

function applyMutation(creature,type=null,random=Math.random){
  const ids=Object.keys(MUTATIONS),chosen=type&&MUTATIONS[type]?type:ids[Math.floor(random()*ids.length)];
  creature.mutated=true;creature.mutationType=chosen;
  const g=creature.genome;
  if(chosen==='luminous'){g.productivity=round(clamp(g.productivity+.14,.72,1.55),3);g.saturation=round(clamp(g.saturation+.12,.75,1.65),2)}
  if(chosen==='giant'){g.size=round(clamp(g.size+.2,.72,1.5),3);g.speed=round(clamp(g.speed-.04,.72,1.5),3)}
  if(chosen==='swift'){g.speed=round(clamp(g.speed+.18,.72,1.5),3);g.growth=round(clamp(g.growth+.08,.72,1.45),3)}
  if(chosen==='resilient'){g.vitality=round(clamp(g.vitality+.2,.72,1.5),3)}
  if(chosen==='prismatic'){g.productivity=round(clamp(g.productivity+.08,.72,1.55),3);g.pattern='prismatic';g.hue=round(clamp(g.hue+95,-180,240),1);g.saturation=round(clamp(g.saturation+.2,.75,1.65),2)}
  if(chosen==='shadow'){g.pattern='shadow';g.hue=round(clamp(g.hue+170,-180,240),1);g.vitality=round(clamp(g.vitality+.08,.72,1.5),3)}
  if(random()<.32)creature.quality=clamp(creature.quality+1,1,5);
  return chosen;
}

function inheritStat(a,b,key,quality,random=Math.random){
  const av=a.genome?.[key]??1,bv=b.genome?.[key]??1;
  const base=random()<.32?(random()<.5?av:bv):(av+bv)/2;
  const qBias=(quality-3)*.008;
  return round(clamp(base+(random()-.5)*.09+qBias,.72,key==='productivity'?1.55:key==='size'||key==='speed'||key==='vitality'?1.5:1.45),3);
}

function breedGeneticProfile(a,b,mutationChance=.1,random=Math.random){
  const avg=(a.quality+b.quality)/2;
  let quality=clamp(Math.round(avg+(random()<.18?1:0)-(random()<.06?1:0)),1,5);
  if(a.quality>=4&&b.quality>=4&&random()<.22)quality=clamp(quality+1,1,5);
  const parentPattern=random()<.5?a.genome.pattern:b.genome.pattern;
  const genome={
    size:inheritStat(a,b,'size',quality,random),
    productivity:inheritStat(a,b,'productivity',quality,random),
    speed:inheritStat(a,b,'speed',quality,random),
    growth:inheritStat(a,b,'growth',quality,random),
    vitality:inheritStat(a,b,'vitality',quality,random),
    hue:round(clamp((a.genome.hue+b.genome.hue)/2+(random()-.5)*28,-180,240),1),
    saturation:round(clamp((a.genome.saturation+b.genome.saturation)/2+(random()-.5)*.12,.75,1.65),2),
    pattern:random()<.14?randomPattern(random):parentPattern
  };
  const sameLine=a.lineage?.id&&a.lineage.id===b.lineage?.id;
  const generation=Math.max(a.lineage?.generation||1,b.lineage?.generation||1)+1;
  const speciesName=a.species.id===b.species.id?a.species.name:`${a.species.name.split(' ')[0]}×${b.species.name.split(' ')[0]}`;
  const lineage=sameLine?{id:a.lineage.id,name:a.lineage.name,generation,parents:[]}:{id:`hyb-${Date.now().toString(36)}-${lineageToken(random)}`,name:`Linhagem ${speciesName} ${lineageToken(random)}`,generation,parents:[]};
  lineage.parents=[
    {uid:a.uid,name:a.species.name,quality:a.quality,generation:a.lineage?.generation||1},
    {uid:b.uid,name:b.species.name,quality:b.quality,generation:b.lineage?.generation||1}
  ];
  const profile={quality,genome,lineage,mutationType:null,mutated:false};
  if(random()<mutationChance){
    const holder={quality,genome,mutated:false,mutationType:null};applyMutation(holder,null,random);
    profile.quality=holder.quality;profile.mutationType=holder.mutationType;profile.mutated=true;
  }
  return profile;
}

function profileSummary(c){
  return {stars:qualityStars(c.quality),score:geneticScore(c),pattern:patternName(c.genome?.pattern),mutation:mutationName(c.mutationType),generation:c.lineage?.generation||1,lineage:c.lineage?.name||'Linhagem desconhecida'};
}


// ---- core/SpriteLoader.js ----
const SOURCES={
  astral:'assets/atlas-astral.webp',
  jurassic:'assets/atlas-jurassic.webp',
  abyss:'assets/atlas-abyss.webp',
  mutant:'assets/atlas-mutant.webp'
};
let activeHabitat=null;
const cache=new Map();
const loading=new Map();

function loadImage(src,onProgress,start=0,end=100){
  return new Promise((resolve,reject)=>{
    const img=new Image();img.decoding='async';
    onProgress?.(start);
    img.onload=async()=>{try{if(img.decode)await img.decode()}catch{}onProgress?.(end);resolve(img)};
    img.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));
    img.src=src;
  });
}

async function loadAquariumSprites(habitat,onProgress=()=>{}){
  if(!SOURCES[habitat])throw new Error('Habitat sem sprites.');
  if(cache.has(habitat)){activeHabitat=habitat;onProgress(100);return cache.get(habitat)}
  if(loading.has(habitat))return loading.get(habitat);
  releaseAquariumSprites();
  activeHabitat=habitat;
  const promise=loadImage(SOURCES[habitat],onProgress,8,92).then(img=>{cache.set(habitat,img);loading.delete(habitat);onProgress(100);return img}).catch(err=>{loading.delete(habitat);throw err});
  loading.set(habitat,promise);return promise;
}
function getAquariumAtlas(habitat){return cache.get(habitat)||null;}
function releaseAquariumSprites(){for(const key of [...cache.keys()])cache.delete(key);activeHabitat=null;}
function loadedHabitat(){return activeHabitat;}


// ---- core/SaveManager.js ----
const KEY='abyss-garden-save-v5';
const LEGACY_KEYS=['abyss-garden-save-v4','abyss-garden-save-v3','abyss-garden-save-v2','abyss-garden-save-v1'];
const SAVE_VERSION=10;

function validSave(parsed){return parsed&&Array.isArray(parsed.creatures)&&(Number.isFinite(parsed.coins)||Array.isArray(parsed.aquariums)||Number.isFinite(parsed.shopCredits))}

class SaveManager{
  static load(defaults){
    try{
      for(const key of [KEY,KEY+'-backup',...LEGACY_KEYS]){
        try{
          const raw=localStorage.getItem(key);if(!raw)continue;
          const parsed=JSON.parse(raw);if(!validSave(parsed))continue;
          return {...structuredClone(defaults),...parsed,version:SAVE_VERSION};
        }catch{}
      }
      return structuredClone(defaults);
    }catch{return structuredClone(defaults)}
  }
  static save(state,creatures){
    state.creatures=creatures.map(c=>c.serialize());state.lastSave=Date.now();state.version=SAVE_VERSION;
    try{
      const previous=localStorage.getItem(KEY);if(previous){try{JSON.parse(previous);localStorage.setItem(KEY+'-backup',previous)}catch{}}
      localStorage.setItem(KEY,JSON.stringify(state));return true;
    }catch{return false}
  }
  static importData(text,defaults){
    try{
      const parsed=JSON.parse(text);if(!validSave(parsed))return {ok:false,error:'Backup inválido ou incompatível.'};
      const merged={...structuredClone(defaults),...parsed,version:SAVE_VERSION,lastSave:Date.now()};
      localStorage.setItem(KEY,JSON.stringify(merged));
      return {ok:true};
    }catch{return {ok:false,error:'Não foi possível ler o arquivo de backup.'}}
  }
  static offline(lastSave,maxHours=12){return Math.min(maxHours*3600,Math.max(0,(Date.now()-(lastSave||Date.now()))/1000))}
  static reset(){localStorage.removeItem(KEY+'-backup');localStorage.removeItem(KEY);for(const key of LEGACY_KEYS)localStorage.removeItem(key)}
}


// ---- systems/GameSystems.js ----
const RESOURCES={dna:{icon:'⬡',name:'DNA'},fossils:{icon:'◫',name:'Fósseis'},essence:{icon:'◆',name:'Essência'},pearls:{icon:'◈',name:'Pérolas'}};
const SHOP=[
  {id:'basic-food',name:'Ração de plâncton',desc:'Grãos que restauram 25 de saciedade',price:35,icon:'●',kind:'food'},
  {id:'vitamin',name:'Néctar de crescimento',desc:'+5 minutos de crescimento',price:90,icon:'✦',kind:'boost'},
  {id:'cleaner',name:'Filtro biológico',desc:'Restaura a qualidade da água',price:120,icon:'≈',kind:'water'},
  {id:'mystery',name:'Ovo do habitat',desc:'Inicia uma incubação exclusiva deste habitat',price:240,icon:'◉',kind:'egg'}
];
const EXPEDITIONS=[
  {id:'cave',name:'Cavernas de Coral',time:60,reward:'fossils',amount:3,level:1,icon:'⌁'},
  {id:'ruins',name:'Ruínas Submersas',time:180,reward:'dna',amount:4,level:3,icon:'⌂'},
  {id:'rift',name:'Fenda Desconhecida',time:420,reward:'essence',amount:2,level:6,icon:'◈'}
];
function waterDecay(state,dt,multiplier=1){state.water=Math.max(0,(state.water??100)-dt/240000*Math.max(0,multiplier));}
function averageMood(creatures){if(!creatures.length)return 100;return creatures.reduce((n,c)=>n+c.happiness,0)/creatures.length}
function expeditionStatus(exp){if(!exp)return null;return Math.max(0,Math.ceil((exp.ends-Date.now())/1000))}
function breedChance(a,b,bonus=0){const base=a.species.rarity===b.species.rarity ? .12 : .07;return Math.min(.65,base+(a.happiness+b.happiness)/2000+bonus)}


// ---- systems/FeedingSystem.js ----
// Food is isolated per physical aquarium. Legacy habitat matching is kept as fallback.
function feedCreatures(creatures,food,dt,onEat=()=>{}){
  const reserved=new Set();
  for(const c of [...creatures].sort((a,b)=>a.hunger-b.hunger)){
    if(c.animation==='eat'&&c.animationTime>0)continue;
    const candidates=food.filter(f=>{
      if(f.eaten||reserved.has(f)||c.hunger>=98)return false;
      if(c.aquariumId&&f.aquariumId)return c.aquariumId===f.aquariumId;
      return f.habitat===c.habitat;
    });
    const target=candidates.reduce((best,f)=>!best||Math.hypot(f.x-c.x,f.y-c.y)<Math.hypot(best.x-c.x,best.y-c.y)?f:best,null);
    if(!target){if(c.animation==='seek'){c.animation='swim';c.animationTime=0;c.vx=(Math.sign(c.vx)||1)*.45;c.vy=0}continue}
    reserved.add(target);const dx=target.x-c.x,dy=target.y-c.y,distance=Math.hypot(dx,dy);
    if(distance<18*c.scale+5){target.eaten=true;c.hunger=Math.min(100,c.hunger+(target.nutrition??12));c.happiness=Math.min(100,c.happiness+3);c.animation='eat';c.animationTime=800;c.vx=(Math.sign(c.vx)||1)*.12;c.vy=0;onEat(c,target);continue}
    const speed=Math.min(1.65,distance/Math.max(1,dt*.06));c.vx=dx/distance*speed;c.vy=dy/distance*speed;c.animation='seek';c.animationTime=100;
  }
}


// ---- systems/GrowthTimer.js ----
function growthEstimate(c,water=100){
  const genetics=c.genome?.growth??1;
  const rate=(c.habitat==='astral'?1.1:1)*(water>35?1:.5)*(c.hunger>35&&c.health>50?1:.35)*genetics;
  const adult=c.age>=3600;
  return {adult,seconds:Math.max(0,3600-c.age)/rate,percent:Math.min(100,Math.max(0,c.age/3600*100)),rate};
}
function formatDuration(seconds){
  const n=Math.max(0,Math.ceil(seconds));return [Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(v=>String(v).padStart(2,'0')).join(':');
}


// ---- systems/ProductionSystem.js ----
function productionInfo(c,multiplier=1){
  const interval=c.stage==='Filhote'?90000:c.stage==='Jovem'?60000:45000;
  const base={Filhote:2,Jovem:4,Adulto:12,Ancião:22}[c.stage];
  const raw=base*(c.species.rarity==='Lendário'?3:c.species.rarity==='Épico'?2:1);
  const genetic=c.genome?.productivity??1;
  const amount=Math.max(1,Math.round(raw*Math.max(.1,multiplier)*genetic));
  return {interval,amount};
}
function settleProduction(c,elapsed,multiplier=1){
  const {interval,amount}=productionInfo(c,multiplier);
  const pending=c.ready?1:0;c.ready=false;
  c.production=Math.max(0,Number(c.production)||0)+Math.max(0,elapsed);
  const cycles=Math.floor(c.production/interval);c.production%=interval;
  return {cycles:cycles+pending,coins:(cycles+pending)*amount,amount};
}


// ---- systems/SaleSystem.js ----
function salePrice(c){
  const species=1+Math.max(0,SPECIES.findIndex(s=>s.id===c.species.id))*.04;
  const rarity={Comum:1,Raro:2,Épico:4,Lendário:8}[c.species.rarity]??1;
  const growth={Filhote:1,Jovem:1.8,Adulto:3.5,Ancião:6}[c.stage]??1;
  const quality=1+(Math.max(1,c.quality||1)-1)*.22;
  const genes=.85+(((c.genome?.productivity??1)+(c.genome?.size??1))/2)*.15;
  return Math.floor(25*species*rarity*growth*(c.mutated?1.6:1)*quality*genes);
}
function sellCreature(state,creatures,uid){
  const index=creatures.findIndex(c=>c.uid===uid);if(index<0)return 0;
  const price=salePrice(creatures[index]);creatures.splice(index,1);state.coins+=price;return price;
}


// ---- systems/HabitatEffects.js ----
function growthMultiplier(state,creature,water=100){
  let value=creature.habitat==='astral'?1.10:1;
  if(water<=35)value*=.5;
  return value;
}

function productionMultiplier(state,creature){
  let value=productionUpgradeMultiplier(state);
  if(creature.habitat==='jurassic'&&['Adulto','Ancião'].includes(creature.stage))value*=1.25;
  const care=(creature.hunger+creature.happiness+creature.health)/300;
  value*=.55+Math.max(0,Math.min(1,care))*.55;
  return value;
}

function mutationChance(state,creature){
  if(creature.habitat!=='mutant')return 0;
  return .10+geneticsBonus(state);
}

function decayMultiplier(state){return waterDecayMultiplier(state)}

function jurassicFossilChance(creature,cycles=1){
  if(creature.habitat!=='jurassic'||!['Adulto','Ancião'].includes(creature.stage)||cycles<=0)return 0;
  return 1-Math.pow(.975,cycles);
}


// ---- systems/StoreSystem.js ----
const MAX_AQUARIUMS=8;
const BASE_COSTS=[0,700,1050,1500,2100,2850,3750,4800];

const finite=(n,fallback=0)=>Number.isFinite(Number(n))?Number(n):fallback;
const uniqueId=()=>`aq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

function habitatName(id){return BIOMES.find(b=>b.id===id)?.name||'Habitat';}

function initializeStore(state){
  const legacyCoins=finite(state.coins,350);
  const legacyWater=finite(state.water,100);
  const legacyDecor=Array.isArray(state.decor)?[...state.decor]:[];
  state.shopCredits=finite(state.shopCredits,1400);
  state.aquariums=Array.isArray(state.aquariums)?state.aquariums:[];

  if(!state.aquariums.length){
    const creatureHabitats=[...new Set((state.creatures||[]).map(c=>c.habitat).filter(Boolean))];
    const habitats=[...new Set(['astral',...(Array.isArray(state.unlocked)?state.unlocked:[]),...creatureHabitats])].slice(0,4);
    state.aquariums=habitats.map((habitat,slot)=>{
      const oldTank=state.tanks?.[habitat];
      return {
        id:`aq-legacy-${habitat}`,
        slot,
        habitat,
        name:`${habitatName(habitat)} ${slot+1}`,
        lumens:habitat===(state.biome||'astral')?legacyCoins:120,
        water:finite(oldTank?.water,habitat===(state.biome||'astral')?legacyWater:100),
        decor:Array.isArray(oldTank?.decor)?[...oldTank.decor]:(habitat===(state.biome||'astral')?legacyDecor:[]),
        pendingRevenue:0,
        purchasedAt:Date.now()
      };
    });
  }

  const occupied=new Set();
  state.aquariums=state.aquariums.slice(0,MAX_AQUARIUMS).map((aq,index)=>{
    let slot=Math.max(0,Math.min(MAX_AQUARIUMS-1,Math.floor(finite(aq.slot,index))));
    while(occupied.has(slot)&&slot<MAX_AQUARIUMS-1)slot++;
    if(occupied.has(slot))slot=[...Array(MAX_AQUARIUMS).keys()].find(s=>!occupied.has(s))??index;
    occupied.add(slot);
    const habitat=BIOMES.some(b=>b.id===aq.habitat)?aq.habitat:'astral';
    return {
      id:String(aq.id||uniqueId()),slot,habitat,
      name:String(aq.name||`${habitatName(habitat)} ${index+1}`),
      lumens:Math.max(0,finite(aq.lumens,index===0?legacyCoins:120)),
      water:Math.max(0,Math.min(100,finite(aq.water,100))),
      decor:Array.isArray(aq.decor)?aq.decor:[],
      pendingRevenue:Math.max(0,finite(aq.pendingRevenue,0)),
      purchasedAt:finite(aq.purchasedAt,Date.now())
    };
  });

  if(!state.aquariums.length){
    state.aquariums=[{id:'aq-starter',slot:0,habitat:'astral',name:'Lago Astral 1',lumens:350,water:100,decor:[],pendingRevenue:0,purchasedAt:Date.now()}];
  }
  if(!state.aquariums.some(a=>a.id===state.activeAquariumId))state.activeAquariumId=(state.aquariums.find(a=>a.habitat===state.biome)||state.aquariums[0]).id;
  state.biome=activeAquarium(state).habitat;

  for(const key of ['coins','water','decor']){
    try{delete state[key]}catch{}
  }
  Object.defineProperty(state,'coins',{enumerable:true,configurable:true,get(){return activeAquarium(this).lumens},set(value){activeAquarium(this).lumens=Math.max(0,finite(value,0))}});
  Object.defineProperty(state,'water',{enumerable:true,configurable:true,get(){return activeAquarium(this).water},set(value){activeAquarium(this).water=Math.max(0,Math.min(100,finite(value,100)))}});
  Object.defineProperty(state,'decor',{enumerable:true,configurable:true,get(){return activeAquarium(this).decor},set(value){activeAquarium(this).decor=Array.isArray(value)?value:[]}});
  return state;
}

function activeAquarium(state){return state.aquariums?.find(a=>a.id===state.activeAquariumId)||state.aquariums?.[0];}
function aquariumById(state,id){return state.aquariums?.find(a=>a.id===id)||null;}
function aquariumForLegacyHabitat(state,habitat){return state.aquariums?.find(a=>a.habitat===habitat)||state.aquariums?.[0]||null;}
function residents(creatures,aquariumId){return creatures.filter(c=>c.aquariumId===aquariumId);}
function aquariumCapacity(state){return 8+state.level+capacityBonus(state);}
function emptySlots(state){const used=new Set(state.aquariums.map(a=>a.slot));return [...Array(MAX_AQUARIUMS).keys()].filter(i=>!used.has(i));}
function nextAquariumCost(state){const count=state.aquariums.length;return BASE_COSTS[Math.min(BASE_COSTS.length-1,count)]||BASE_COSTS.at(-1);}

function buyAquarium(state,slot,habitat){
  slot=Math.floor(Number(slot));
  if(slot<0||slot>=MAX_AQUARIUMS||state.aquariums.some(a=>a.slot===slot))return {ok:false,reason:'Este espaço já está ocupado.'};
  if(!state.unlocked.includes(habitat))return {ok:false,reason:'Este habitat ainda não foi desbloqueado.'};
  const cost=nextAquariumCost(state);
  if(state.shopCredits<cost)return {ok:false,reason:'Créditos da loja insuficientes.'};
  state.shopCredits-=cost;
  const n=state.aquariums.filter(a=>a.habitat===habitat).length+1;
  const aq={id:uniqueId(),slot,habitat,name:`${habitatName(habitat)} ${n}`,lumens:160,water:100,decor:[],pendingRevenue:0,purchasedAt:Date.now()};
  state.aquariums.push(aq);
  return {ok:true,aquarium:aq,cost};
}

function transferCreature(state,creatures,uid,destinationId){
  const creature=creatures.find(c=>c.uid===uid),dest=aquariumById(state,destinationId);
  if(!creature||!dest||destinationId===creature.aquariumId)return false;
  if(residents(creatures,destinationId).length>=aquariumCapacity(state))return false;
  creature.aquariumId=destinationId;creature.habitat=dest.habitat;return true;
}

function visitorValue(c){
  const stage={Filhote:.25,Jovem:.55,Adulto:1,Ancião:1.45}[c.stage]||.25;
  const rarity=rarityValue[c.species.rarity]||1;
  const quality=.7+(c.quality||1)*.1;
  const mutation=c.mutated?1.25:1;
  return stage*rarity*quality*mutation;
}
function visitorRevenueRate(aquarium,creatures){
  const list=residents(creatures,aquarium.id);
  if(!list.length)return 0;
  const appeal=list.reduce((sum,c)=>sum+visitorValue(c),0);
  return appeal/210; // créditos por segundo
}
function accrueVisitorRevenue(state,creatures,seconds){
  const elapsed=Math.max(0,Number(seconds)||0);
  if(!elapsed)return 0;
  let total=0;
  for(const aq of state.aquariums){const gain=visitorRevenueRate(aq,creatures)*elapsed;aq.pendingRevenue+=gain;total+=gain}
  return total;
}
function pendingRevenueTotal(state){return state.aquariums.reduce((n,a)=>n+(a.pendingRevenue||0),0);}
function collectVisitorRevenue(state,aquariumId=null){
  const targets=aquariumId?[aquariumById(state,aquariumId)].filter(Boolean):state.aquariums;
  const amount=targets.reduce((n,a)=>n+Math.floor(a.pendingRevenue||0),0);
  if(amount<=0)return 0;
  for(const aq of targets){const whole=Math.floor(aq.pendingRevenue||0);aq.pendingRevenue=Math.max(0,(aq.pendingRevenue||0)-whole)}
  state.shopCredits+=amount;return amount;
}


// ---- systems/EggSystem.js ----
const EGGS={
 astral:{name:'Ovo Astral',type:'Mágico',price:140,position:'0% 0%',weights:[42,24,12,12,7,3],seconds:35},
 jurassic:{name:'Ovo Fóssil',type:'Primordial',price:220,position:'100% 0%',weights:[40,24,12,12,8,4],seconds:50},
 abyss:{name:'Ovo Abissal',type:'Abissal',price:360,position:'0% 100%',weights:[34,23,8,18,11,6],seconds:70},
 mutant:{name:'Ovo Mutante',type:'Mutante',price:480,position:'100% 100%',weights:[40,12,6,21,14,7],seconds:90}
};
function eggSpecies(habitat){const egg=EGGS[habitat];if(!egg)throw Error('Habitat inválido');return SPECIES.filter(s=>s.type===egg.type)}
function rollEgg(habitat,random=Math.random){const egg=EGGS[habitat],pool=eggSpecies(habitat);let roll=random()*100;for(let i=0;i<pool.length;i++){roll-=egg.weights[i]??0;if(roll<0)return pool[i]}return pool.at(-1)}
function eggPreview(habitat){const egg=EGGS[habitat];return eggSpecies(habitat).map((s,i)=>`${s.name} (${egg.weights[i]??0}%)`).join(' · ')}
function eggArt(habitat){return `<span class="habitat-egg" aria-hidden="true" style="background-position:${EGGS[habitat].position}"></span>`}
function ensureIncubators(state){state.incubators??={};return state.incubators}
function incubationSeconds(state,habitat){return Math.max(12,Math.round(EGGS[habitat].seconds*incubationMultiplier(state)))}
function incubationStatus(state,aquariumId){ensureIncubators(state);const item=state.incubators[aquariumId];if(!item)return {active:false,ready:false,remaining:0};const remaining=Math.max(0,Math.ceil((item.ends-Date.now())/1000));return {active:true,ready:remaining===0,remaining,item}}
function startIncubation(state,aquariumId,habitat,speciesId){ensureIncubators(state);if(state.incubators[aquariumId])return null;const seconds=incubationSeconds(state,habitat);const item={aquariumId,habitat,speciesId,started:Date.now(),ends:Date.now()+seconds*1000};state.incubators[aquariumId]=item;return item}
function finishIncubation(state,aquariumId){ensureIncubators(state);const status=incubationStatus(state,aquariumId);if(!status.ready)return null;delete state.incubators[aquariumId];return status.item}


// ---- ui/Screens.js ----
function shopScreen(state){return `<small>MERCADO FLUTUANTE</small><h2>Suprimentos</h2><p>Cuide do habitat, acelere a evolução e inicie novas incubações.</p><div class="screen-grid">${SHOP.map(item=>{const i=item.kind==='egg'?{...item,...EGGS[state.biome],desc:`${eggPreview(state.biome)} · incubação ~${incubationSeconds(state,state.biome)}s`}:item;return `<button class="market-card" data-buy="${i.id}">${i.kind==='egg'?eggArt(state.biome):`<span>${i.icon}</span>`}<div><b>${i.name}</b><small>${i.desc}</small></div><em>✦ ${i.price}</em></button>`}).join('')}</div>`}

function labScreen(state,creatures){
  const adults=creatures.filter(c=>['Adulto','Ancião'].includes(c.stage));
  return `<small>LABORATÓRIO GENÉTICO</small><h2>Linhagens e reprodução avançada</h2><p>Escolha dois adultos. O filhote cruza genes de tamanho, produtividade, velocidade, crescimento e vitalidade; pode herdar padrão de cor, melhorar qualidade e iniciar uma nova linhagem.</p><div class="resource-strip"><b>⬡ ${state.dna} DNA</b><b>Adultos: ${adults.length}</b></div><div class="lab-select genetics-lab">${adults.length?adults.map(c=>{const p=profileSummary(c);return `<label><input type="checkbox" name="parent" value="${c.uid}"><span style="--fish:${c.species.color}">◖</span><b>${c.species.name}</b><small class="quality-stars">${qualityStars(c.quality)}</small><small>G${p.generation} · ${patternName(c.genome?.pattern)} · Score ${p.score}</small></label>`}).join(''):'<div class="empty">Você ainda não possui duas criaturas adultas.</div>'}</div><div class="genetics-note">Filhotes de pais ★★★★–★★★★★ têm chance maior de nascer com qualidade superior. Mutações de cruzamento podem alterar genes e aparência.</div><button class="primary wide" id="breedBtn" ${adults.length<2||state.dna<4?'disabled':''}>Combinar genética · ⬡ 4</button>`}

function expeditionScreen(state){const active=state.expedition,remaining=expeditionStatus(active);return `<small>EXPEDIÇÕES</small><h2>Explore além do aquário</h2><p>Envie uma equipe para buscar materiais usados nas melhorias permanentes. A missão continua com o jogo fechado.</p>${active?`<article class="active-expedition"><span>⌁</span><div><b>Expedição em andamento</b><small>${remaining?`Retorno em ${remaining}s`:'Equipe pronta para retornar'}</small></div><button id="claimExp" ${remaining?'disabled':''}>Coletar</button></article>`:''}<div class="screen-grid">${EXPEDITIONS.map(e=>`<button class="market-card" data-expedition="${e.id}" ${active||state.level<e.level?'disabled':''}><span>${e.icon}</span><div><b>${e.name}</b><small>${e.time}s · nível ${e.level}</small></div><em>${RESOURCES[e.reward].icon} ${e.amount}</em></button>`).join('')}</div>`}

function sanctuaryScreen(state){return `<small>NÚCLEO DO SANTUÁRIO</small><h2>Aprimoramentos permanentes</h2><p>Use recursos raros para melhorar todos os habitats. Os níveis ficam salvos permanentemente.</p><div class="resource-strip"><b>◈ ${state.pearls} pérolas</b><b>◫ ${state.fossils} fósseis</b><b>◆ ${state.essence} essência</b><b>⬡ ${state.dna} DNA</b></div><div class="screen-grid upgrade-grid">${UPGRADES.map(u=>{const level=upgradeLevel(state,u.id),max=level>=u.max,cost=upgradeCost(state,u.id);return `<button class="market-card upgrade-card" data-upgrade="${u.id}" ${max?'disabled':''}><span>${u.icon}</span><div><b>${u.name}</b><small>${u.desc}</small><small class="upgrade-level">Nível ${level}/${u.max}</small></div><em>${max?'MÁXIMO':`${u.icon} ${cost}`}</em></button>`}).join('')}</div>`}

function codexScreen(state){return `<small>ENCICLOPÉDIA ABISSAL</small><h2>${state.discovered.length} de ${SPECIES.length} espécies</h2><p>Cada espécie pode possuir inúmeras combinações genéticas, qualidades, padrões e linhagens.</p><div class="codex-grid">${SPECIES.map(s=>{const ok=state.discovered.includes(s.id);return `<div class="codex-entry ${ok?'':'unknown'}"><span style="color:${s.color}">${ok?'◖':'?'}</span><b>${ok?s.name:'Espécie desconhecida'}</b><small>${ok?`${s.type} · ${s.rarity}`:'Descubra em ovos e cruzamentos'}</small>${ok?`<i style="background:${rarityColors[s.rarity]}"></i>`:''}</div>`}).join('')}</div>`}


// ---- entities.js ----
class Creature {
  constructor(data, canvas, restored={}) {
    this.habitat=restored.habitat??'astral';this.aquariumId=restored.aquariumId??null;this.uid=restored.uid || (globalThis.crypto?.randomUUID?.()||`fish-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`); this.species=data;
    this.x=restored.x ?? 80+Math.random()*(canvas.width-160); this.y=restored.y ?? 120+Math.random()*(canvas.height-250);
    this.vx=restored.vx ?? (Math.random()>.5?1:-1)*(0.25+Math.random()*.4); this.vy=restored.vy??(Math.random()-.5)*.18;
    this.production=restored.production ?? 0;this.animation='swim';this.animationTime=0;
    this.age=restored.age ?? 0; this.hunger=restored.hunger ?? 80; this.ready=restored.ready ?? false;
    this.happiness=restored.happiness ?? 85;this.energy=restored.energy??100;this.health=restored.health??100;
    const genetics=createGeneticProfile(data,restored);
    this.quality=genetics.quality;this.genome=genetics.genome;this.lineage=genetics.lineage;this.mutationType=genetics.mutationType;
    this.mutated=restored.mutated ?? Boolean(this.mutationType);this.gene=restored.gene??Math.floor(Math.random()*5); this.bob=Math.random()*Math.PI*2; this.canvas=canvas;
  }
  get stage(){return this.age>=21600?'Ancião':this.age>=3600?'Adulto':this.age>=600?'Jovem':'Filhote'}
  get scale(){
    const index=['Filhote','Jovem','Adulto','Ancião'].indexOf(this.stage),base=[.55,.73,.92,1.12][index],blend=[.32,.55,.82,1][index];
    const genetic=this.genome?.size??1;return base*(1+(genetic-1)*blend);
  }
  update(dt, speed=1){
    this.justEvolved=false;
    this.animationTime=Math.max(0,this.animationTime-dt);if(!this.animationTime)this.animation='swim';
    const previousStage=this.stage;
    const nourished=this.hunger>35&&this.health>50,growthGene=this.genome?.growth??1,vitality=this.genome?.vitality??1;
    this.age+=dt/1000*speed*growthGene*(nourished?1:.35); this.hunger=Math.max(0,this.hunger-dt/180000);
    this.happiness=Math.max(10,Math.min(100,this.happiness+(this.hunger>40?.002:-.008)*dt));
    this.health=Math.max(10,Math.min(100,this.health+(this.hunger>15?.0005* vitality:-.003/Math.max(.75,vitality))*dt)); this.bob+=dt*.002;
    const motion=this.genome?.speed??1;
    this.x+=this.vx*dt*.06*motion; this.y+=this.vy*dt*.06*motion+Math.sin(this.bob)*.06;
    const m=55*this.scale; if(this.x<m||this.x>this.canvas.width-m){this.vx*=-1;this.x=Math.max(m,Math.min(this.canvas.width-m,this.x))}
    if(this.y<105||this.y>this.canvas.height-105){this.vy*=-1;this.y=Math.max(105,Math.min(this.canvas.height-105,this.y))}
    if(previousStage!==this.stage){this.animation='evolve';this.animationTime=2500;this.justEvolved=true;}
  }
  drawGeneticPattern(ctx,size){
    const pattern=this.genome?.pattern||'natural';if(pattern==='natural')return;
    ctx.save();ctx.globalAlpha=.28;ctx.lineWidth=2.2;ctx.strokeStyle=this.mutated?'#eaff73':this.species.accent;ctx.fillStyle=this.species.accent;
    if(pattern==='stripes')for(let x=-size*.25;x<size*.3;x+=12){ctx.beginPath();ctx.moveTo(x,-size*.18);ctx.lineTo(x+9,size*.18);ctx.stroke()}
    if(pattern==='aurora'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*9,0,size*.18+i*2,0,Math.PI*2);ctx.stroke()}}
    if(pattern==='pearlescent')for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*size*.18,Math.sin(a)*size*.1,2.3,0,Math.PI*2);ctx.fill()}
    if(pattern==='shadow'){ctx.globalAlpha=.22;ctx.fillStyle='#03040c';ctx.beginPath();ctx.ellipse(0,0,size*.34,size*.19,0,0,Math.PI*2);ctx.fill()}
    if(pattern==='prismatic'){for(let i=0;i<5;i++){ctx.strokeStyle=`hsl(${(i*72+(this.genome?.hue||0))%360} 90% 70%)`;ctx.beginPath();ctx.arc(0,0,size*(.12+i*.035),Math.PI*.15,Math.PI*1.45);ctx.stroke()}}
    ctx.restore();
  }
  drawMutationAura(ctx,size){
    if(!this.mutated)return;const t=this.mutationType||'luminous',time=this.bob;
    ctx.save();ctx.globalAlpha=.52;ctx.lineWidth=1.5;
    const color={luminous:'#f6ff9c',giant:'#ffc86f',swift:'#72e9ff',resilient:'#8fff91',prismatic:'#ff8dff',shadow:'#9774ff'}[t]||'#dfff43';
    ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;
    if(t==='giant'||t==='resilient'){ctx.beginPath();ctx.arc(0,0,size*.43+Math.sin(time)*2,0,Math.PI*2);ctx.stroke()}
    else for(let i=0;i<3;i++){const a=time+i*Math.PI*2/3;ctx.beginPath();ctx.arc(Math.cos(a)*size*.43,Math.sin(a)*size*.27,2.2+i*.4,0,Math.PI*2);ctx.stroke()}
    ctx.restore();
  }
  draw(ctx){
    const s=this.scale, dir=Math.sign(this.vx)||1, c=this.species.color, a=this.mutated?'#dfff43':this.species.accent;
    ctx.save();ctx.translate(this.x,this.y);ctx.scale(dir*s,s);const pulse=Math.sin(this.bob);ctx.rotate(pulse*.035);ctx.scale(1+pulse*.025,1-pulse*.035);if(this.animation==='eat'){const bite=Math.sin(this.animationTime*.025);ctx.scale(1+Math.abs(bite)*.12,1-Math.abs(bite)*.08)};if(this.animation==='evolve'){ctx.shadowColor='#fff8b0';ctx.shadowBlur=28;}ctx.shadowColor=a;ctx.shadowBlur=this.mutated?18:8;
    const atlas=getAquariumAtlas(this.species.sheet);
    const atlasIndex=Number.isFinite(this.species.frame)?this.species.frame:SPECIES.findIndex(s=>s.id===this.species.id)%6;
    if(atlas?.complete&&atlas.naturalWidth&&atlasIndex>=0){
      const cols=3,rows=2,cw=atlas.naturalWidth/cols,ch=atlas.naturalHeight/rows,col=atlasIndex%cols,row=Math.floor(atlasIndex/cols),size=100;
      const hue=(this.genome?.hue||0)+(this.mutationType==='prismatic'?40:0),sat=this.genome?.saturation||1,bright=this.mutationType==='shadow'?.76:1;
      ctx.filter=`hue-rotate(${hue}deg) saturate(${sat}) brightness(${bright})`;
      ctx.drawImage(atlas,col*cw,row*ch,cw,ch,-size/2,-size/2,size,size*.75);ctx.filter='none';ctx.shadowBlur=0;
      this.drawGeneticPattern(ctx,size);this.drawMutationAura(ctx,size);
      if(this.ready){ctx.fillStyle='#ffd773';ctx.beginPath();ctx.arc(0,-38,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14242a';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('✦',0,-35)}
      ctx.restore();return;
    }
    const sh=this.species.shape;
    if(sh==='jelly'){
      ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-3,25,Math.PI,0);ctx.quadraticCurveTo(20,18,0,14);ctx.quadraticCurveTo(-20,18,-25,-3);ctx.fill();
      ctx.strokeStyle=a;ctx.lineWidth=3;for(let i=-15;i<=15;i+=10){ctx.beginPath();ctx.moveTo(i,12);ctx.quadraticCurveTo(i+8,25,i,37);ctx.stroke()}
    } else if(sh==='ray'){
      ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-35,0);ctx.quadraticCurveTo(0,-30,35,0);ctx.quadraticCurveTo(0,22,-35,0);ctx.fill();ctx.strokeStyle=a;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-30,0);ctx.quadraticCurveTo(-55,10,-65,3);ctx.stroke();
    } else if(sh==='serpent'){
      ctx.strokeStyle=c;ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-32,9);ctx.bezierCurveTo(-12,-18,12,22,35,-4);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(34,-5,20,14,0,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,34,19,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-28,0);ctx.lineTo(-50,-20);ctx.lineTo(-48,20);ctx.closePath();ctx.fill();
      if(sh==='ancient'){ctx.strokeStyle=a;ctx.lineWidth=4;for(let i=-18;i<22;i+=12){ctx.beginPath();ctx.moveTo(i,-14);ctx.lineTo(i+4,14);ctx.stroke()}}
    }
    ctx.shadowBlur=0;ctx.fillStyle=a;ctx.beginPath();ctx.arc(18,-5,3.5,0,Math.PI*2);ctx.fill();
    this.drawGeneticPattern(ctx,92);this.drawMutationAura(ctx,92);
    if(this.ready){ctx.fillStyle='#ffd773';ctx.beginPath();ctx.arc(0,-32,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14242a';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('✦',0,-29)}
    ctx.restore();
  }
  contains(x,y){return Math.hypot(x-this.x,y-this.y)<48*this.scale}
  serialize(){return {habitat:this.habitat,aquariumId:this.aquariumId,uid:this.uid,id:this.species.id,x:this.x,y:this.y,vx:this.vx,vy:this.vy,age:this.age,hunger:this.hunger,happiness:this.happiness,energy:this.energy,health:this.health,ready:this.ready,production:this.production,mutated:this.mutated,mutationType:this.mutationType,quality:this.quality,genome:this.genome,lineage:this.lineage,gene:this.gene}}
}

function hatchSpecies(level,biome){return rollEgg(biome)}


// ---- game.js ----
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#gameCanvas'),ctx=canvas.getContext('2d');
const storeCanvas=$('#storeCanvas'),storeCtx=storeCanvas.getContext('2d');
const defaults={version:10,coins:350,shopCredits:1400,aquariums:[],activeAquariumId:null,pearls:4,dna:6,fossils:0,essence:0,water:100,xp:0,level:1,biome:'astral',unlocked:['astral'],decor:[],discovered:[],sound:true,feeds:0,collected:0,hatched:0,missions:[0,0,0],claimed:[false,false,false],missionDate:'',lastSave:Date.now(),creatures:[],expedition:null,incubators:{},upgrades:{}};
let state={...defaults},creatures=[],food=[],particles=[],selectedFilter='Todos',last=performance.now(),autosave=0,event=null,backgroundAccumulator=0,storeEconomyAccumulator=0,storeBackgroundAccumulator=0;
let mode='start',inspectedCreature=null,lastTimerRefresh=0,saveWarning=false,offlineReport=null;
const player={x:0,y:0,r:15,speed:230,target:null,initialized:false,dir:'down',walk:0};
const shopFx={npcs:[],spawnCd:1900,customerSeq:0,floaters:[]};
const moveKeys=new Set();
const shopPlayerSheet=new Image();shopPlayerSheet.src='assets/player-shop-sheet.webp';
const shopNpcSheet=new Image();shopNpcSheet.src='assets/npc-shop-sheet.webp';


function aq(){return activeAquarium(state)}
function localCreatures(){return residents(creatures,aq().id)}
function capacity(){return aquariumCapacity(state)}
function biome(){return BIOMES.find(b=>b.id===aq().habitat)||BIOMES[0]}
function dims(){return {w:canvas.logicalWidth||900,h:canvas.logicalHeight||600}}
function storeDims(){return {w:storeCanvas.logicalWidth||1200,h:storeCanvas.logicalHeight||700}}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function localDateKey(){const d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${d.getFullYear()}-${m}-${day}`}
function ensureDailyMissions(){const today=localDateKey();if(state.missionDate!==today){state.missionDate=today;state.missions=[0,0,0];state.claimed=[false,false,false]}}
function migrateLegacyIncubators(){
  ensureIncubators(state);
  for(const habitat of BIOMES.map(b=>b.id)){
    const old=state.incubators?.[habitat];if(!old)continue;
    const target=state.aquariums.find(a=>a.habitat===habitat);
    if(target&&!state.incubators[target.id])state.incubators[target.id]={...old,aquariumId:target.id,habitat};
    delete state.incubators[habitat];
  }
}
function storeLayout(){
  const {w,h}=storeDims();
  const entrance={x:w*.43,y:18,w:w*.14,h:58,cx:w*.5};
  const counter={x:Math.max(18,w-250),y:96,w:Math.min(220,w*.22),h:74};
  const leftShelf={x:24,y:94,w:120,h:56};
  const rightShelf={x:Math.max(24,w-392),y:94,w:120,h:56};
  const lounge={x:30,y:Math.max(190,h-150),w:180,h:86};
  return {w,h,entrance,counter,leftShelf,rightShelf,lounge};
}

function load(){
  state=SaveManager.load(defaults);initializeStore(state);ensureUpgrades(state);ensureIncubators(state);migrateLegacyIncubators();ensureDailyMissions();
  const fake={width:900,height:600};
  creatures=state.creatures.map(raw=>{
    const sp=SPECIES.find(s=>s.id===raw.id);if(!sp)return null;
    const legacy=raw.aquariumId?aquariumById(state,raw.aquariumId):aquariumForLegacyHabitat(state,raw.habitat||'astral');
    if(!legacy)return null;
    return new Creature(sp,fake,{...raw,aquariumId:legacy.id,habitat:legacy.habitat});
  }).filter(Boolean);
  if(!creatures.length&&!state.hatched){
    const starter=state.aquariums[0];
    for(const id of ['lumifin','lumifin']){
      const sp=SPECIES.find(s=>s.id===id),c=new Creature(sp,fake,{aquariumId:starter.id,habitat:starter.habitat});creatures.push(c);if(!state.discovered.includes(sp.id))state.discovered.push(sp.id)
    }
  }
  const away=SaveManager.offline(state.lastSave);
  if(away>10&&creatures.length)simulateOffline(away);
  syncActiveAquarium(state.activeAquariumId);
  resizeStore();renderStoreHUD();save();
}

function simulateOffline(seconds){
  let earned=0,cycles=0,fossils=0;
  const totalMs=seconds*1000,step=30000;
  for(let elapsed=0;elapsed<totalMs;elapsed+=step){
    const dt=Math.min(step,totalMs-elapsed);
    for(const tank of state.aquariums)waterDecay(tank,dt,decayMultiplier(state));
    for(const c of creatures){
      const tank=aquariumById(state,c.aquariumId);if(!tank)continue;
      c.update(dt,growthMultiplier(state,c,tank.water));
      if(tank.water<25)c.health=Math.max(10,c.health-dt*.001);
      if(c.justEvolved&&!c.mutated&&Math.random()<mutationChance(state,c))applyMutation(c);
      const payout=settleProduction(c,dt,productionMultiplier(state,c));tank.lumens+=payout.coins;earned+=payout.coins;cycles+=payout.cycles;
      const chance=jurassicFossilChance(c,payout.cycles);if(chance&&Math.random()<chance)fossils++;
    }
  }
  accrueVisitorRevenue(state,creatures,seconds);state.fossils+=fossils;state.collected+=cycles;state.missions[2]+=cycles;gainXP(cycles*4,false);
  offlineReport={seconds,earned,fossils};
}

function save(){if(!SaveManager.save(state,creatures)&&!saveWarning){saveWarning=true;toast('Não foi possível salvar. Exporte seu progresso nas configurações.')}}
function syncActiveAquarium(id){const tank=aquariumById(state,id)||state.aquariums[0];state.activeAquariumId=tank.id;state.biome=tank.habitat}

function resizeAquarium(){
  if(mode!=='aquarium')return;const r=$('#aquarium').getBoundingClientRect(),d=Math.min(devicePixelRatio,2);if(!r.width||!r.height)return;
  canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);canvas.logicalWidth=r.width;canvas.logicalHeight=r.height;
  for(const c of localCreatures()){c.canvas={width:r.width,height:r.height};c.x=Math.max(50,Math.min(r.width-50,c.x));c.y=Math.max(105,Math.min(r.height-105,c.y))}
}
function resizeStore(){
  const r=$('#storeView').getBoundingClientRect(),d=Math.min(devicePixelRatio,2);if(!r.width||!r.height)return;
  storeCanvas.width=Math.round(r.width*d);storeCanvas.height=Math.round(r.height*d);storeCanvas.style.width=r.width+'px';storeCanvas.style.height=r.height+'px';storeCtx.setTransform(d,0,0,d,0,0);storeCanvas.logicalWidth=r.width;storeCanvas.logicalHeight=r.height;
  const layout=storeLayout();
  if(!player.initialized){player.x=layout.entrance.cx;player.y=Math.max(118,layout.entrance.y+layout.entrance.h+28);player.initialized=true}else{player.x=Math.max(22,Math.min(r.width-22,player.x));player.y=Math.max(80,Math.min(r.height-24,player.y))}
}


function addCreature(sp,celebrate=true,aquariumId=aq().id,track=true,genetics=null){
  const tank=aquariumById(state,aquariumId)||aq(),d=dims(),c=new Creature(sp,{width:d.w,height:d.h},{aquariumId:tank.id,habitat:tank.habitat,...(genetics||{})});creatures.push(c);
  if(track){state.hatched++;state.missions[1]++}if(!state.discovered.includes(sp.id)){state.discovered.push(sp.id);state.pearls++}
  if(celebrate){toast(`${sp.name} nasceu ${qualityStars(c.quality)}!`,sp.rarity);burst(c.x,c.y,sp.color)}renderUI();save();return c
}
function toast(msg,type=''){
  const root=mode==='store'?$('#storeToastStack'):$('#toastStack');if(!root)return;const el=document.createElement('div');el.className='toast';el.innerHTML=`<span style="color:${rarityColors[type]||'#6fe5cd'}">✦</span><b>${msg}</b>`;root.append(el);setTimeout(()=>el.remove(),2600)
}
function burst(x,y,color){for(let i=0;i<22;i++)particles.push({x,y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:1,color})}
function floatText(x,y,text){particles.push({x,y,vx:0,vy:-.5,life:1,color:'#ffe38a',text})}

function reward(c,dt=0){
  const payout=settleProduction(c,dt,productionMultiplier(state,c));if(!payout.cycles)return false;const tank=aquariumById(state,c.aquariumId);if(!tank)return false;
  tank.lumens+=payout.coins;state.collected+=payout.cycles;state.missions[2]+=payout.cycles;gainXP(4*payout.cycles,false);
  const fossilChance=jurassicFossilChance(c,payout.cycles);if(fossilChance&&Math.random()<fossilChance){state.fossils++;if(c.aquariumId===aq().id)floatText(c.x,c.y,'+1 fóssil')}
  if(mode==='aquarium'&&c.aquariumId===aq().id)particles.push({x:c.x,y:c.y-40*c.scale,vx:0,vy:-.35,life:2,color:'#ffe38a',text:`+${payout.coins} lúmens`,follow:c.uid});return true
}
function gainXP(n,notify=true){state.xp+=n;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.shopCredits+=100;if(notify)toast(`Nível ${state.level} alcançado! +100 créditos`);BIOMES.forEach(b=>{if(b.unlock<=state.level&&!state.unlocked.includes(b.id)){state.unlocked.push(b.id);if(notify)toast(`${b.name} liberado para novos aquários!`)}})}}
function dropFood(nutrition=12,count=5){const d=dims();for(let i=0;i<count;i++)food.push({aquariumId:aq().id,habitat:aq().habitat,nutrition,x:65+Math.random()*Math.max(1,d.w-130),y:110,vy:.12,life:60000})}
function feed(){if(!localCreatures().length){toast('Este aquário está vazio');return}if(food.filter(f=>f.aquariumId===aq().id).length>=40){toast('Aguarde os peixes comerem');return}if(state.coins<2){toast('Este aquário não tem Lúmens suficientes');return}state.coins-=2;state.feeds++;state.missions[0]++;dropFood();renderUI();save()}
function hatch(){
  const tank=aq(),status=incubationStatus(state,tank.id);
  if(status.active){if(!status.ready){toast(`Ovo incubando — ${status.remaining}s restantes`);return}if(localCreatures().length>=capacity()){toast('Aquário cheio — libere espaço');return}const item=finishIncubation(state,tank.id),sp=SPECIES.find(s=>s.id===item.speciesId);if(!sp){toast('Ovo inválido');return}addCreature(sp,true,tank.id,true);toast('Incubação concluída!',sp.rarity);return}
  const price=EGGS[tank.habitat].price;if(localCreatures().length>=capacity()){toast('Aquário cheio — aumente a capacidade');return}if(state.coins<price){toast('Lúmens deste aquário insuficientes');return}state.coins-=price;const sp=hatchSpecies(state.level,tank.habitat);startIncubation(state,tank.id,tank.habitat,sp.id);toast(`${EGGS[tank.habitat].name} colocado na incubadora`);renderUI();save()
}

function updateCreature(c,elapsed){
  const tank=aquariumById(state,c.aquariumId);if(!tank)return false;c.update(elapsed,growthMultiplier(state,c,tank.water));if(tank.water<25)c.health=Math.max(10,c.health-elapsed*.001);
  if(c.justEvolved&&!c.mutated&&Math.random()<mutationChance(state,c)){const mutation=applyMutation(c);if(mode==='aquarium'&&c.aquariumId===aq().id){toast(`${c.species.name} sofreu mutação ${mutationName(mutation)}!`,'Épico');burst(c.x,c.y,'#dfff43')}}return reward(c,elapsed)
}
function updateAquarium(dt){
  let paid=false;const currentId=aq().id;
  const localFood=food.filter(f=>f.aquariumId===currentId);feedCreatures(localCreatures(),localFood,dt,(c,f)=>{burst(f.x,f.y,'#ffd66b');floatText(c.x,c.y,'+ saciedade')});
  for(const tank of state.aquariums)waterDecay(tank,dt,decayMultiplier(state));
  for(const c of localCreatures())if(updateCreature(c,dt))paid=true;
  backgroundAccumulator+=dt;if(backgroundAccumulator>=1000){const elapsed=backgroundAccumulator;backgroundAccumulator=0;for(const c of creatures){if(c.aquariumId===currentId)continue;if(updateCreature(c,elapsed))paid=true}}
  if(paid){renderUI();save()}
  food.forEach(f=>{if(f.aquariumId!==currentId)return;f.y=Math.min(dims().h-115,f.y+f.vy*dt*.06);f.life-=dt});food=food.filter(f=>!f.eaten&&f.life>0);
  particles.forEach(p=>{if(p.follow){const owner=creatures.find(c=>c.uid===p.follow);if(owner)p.x=owner.x}p.x+=p.vx*dt*.06;p.y+=p.vy*dt*.06;p.life-=dt*.001});particles=particles.filter(p=>p.life>0);
  if(Math.random()<dt*.000003&&!event)startEvent()
}
function updateSharedEconomy(dt){
  if(mode==='start')return;
  storeEconomyAccumulator+=dt;autosave+=dt;
  if(storeEconomyAccumulator>=1000){
    const elapsed=storeEconomyAccumulator/1000;storeEconomyAccumulator=0;
    if(mode!=='store')accrueVisitorRevenue(state,creatures,elapsed);
    if(mode==='store')renderStoreHUD();
  }
  if(autosave>12000){save();autosave=0;if(mode==='aquarium')renderVitals();else if(mode==='store')renderStoreHUD()}
}

function updateStoreBackground(dt){
  storeBackgroundAccumulator+=dt;if(storeBackgroundAccumulator<1000)return;
  const elapsed=storeBackgroundAccumulator;storeBackgroundAccumulator=0;
  for(const tank of state.aquariums)waterDecay(tank,elapsed,decayMultiplier(state));
  for(const c of creatures)updateCreature(c,elapsed);
}

function drawAquarium(){
  const {w,h}=dims(),b=biome(),g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,b.colors[0]);g.addColorStop(.65,b.colors[1]);g.addColorStop(1,'#071318');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.globalAlpha=.16;for(let i=0;i<18;i++){const x=(i*97+performance.now()*.006*(i%3+1))%w,y=(i*53)%h;ctx.fillStyle=i%2?b.colors[2]:'#fff';ctx.beginPath();ctx.arc(x,y,1+i%3,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  ctx.fillStyle='#071217';ctx.beginPath();ctx.moveTo(0,h-45);for(let x=0;x<=w;x+=60)ctx.quadraticCurveTo(x+30,h-65-Math.sin(x)*10,x+60,h-45);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();drawDecor(h);
  food.filter(f=>f.aquariumId===aq().id).forEach(f=>{ctx.fillStyle='#ffd66b';ctx.beginPath();ctx.arc(f.x,f.y,3,0,Math.PI*2);ctx.fill()});localCreatures().forEach(c=>c.draw(ctx));
  particles.forEach(p=>{ctx.globalAlpha=Math.min(1,p.life);ctx.fillStyle=p.color;if(p.text){ctx.font='bold 15px sans-serif';ctx.fillText(p.text,p.x,p.y)}else{ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill()}});ctx.globalAlpha=1
}
function drawDecor(h){aq().decor.forEach((id,i)=>{const d=DECORS.find(x=>x.id===id);if(!d)return;const x=90+i*115;ctx.fillStyle=d.color;ctx.globalAlpha=.72;ctx.font='42px serif';ctx.fillText(d.icon,x,h-42);ctx.globalAlpha=1})}

function storeSlotRects(){
  const {w,h}=storeDims(),cols=w>=1050?4:w>=700?3:2,margin=w<680?18:36,top=w<680?160:125,bottom=w<680?115:90,rows=Math.ceil(MAX_AQUARIUMS/cols),cellW=(w-margin*2)/cols,rowH=Math.max(78,(h-top-bottom)/rows),tankW=Math.max(110,Math.min(190,cellW-26)),tankH=Math.max(56,Math.min(112,rowH-22)),out=[];
  for(let i=0;i<MAX_AQUARIUMS;i++){const col=i%cols,row=Math.floor(i/cols),x=margin+col*cellW+(cellW-tankW)/2,y=top+row*rowH+(rowH-tankH)/2;out.push({slot:i,x,y,w:tankW,h:tankH,cx:x+tankW/2,cy:y+tankH/2})}return out
}
function aquariumAtSlot(slot){return state.aquariums.find(a=>a.slot===slot)||null}
function nearestStoreSlot(){let best=null,dist=Infinity;for(const r of storeSlotRects()){const d=Math.hypot(player.x-r.cx,player.y-r.cy);if(d<dist){dist=d;best=r}}return dist<150?{rect:best,aquarium:aquariumAtSlot(best.slot),distance:dist}:null}
function nearestInteraction(){
  const nearTank=nearestStoreSlot(),layout=storeLayout();
  const counterX=layout.counter.x+layout.counter.w*.5,counterY=layout.counter.y+layout.counter.h*.55;
  const cashDist=Math.hypot(player.x-counterX,player.y-counterY);
  let best=nearTank?{kind:'tank',distance:nearTank.distance,rect:nearTank.rect,aquarium:nearTank.aquarium}:null;
  if(cashDist<120&&(!best||cashDist<best.distance-10))best={kind:'cashier',distance:cashDist};
  return best;
}
function updateNearbyPrompt(near){
  const el=$('#nearbyPrompt');if(!el)return;if(!near){el.hidden=true;return}
  if(near.kind==='cashier'){const pending=Math.floor(pendingRevenueTotal(state));el.innerHTML=pending?`Pressione <b>E</b> no <b>Caixa da Loja</b> para coletar <b>¤ ${pending}</b>`:`<b>Mira</b> está no caixa · nenhuma receita aguardando`;el.hidden=false;return}
  const tank=near.aquarium;if(tank)el.innerHTML=`Pressione <b>E</b> para entrar em <b>${tank.name}</b>`;else el.innerHTML=`Pressione <b>E</b> para comprar um aquário · <b>¤ ${nextAquariumCost(state)}</b>`;el.hidden=false
}

function drawStore(){
  const {w,h}=storeDims(),t=performance.now(),layout=storeLayout(),near=nearestInteraction();
  const g=storeCtx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#123947');g.addColorStop(.42,'#0a2530');g.addColorStop(1,'#061317');storeCtx.fillStyle=g;storeCtx.fillRect(0,0,w,h);
  // walls and ceiling
  storeCtx.fillStyle='rgba(230,255,250,.06)';storeCtx.fillRect(0,0,w,78);storeCtx.fillStyle='rgba(0,0,0,.16)';storeCtx.fillRect(0,78,w,3);
  storeCtx.strokeStyle='rgba(111,196,190,.055)';storeCtx.lineWidth=1;for(let y=86;y<h;y+=44){storeCtx.beginPath();storeCtx.moveTo(0,y);storeCtx.lineTo(w,y);storeCtx.stroke()}for(let x=0;x<w;x+=72){storeCtx.beginPath();storeCtx.moveTo(x,0);storeCtx.lineTo(x,h);storeCtx.stroke()}
  // entrance door
  storeCtx.save();storeCtx.fillStyle='rgba(0,0,0,.24)';storeCtx.fillRect(layout.entrance.x-22,0,layout.entrance.w+44,layout.entrance.h+32);storeCtx.fillStyle='rgba(83,210,216,.16)';storeCtx.fillRect(layout.entrance.x,0,layout.entrance.w,layout.entrance.h+8);storeCtx.strokeStyle='rgba(200,255,247,.35)';storeCtx.strokeRect(layout.entrance.x,0,layout.entrance.w,layout.entrance.h+8);storeCtx.fillStyle='#e7fffb';storeCtx.font='600 12px sans-serif';storeCtx.textAlign='center';storeCtx.fillText('ENTRADA',layout.entrance.cx,layout.entrance.h+24);storeCtx.restore();
  // attendant stays behind the counter; the counter is painted over the lower body.
  drawAttendant(layout);
  // furniture
  drawFurniture(layout,near);
  for(const r of storeSlotRects()){
    const tank=aquariumAtSlot(r.slot),highlight=near?.kind==='tank'&&near?.rect.slot===r.slot;storeCtx.save();
    if(tank){const b=BIOMES.find(x=>x.id===tank.habitat)||BIOMES[0];storeCtx.shadowColor=highlight?b.colors[2]:'transparent';storeCtx.shadowBlur=highlight?22:0;storeCtx.fillStyle='#13262b';storeCtx.fillRect(r.x-7,r.y-9,r.w+14,r.h+18);const wg=storeCtx.createLinearGradient(0,r.y,0,r.y+r.h);wg.addColorStop(0,b.colors[1]);wg.addColorStop(1,b.colors[0]);storeCtx.fillStyle=wg;storeCtx.fillRect(r.x,r.y,r.w,r.h);storeCtx.strokeStyle=highlight?'#c8fff5':'rgba(155,224,219,.35)';storeCtx.lineWidth=highlight?2:1;storeCtx.strokeRect(r.x,r.y,r.w,r.h);
      storeCtx.globalAlpha=.5;for(let i=0;i<6;i++){const bx=r.x+18+((i*37+t*.015*(i%2+1))%(r.w-36)),by=r.y+r.h-12-((i*29+t*.01)%(r.h-24));storeCtx.strokeStyle=b.colors[2];storeCtx.beginPath();storeCtx.arc(bx,by,2+(i%2),0,Math.PI*2);storeCtx.stroke()}storeCtx.globalAlpha=1;
      const list=residents(creatures,tank.id);storeCtx.fillStyle='rgba(210,255,249,.78)';for(let i=0;i<Math.min(8,list.length);i++){const fx=r.x+18+(i*31)%Math.max(35,r.w-36),fy=r.y+35+(i%3)*20;storeCtx.beginPath();storeCtx.ellipse(fx,fy,7,3.5,0,0,Math.PI*2);storeCtx.fill();storeCtx.beginPath();storeCtx.moveTo(fx-6,fy);storeCtx.lineTo(fx-11,fy-5);storeCtx.lineTo(fx-11,fy+5);storeCtx.fill()}
      storeCtx.fillStyle='#eafffb';storeCtx.font='600 12px sans-serif';storeCtx.textAlign='center';storeCtx.fillText(tank.name,r.cx,r.y+r.h+31);storeCtx.fillStyle='#83aaa9';storeCtx.font='10px sans-serif';storeCtx.fillText(`${list.length}/${capacity()} peixes · ✦ ${Math.floor(tank.lumens)}`,r.cx,r.y+r.h+45);const pending=Math.floor(tank.pendingRevenue||0);if(pending>0){storeCtx.fillStyle='#a9ecff';storeCtx.fillText(`Caixa +¤ ${pending}`,r.cx,r.y-16)}
    }else{storeCtx.setLineDash([7,7]);storeCtx.strokeStyle=highlight?'#a8fff0':'rgba(129,194,189,.23)';storeCtx.lineWidth=highlight?2:1;storeCtx.strokeRect(r.x,r.y,r.w,r.h);storeCtx.setLineDash([]);storeCtx.fillStyle=highlight?'#d9fff8':'#718e8f';storeCtx.textAlign='center';storeCtx.font='600 12px sans-serif';storeCtx.fillText('+ espaço para novo aquário',r.cx,r.cy-4);storeCtx.font='10px sans-serif';storeCtx.fillText(`¤ ${nextAquariumCost(state)} créditos`,r.cx,r.cy+14)}storeCtx.restore()
  }
  drawCustomers();
  drawStoreFloaters();
  drawPlayer();
  updateNearbyPrompt(near);
}
function drawFurniture(layout,near){
  const c=storeCtx;
  // counter / cashier
  c.save();c.fillStyle='rgba(16,36,40,.95)';c.fillRect(layout.counter.x,layout.counter.y,layout.counter.w,layout.counter.h);c.fillStyle='rgba(104,228,220,.14)';c.fillRect(layout.counter.x+8,layout.counter.y+8,layout.counter.w-16,layout.counter.h-16);c.strokeStyle=near?.kind==='cashier'?'#c8fff5':'rgba(167,231,224,.3)';c.lineWidth=near?.kind==='cashier'?2:1;c.strokeRect(layout.counter.x,layout.counter.y,layout.counter.w,layout.counter.h);c.fillStyle='#ecfffc';c.font='700 13px sans-serif';c.textAlign='center';c.fillText('MIRA · ATENDENTE',layout.counter.x+layout.counter.w/2,layout.counter.y+22);c.fillStyle='#a7dfd9';c.font='11px sans-serif';c.fillText(`¤ ${Math.floor(pendingRevenueTotal(state))} aguardando`,layout.counter.x+layout.counter.w/2,layout.counter.y+42);c.fillText('Clientes pagam aqui · E coleta o caixa',layout.counter.x+layout.counter.w/2,layout.counter.y+59);
  c.fillStyle='#58d7d0';c.fillRect(layout.counter.x+16,layout.counter.y+18,26,14);c.fillStyle='#183941';c.fillRect(layout.counter.x+48,layout.counter.y+16,38,18);c.restore();
  // shelves
  for(const shelf of [layout.leftShelf,layout.rightShelf]){c.save();c.fillStyle='rgba(11,23,27,.9)';c.fillRect(shelf.x,shelf.y,shelf.w,shelf.h);c.strokeStyle='rgba(146,214,207,.22)';c.strokeRect(shelf.x,shelf.y,shelf.w,shelf.h);for(let i=0;i<4;i++){const px=shelf.x+18+i*22; c.fillStyle=['#5ed4ff','#7ef0c1','#ffcf7b','#c49dff'][i%4]; c.beginPath(); c.arc(px,shelf.y+18,7,0,Math.PI*2); c.fill(); c.fillStyle='#133139'; c.fillRect(px-8,shelf.y+31,16,12)} c.restore()}
  // lounge/planters
  c.save();c.fillStyle='rgba(10,24,28,.88)';c.fillRect(layout.lounge.x,layout.lounge.y,layout.lounge.w,layout.lounge.h);c.strokeStyle='rgba(149,219,213,.18)';c.strokeRect(layout.lounge.x,layout.lounge.y,layout.lounge.w,layout.lounge.h);c.fillStyle='#e8fffb';c.font='600 12px sans-serif';c.fillText('ÁREA DE DESCANSO',layout.lounge.x+14,layout.lounge.y+18);for(let i=0;i<3;i++){const bx=layout.lounge.x+24+i*50,by=layout.lounge.y+54; c.fillStyle='#29464e';c.fillRect(bx,by,32,12);c.fillStyle='#64d59a';c.beginPath();c.moveTo(bx+16,by-30);c.lineTo(bx+4,by);c.lineTo(bx+28,by);c.fill();}c.restore();
}
function drawPlayer(){
  const c=storeCtx;
  const dirIndex={down:0,left:1,right:2,up:3}[player.dir]??0;
  const frame=player.moving?Math.floor((player.walk||0)/2.55)%6:2;
  if(shopPlayerSheet.complete&&shopPlayerSheet.naturalWidth){
    const cols=6,rows=4,cw=shopPlayerSheet.naturalWidth/cols,ch=shopPlayerSheet.naturalHeight/rows;
    const drawW=80,drawH=88,drawX=-40,drawY=-84;
    c.save();c.translate(Math.round(player.x),Math.round(player.y));
    c.shadowColor='rgba(114,231,210,.38)';c.shadowBlur=12;
    c.drawImage(shopPlayerSheet,frame*cw,dirIndex*ch,cw,ch,drawX,drawY,drawW,drawH);
    c.shadowBlur=0;c.globalAlpha=.22;c.fillStyle='#061418';c.beginPath();c.ellipse(0,1,18,5,0,0,Math.PI*2);c.fill();
    c.restore();return;
  }
  c.save();c.translate(player.x,player.y);c.fillStyle='#d7fff8';c.beginPath();c.arc(0,-20,8,0,Math.PI*2);c.fill();c.fillStyle='#164650';c.fillRect(-9,-8,18,24);c.restore();
}
function drawAttendant(layout){
  if(!shopNpcSheet.complete||!shopNpcSheet.naturalWidth)return;
  const c=storeCtx,t=performance.now(),cols=6,rows=16,cw=shopNpcSheet.naturalWidth/cols,ch=shopNpcSheet.naturalHeight/rows;
  const variant=3,dirIndex=0,row=variant*4+dirIndex,frame=(Math.floor(t/850)%2)?2:5;
  const x=layout.counter.x+layout.counter.w*.5,y=layout.counter.y+50;
  c.save();c.translate(Math.round(x),Math.round(y));c.shadowColor='rgba(92,211,220,.30)';c.shadowBlur=8;
  c.drawImage(shopNpcSheet,frame*cw,row*ch,cw,ch,-38,-82,76,84);c.restore();
}
function updateStorePlayer(dt){
  const {w,h}=storeDims();
  let dx=0,dy=0;
  if(moveKeys.has('ArrowLeft')||moveKeys.has('KeyA')||moveKeys.has('left'))dx--;
  if(moveKeys.has('ArrowRight')||moveKeys.has('KeyD')||moveKeys.has('right'))dx++;
  if(moveKeys.has('ArrowUp')||moveKeys.has('KeyW')||moveKeys.has('up'))dy--;
  if(moveKeys.has('ArrowDown')||moveKeys.has('KeyS')||moveKeys.has('down'))dy++;
  let moved=false;
  if(dx||dy){
    player.target=null;
    const len=Math.hypot(dx,dy)||1;
    player.x+=dx/len*player.speed*dt/1000;
    player.y+=dy/len*player.speed*dt/1000;
    moved=true;
    if(Math.abs(dx)>Math.abs(dy))player.dir=dx<0?'left':'right';
    else player.dir=dy<0?'up':'down';
  }else if(player.target){
    const vx=player.target.x-player.x,vy=player.target.y-player.y,dist=Math.hypot(vx,vy);
    if(dist<5)player.target=null;
    else{
      const step=Math.min(dist,player.speed*dt/1000);
      player.x+=vx/dist*step;player.y+=vy/dist*step;
      moved=true;
      if(Math.abs(vx)>Math.abs(vy))player.dir=vx<0?'left':'right';
      else player.dir=vy<0?'up':'down';
    }
  }
  player.moving=moved;
  if(moved)player.walk=(player.walk||0)+dt*.024;
  else player.walk=(player.walk||0)*.86;
  player.x=Math.max(18,Math.min(w-18,player.x));
  player.y=Math.max(74,Math.min(h-18,player.y));
}

function drawCustomers(){for(const npc of shopFx.npcs){drawNpc(npc)}}
function drawNpc(npc){
  const c=storeCtx;
  const dirIndex={down:0,left:1,right:2,up:3}[npc.dir]??0;
  const frame=npc.moving?Math.floor((npc.walk||0)/2.8)%6:2;
  if(shopNpcSheet.complete&&shopNpcSheet.naturalWidth){
    const cols=6,rows=16,cw=shopNpcSheet.naturalWidth/cols,ch=shopNpcSheet.naturalHeight/rows,row=(npc.variant||0)*4+dirIndex;
    c.save();c.translate(Math.round(npc.x),Math.round(npc.y));c.shadowColor='rgba(125,242,227,.18)';c.shadowBlur=6;
    c.drawImage(shopNpcSheet,frame*cw,row*ch,cw,ch,-34,-71,68,75);
    c.shadowBlur=0;c.globalAlpha=.18;c.fillStyle='#061418';c.beginPath();c.ellipse(0,1,15,4,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
    if(npc.state==='browse'){
      c.fillStyle='rgba(238,255,251,.96)';c.beginPath();c.arc(1,-43,5,0,Math.PI*2);c.arc(8,-49,3.5,0,Math.PI*2);c.arc(13,-54,2,0,Math.PI*2);c.fill();
    }else if(npc.state==='pay'){
      c.fillStyle='#ffe081';c.font='bold 16px sans-serif';c.textAlign='center';c.fillText('¤',0,-45);
    }
    c.restore();return;
  }
}
function drawStoreFloaters(){
  const c=storeCtx;c.save();c.textAlign='center';c.font='700 14px sans-serif';
  for(const f of shopFx.floaters){c.globalAlpha=Math.max(0,Math.min(1,f.life));c.fillStyle=f.color||'#baffdf';c.fillText(f.text,f.x,f.y)}
  c.restore();
}
function aquariumCustomerAppeal(tank){
  if(!tank)return 0;const list=residents(creatures,tank.id);if(!list.length)return .25;
  const fish=list.reduce((sum,c)=>{const rarity=rarityValue[c.species.rarity]||1,quality=Math.max(1,c.quality||1),stage={Filhote:.45,Jovem:.75,Adulto:1.15,Ancião:1.45}[c.stage]||.45,mutation=c.mutated?1.35:1;return sum+rarity*(.72+quality*.19)*stage*mutation},0);
  const care=.55+Math.max(0,Math.min(100,tank.water||0))/100*.45;
  const decor=1+Math.min(5,(tank.decor||[]).length)*.075;
  return fish*care*decor;
}
function customerPayment(npc){
  const tank=aquariumById(state,npc.favoriteAquariumId||npc.viewedAquariumId);if(!tank)return 0;
  const appeal=Math.max(.25,npc.favoriteScore||aquariumCustomerAppeal(tank));
  const loyalty=1+Math.min(3,npc.visits||0)*.09,roll=.88+Math.random()*.28;
  const amount=Math.max(3,Math.min(70,Math.round((4+appeal*1.05)*loyalty*roll)));
  tank.pendingRevenue=(tank.pendingRevenue||0)+amount;
  const layout=storeLayout();shopFx.floaters.push({x:layout.counter.x+layout.counter.w*.5,y:layout.counter.y+layout.counter.h+18,text:`+¤ ${amount}`,life:1.8,color:'#baffdf'});
  renderStoreHUD();return amount;
}
function interactNearest(){const near=nearestInteraction();if(!near)return;if(near.kind==='cashier'){const amount=collectVisitorRevenue(state);if(!amount){toast('Ainda não há receita para coletar');return}toast(`¤ ${amount} créditos coletados no caixa`);renderStoreHUD();save();return}if(near.aquarium)enterAquarium(near.aquarium.id);else openPurchase(near.rect.slot)}
function pickCustomerTank(exclude=[]){
  const stocked=state.aquariums.filter(a=>residents(creatures,a.id).length&&!exclude.includes(a.id));
  const pool=stocked.length?stocked:state.aquariums.filter(a=>!exclude.includes(a.id));
  return pool[Math.floor(Math.random()*pool.length)]||state.aquariums[0];
}
function customerTankPoint(tank){const r=storeSlotRects().find(x=>x.slot===tank.slot)||storeSlotRects()[0];return {x:r.cx,y:r.y+r.h+35}}
function customerCashierPoint(npc){const l=storeLayout(),lane=((npc.queueLane||0)%3)-1;return {x:l.counter.x+l.counter.w*.5+lane*27,y:l.counter.y+l.counter.h+45+Math.abs(lane)*5}}
function spawnNpc(){
  if(mode!=='store'||shopFx.npcs.length>=7||!state.aquariums.length)return;
  const layout=storeLayout(),viewed=pickCustomerTank(),point=customerTankPoint(viewed),variant=shopFx.customerSeq%4,palette=[['#ffeaa8','#507d88'],['#fbd0ff','#5671a9'],['#d2ffe2','#447b67'],['#ffd5c1','#8b6359']][variant];
  shopFx.customerSeq++;
  shopFx.npcs.push({id:`npc-${shopFx.customerSeq}`,x:layout.entrance.cx+(Math.random()*34-17),y:layout.entrance.h+18,speed:92+Math.random()*34,dir:'down',walk:0,state:'toTank',viewedAquariumId:viewed.id,target:point,linger:0,palette,variant,visits:0,maxVisits:1+Math.floor(Math.random()*3),seen:[viewed.id],favoriteAquariumId:viewed.id,favoriteScore:0,queueLane:shopFx.customerSeq%3,moving:true,paid:false});
}
function updateNpcs(dt){
  if(mode!=='store'){shopFx.npcs.length=0;shopFx.floaters.length=0;return}
  shopFx.spawnCd-=dt;if(shopFx.spawnCd<=0){spawnNpc();shopFx.spawnCd=2600+Math.random()*3600}
  const layout=storeLayout();
  for(const f of shopFx.floaters){f.life-=dt/1000;f.y-=dt*.018}shopFx.floaters=shopFx.floaters.filter(f=>f.life>0);
  for(const npc of shopFx.npcs){
    npc.moving=false;
    if(npc.state==='browse'){
      npc.linger-=dt;npc.walk*=.92;const tank=aquariumById(state,npc.viewedAquariumId),rect=storeSlotRects().find(r=>r.slot===tank?.slot);
      if(rect){const dx=rect.cx-npc.x;npc.dir=Math.abs(dx)>9?(dx<0?'left':'right'):'up'}
      if(npc.linger<=0){
        const score=aquariumCustomerAppeal(tank)*(.9+Math.random()*.22);if(score>npc.favoriteScore){npc.favoriteScore=score;npc.favoriteAquariumId=tank?.id||npc.favoriteAquariumId}
        npc.visits++;
        if(npc.visits<npc.maxVisits&&state.aquariums.length>1){const next=pickCustomerTank(npc.seen);if(next){npc.seen.push(next.id);npc.viewedAquariumId=next.id;npc.target=customerTankPoint(next);npc.state='toTank';continue}}
        npc.target=customerCashierPoint(npc);npc.state='toCashier';
      }continue;
    }
    if(npc.state==='pay'){
      npc.linger-=dt;npc.dir='up';if(npc.linger<=0){if(!npc.paid){npc.paid=true;customerPayment(npc)}npc.target={x:layout.entrance.cx,y:layout.entrance.h+10};npc.state='exit';}continue;
    }
    const tx=npc.target.x,ty=npc.target.y,dx=tx-npc.x,dy=ty-npc.y,dist=Math.hypot(dx,dy);
    if(dist<8){
      if(npc.state==='toTank'){npc.state='browse';npc.linger=1800+Math.random()*2500;npc.walk=0;npc.moving=false}
      else if(npc.state==='toCashier'){npc.state='pay';npc.linger=700+Math.random()*650;npc.walk=0;npc.dir='up'}
      else if(npc.state==='exit'){npc.remove=true}
      continue;
    }
    const step=Math.min(dist,npc.speed*dt/1000);npc.x+=dx/dist*step;npc.y+=dy/dist*step;npc.walk=(npc.walk||0)+dt*.024;npc.moving=true;npc.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');
  }
  shopFx.npcs=shopFx.npcs.filter(n=>!n.remove);
}

async function enterAquarium(id){
  const tank=aquariumById(state,id);if(!tank)return;syncActiveAquarium(id);save();showLoading(tank,5);
  try{await Promise.all([loadAquariumSprites(tank.habitat,p=>updateLoading(tank,p)),wait(420)])}catch(err){hideLoading();toast('Falha ao carregar os sprites deste aquário');return}
  mode='aquarium';$('#storeView').hidden=true;$('#aquariumView').hidden=false;$('#lumensResource').hidden=false;$('#modeLabel').textContent=`${tank.name} · ${biome().name}`;food=[];particles=[];requestAnimationFrame(()=>{resizeAquarium();renderUI();updateLoading(tank,100);setTimeout(hideLoading,180)})
}
function returnToStore(){save();mode='store';storeBackgroundAccumulator=0;releaseAquariumSprites();$('#aquariumView').hidden=true;$('#storeView').hidden=false;$('#lumensResource').hidden=true;$('#modeLabel').textContent='Galeria aquática · v2.14.2';food=[];particles=[];event=null;$('#eventCard').hidden=true;resizeStore();renderStoreHUD()}
function showLoading(tank,p=0){const b=BIOMES.find(x=>x.id===tank.habitat);$('#loadingTitle').textContent=tank.name;$('#loadingEyebrow').textContent=`CARREGANDO ${b?.name?.toUpperCase()||'AQUÁRIO'}`;$('#loadingScreen').hidden=false;updateLoading(tank,p)}
function updateLoading(tank,p){const value=Math.max(0,Math.min(100,Math.round(p)));$('#loadingBar').style.width=value+'%';$('#loadingPercent').textContent=value+'%';$('#loadingText').textContent=value<90?'Carregando sprites somente deste aquário':'Montando criaturas e ambiente'}
function hideLoading(){$('#loadingScreen').hidden=true}

function openPurchase(slot){
  const cost=nextAquariumCost(state),available=BIOMES.filter(b=>state.unlocked.includes(b.id));
  $('#modalBody').innerHTML=`<small>EXPANSÃO DA LOJA</small><h2>Novo aquário</h2><p>O tanque custa <b>¤ ${cost}</b> créditos da loja. Depois de comprado, ele terá carteira de Lúmens, água, peixes e incubadora independentes.</p><div class="economy-explainer"><article><b>¤ Créditos da loja</b><small>Compram novos aquários e ampliam a galeria.</small></article><article><b>✦ Lúmens internos</b><small>Pagam ração, ovos, filtros e cuidados dentro de cada tanque.</small></article></div><div class="purchase-grid">${BIOMES.map(b=>`<button class="purchase-habitat" data-purchase-habitat="${b.id}" style="--c:${b.colors[2]}" ${!state.unlocked.includes(b.id)||state.shopCredits<cost?'disabled':''}><span></span><b>${b.name}</b><small>${state.unlocked.includes(b.id)?`Novo tanque começa com ✦ 160`:`Libera no nível ${b.unlock}`}</small></button>`).join('')}</div><div class="store-summary"><span>¤ ${Math.floor(state.shopCredits)} disponíveis</span><span>${state.aquariums.length}/${MAX_AQUARIUMS} aquários</span><span>${available.length} habitats liberados</span></div>`;
  $('#modal').showModal();$$('[data-purchase-habitat]').forEach(btn=>btn.onclick=()=>{const result=buyAquarium(state,slot,btn.dataset.purchaseHabitat);if(!result.ok){toast(result.reason);return}$('#modal').close();toast(`${result.aquarium.name} comprado!`);save();renderStoreHUD()})
}

function renderStoreHUD(){
  $('#shopCredits').textContent=Math.floor(state.shopCredits);$('#pearls').textContent=state.pearls;$('#level').textContent=state.level;$('#xpBar').style.width=`${Math.min(100,state.xp/(state.level*100)*100)}%`;$('#lumensResource').hidden=true;
  const pending=Math.floor(pendingRevenueTotal(state));$('#pendingRevenueText').textContent=pending?`¤ ${pending} aguardando coleta`:'Nenhuma receita aguardando';$('#collectRevenueBtn').disabled=pending<=0
}

function refreshIncubatorButton(){
  const btn=$('#buyEggBtn');if(!btn||mode!=='aquarium')return;const tank=aq(),status=incubationStatus(state,tank.id),egg=EGGS[tank.habitat],duration=incubationSeconds(state,tank.habitat),key=status.active?`${tank.id}:${status.ready?'ready':status.remaining}`:`${tank.id}:idle:${duration}:${egg.price}`;if(btn.dataset.incubatorKey===key)return;btn.dataset.incubatorKey=key;btn.classList.toggle('incubator-active',status.active&&!status.ready);btn.classList.toggle('incubator-ready',status.ready);
  if(!status.active){btn.innerHTML=`${eggArt(tank.habitat)}<div><b>${egg.name}</b><small>Incubar por ~${duration}s</small></div><span>✦ ${egg.price}</span>`;return}if(status.ready){btn.innerHTML=`${eggArt(tank.habitat)}<div><b>Ovo pronto para nascer!</b><small>${egg.name} · clique para chocar</small></div><span>ABRIR</span>`;return}const m=Math.floor(status.remaining/60),s=String(status.remaining%60).padStart(2,'0');btn.innerHTML=`${eggArt(tank.habitat)}<div><b>Incubando ${egg.name}</b><small>Continua mesmo fora deste aquário</small></div><span>⏳ ${m}:${s}</span>`
}
function renderUI(){
  if(mode!=='aquarium')return;ensureDailyMissions();const tank=aq(),b=biome();$('#shopCredits').textContent=Math.floor(state.shopCredits);$('#coins').textContent=Math.floor(state.coins);$('#pearls').textContent=state.pearls;$('#level').textContent=state.level;$('#xpBar').style.width=`${Math.min(100,state.xp/(state.level*100)*100)}%`;$('#lumensResource').hidden=false;refreshIncubatorButton();$('#eggSpecies').textContent=eggPreview(tank.habitat);
  $('#biomeName').textContent=tank.name;$('#biomeEra').textContent=b.era;$('#biomeEffect').textContent=`${b.name} · ${b.bonus}`;$('#aquarium').style.setProperty('--accent',b.colors[2]);$('#biomeProgress').textContent=`#${tank.slot+1}`;
  const pending=Math.floor(tank.pendingRevenue||0);$('#biomeList').innerHTML=`<article class="aquarium-current" style="--aq:${b.colors[2]}"><div class="aq-heading"><span class="aq-dot"></span><div><b>${tank.name}</b><small>${b.name} · tanque físico independente</small></div></div><div class="aq-economies"><div><small>ECONOMIA INTERNA</small><b>✦ ${Math.floor(tank.lumens)}</b></div><div><small>RECEITA NA LOJA</small><b>¤ ${pending}</b></div></div><button class="primary wide" id="panelBackStore">Voltar para a loja</button></article>`;
  $('#decorList').innerHTML=DECORS.map(d=>`<button class="decor ${tank.decor.includes(d.id)?'owned':''}" data-decor="${d.id}"><span style="color:${d.color}">${d.icon}</span><b>${d.name}</b><small>${tank.decor.includes(d.id)?'No aquário':`✦ ${d.price}`}</small></button>`).join('');
  const filtered=localCreatures().filter(c=>selectedFilter==='Todos'||c.species.rarity===selectedFilter);$('#creatureList').innerHTML=filtered.length?filtered.map(c=>`<button class="creature-row" data-creature="${c.uid}"><span class="mini-fish" style="--fish:${c.species.color}">◖</span><div><b>${c.species.name}${c.mutated?' ✧':''}</b><small class="row-stars">${qualityStars(c.quality)}</small><small>${c.stage} · G${c.lineage?.generation||1} · ${patternName(c.genome?.pattern)}</small></div><em style="color:${rarityColors[c.species.rarity]}">${c.species.rarity}</em></button>`).join(''):'<p class="empty">Nenhuma criatura neste aquário.</p>';
  $('#creatureCount').textContent=`${localCreatures().length}/${capacity()}`;$('#codexText').textContent=`${state.discovered.length} de ${SPECIES.length} espécies descobertas`;
  const ms=[{t:'Banquete coletivo',d:'Alimente 12 vezes',v:state.missions[0],goal:12,reward:90},{t:'Novos habitantes',d:'Choque 2 ovos',v:state.missions[1],goal:2,reward:2,pearl:true},{t:'Colheita luminosa',d:'Produza 18 recompensas automáticas',v:state.missions[2],goal:18,reward:150}];
  $('#missionList').innerHTML=ms.map((m,i)=>`<article class="mission"><span>${['●','◉','✦'][i]}</span><div><b>${m.t}</b><small>${m.d}</small><div class="progress"><i style="width:${Math.min(100,m.v/m.goal*100)}%"></i></div></div><button data-claim="${i}" ${m.v<m.goal||state.claimed[i]?'disabled':''}>${state.claimed[i]?'OK':`${m.pearl?'◈':'✦'} ${m.reward}`}</button></article>`).join('');const done=ms.filter((m,i)=>m.v>=m.goal&&!state.claimed[i]).length;$('#missionDot').style.display=done?'block':'none';$('#missionProgress').textContent=`${state.claimed.filter(Boolean).length}/3`;renderVitals();bindDynamic()
}
function renderVitals(){if(mode!=='aquarium')return;const mood=Math.round(averageMood(localCreatures()));$('#waterValue').textContent=`${Math.round(aq().water)}%`;$('#moodValue').textContent=`${mood}%`;$('#capacityValue').textContent=`${localCreatures().length}/${capacity()}`;$('#waterValue').classList.toggle('warning',aq().water<35);$('#moodValue').classList.toggle('warning',mood<40)}
function bindDynamic(){
  $('#panelBackStore')?.addEventListener('click',returnToStore);
  $$('.decor').forEach(el=>el.onclick=()=>{const d=DECORS.find(x=>x.id===el.dataset.decor);if(aq().decor.includes(d.id)){aq().decor=aq().decor.filter(x=>x!==d.id)}else if(state.coins>=d.price){state.coins-=d.price;aq().decor.push(d.id);gainXP(15);toast(`${d.name} adicionado`)}else toast('Lúmens deste aquário insuficientes');renderUI();save()});
  $$('[data-claim]').forEach(el=>el.onclick=()=>{const i=+el.dataset.claim,rewards=[90,2,150];if(i===1)state.pearls+=rewards[i];else state.coins+=rewards[i];state.claimed[i]=true;gainXP(20);toast('Recompensa coletada');renderUI();save()});
  $$('.creature-row').forEach(el=>el.onclick=()=>showCreature(creatures.find(c=>c.uid===el.dataset.creature)))
}

function refreshGrowthTimer(){const el=$('#adultTimer');if(!el||!$('#modal').open||!inspectedCreature)return;const c=inspectedCreature,tank=aquariumById(state,c.aquariumId);if(!tank)return;const g=growthEstimate(c,tank.water);el.textContent=g.adult?'Fase adulta alcançada':formatDuration(g.seconds);$('#adultProgress').value=g.percent;$('#adultProgressText').textContent=`${Math.floor(g.percent)}% do crescimento até adulto`;$('#growthStage').textContent=c.stage;$('#growthNeeds').textContent=`Saciedade ${Math.round(c.hunger)}% · Saúde ${Math.round(c.health)}%`;$('#sellFish').textContent=`Vender por ✦ ${salePrice(c)}`}
function showCreature(c){
  if(!c)return;inspectedCreature=c;const profile=profileSummary(c),parents=c.lineage?.parents||[],geneCards=[['TAMANHO',c.genome.size],['PRODUÇÃO',c.genome.productivity],['VELOCIDADE',c.genome.speed],['CRESCIMENTO',c.genome.growth],['VITALIDADE',c.genome.vitality]],targets=state.aquariums.filter(t=>t.id!==c.aquariumId);
  $('#modalBody').innerHTML=`<div class="modal-hero genetic-hero" style="--hero:${c.species.color};--hue:${c.genome.hue}deg"><span>◖</span><div class="hero-quality">${qualityStars(c.quality)}</div></div><small>${c.species.type} · ${c.species.rarity}${c.mutated?` · ${mutationName(c.mutationType)}`:''}</small><h2>${c.species.name}</h2><div class="identity-strip"><b>${profile.lineage}</b><span>Geração ${profile.generation}</span><span>${profile.pattern}</span><span>Score ${profile.score}</span></div><div class="creature-stats"><div><small>ESTÁGIO</small><b id="growthStage">${c.stage}</b></div><div><small>SACIEDADE</small><b>${Math.round(c.hunger)}%</b></div><div><small>HUMOR</small><b>${Math.round(c.happiness)}%</b></div><div><small>SAÚDE</small><b>${Math.round(c.health)}%</b></div></div><section class="gene-panel"><div class="gene-title"><span>GENOMA INDIVIDUAL</span><b>${qualityStars(c.quality)}</b></div>${geneCards.map(([label,value])=>`<div class="gene-row"><span>${label}</span><div><i style="width:${Math.min(100,Math.max(8,(value-.7)/.85*100))}%"></i></div><b>${genePercent(value)}</b></div>`).join('')}<small>Padrão de cor: <b>${profile.pattern}</b> · Variação cromática ${Math.round(c.genome.hue)}°</small>${c.mutated?`<small class="mutation-line">Mutação ${profile.mutation}</small>`:''}</section>${parents.length?`<section class="lineage-panel"><b>ANCESTRALIDADE</b>${parents.map(p=>`<span>${p.name} · ${qualityStars(p.quality)} · G${p.generation}</span>`).join('')}</section>`:''}<p>Produção automática: <b>+${productionInfo(c,productionMultiplier(state,c)).amount} lúmens</b>. Esta renda fica somente no aquário onde o peixe vive.</p><section class="growth-timer"><span>Tempo estimado até adulto</span><strong id="adultTimer"></strong><progress id="adultProgress" max="100" value="0"></progress><span id="adultProgressText"></span><small id="growthNeeds"></small></section><button class="primary" id="focusCreature">Encontrar no aquário</button><button class="danger" id="sellFish">Vender por ✦ ${salePrice(c)}</button><div class="transfer-controls"><label for="transferTarget">Transferir para outro aquário da loja</label><select id="transferTarget">${targets.map(t=>`<option value="${t.id}">${t.name} · ${BIOMES.find(b=>b.id===t.habitat)?.name} (${residents(creatures,t.id).length}/${capacity()})</option>`).join('')}</select><button class="primary" id="transferBtn">Transferir</button><small>Ao transferir, o peixe passa a produzir Lúmens para o novo aquário.</small></div>`;
  $('#modal').showModal();refreshGrowthTimer();
  $('#sellFish').onclick=()=>{const price=salePrice(c);$('#modalBody').innerHTML=`<h2>Vender ${c.species.name}?</h2><p>Você receberá <b>✦ ${price}</b> no aquário atual. Créditos da loja são uma economia separada.</p><button class="primary" id="cancelSale">Cancelar</button><button class="danger" id="confirmSale">Confirmar venda</button>`;$('#cancelSale').onclick=()=>showCreature(c);$('#confirmSale').onclick=()=>{const oldId=c.aquariumId,sync=state.activeAquariumId;syncActiveAquarium(oldId);const earned=sellCreature(state,creatures,c.uid);syncActiveAquarium(sync);if(!earned)return;save();renderUI();$('#modal').close();toast(`Peixe vendido por ${earned} lúmens`)}};
  $('#transferBtn').disabled=!targets.length;$('#transferBtn').onclick=()=>{if(!transferCreature(state,creatures,c.uid,$('#transferTarget').value)){toast('Destino indisponível ou aquário cheio');return}save();renderUI();$('#modal').close();toast('Criatura transferida para outro aquário')};$('#focusCreature').onclick=()=>{$('#modal').close();burst(c.x,c.y,c.species.color)}
}

function showCodex(){openScreen('codex')}
function showOffline(seconds,earned,fossils=0){
  const pending=Math.floor(pendingRevenueTotal(state));$('#modalBody').innerHTML=`<small>RELATÓRIO OFFLINE</small><h2>A loja continuou funcionando</h2><div class="offline-orb">◉</div><p>Você ficou ausente por <b>${Math.floor(seconds/3600)}h ${Math.floor(seconds%3600/60)}min</b>. Cada aquário manteve sua própria produção de Lúmens e a loja recebeu visitantes.</p><div class="offline-reward">✦ +${earned} lúmens distribuídos${fossils?` · ◫ +${fossils} fósseis`:''}<br>¤ ${pending} créditos aguardando no caixa</div><button class="primary wide" id="offlineClose">Continuar</button>`;$('#modal').showModal();$('#offlineClose').onclick=()=>$('#modal').close()
}
function openScreen(name){if(name==='shop')$('#modalBody').innerHTML=shopScreen(state);if(name==='lab')$('#modalBody').innerHTML=labScreen(state,localCreatures());if(name==='expedition')$('#modalBody').innerHTML=expeditionScreen(state);if(name==='sanctuary')$('#modalBody').innerHTML=sanctuaryScreen(state);if(name==='codex')$('#modalBody').innerHTML=codexScreen(state);$('#modal').showModal();bindScreen(name)}
function bindScreen(name){
  $$('[data-buy]').forEach(el=>el.onclick=()=>{const source=SHOP.find(i=>i.id===el.dataset.buy);if(source.kind==='egg'){$('#modal').close();hatch();return}const item=source;if(state.coins<item.price){toast('Lúmens deste aquário insuficientes');return}state.coins-=item.price;if(item.kind==='food')dropFood(25,Math.max(5,localCreatures().length));if(item.kind==='boost')localCreatures().forEach(c=>c.age+=300);if(item.kind==='water')aq().water=100;save();renderUI();$('#modal').close();toast(`${item.name} utilizado`)})
  $$('[data-expedition]').forEach(el=>el.onclick=()=>{const ex=EXPEDITIONS.find(e=>e.id===el.dataset.expedition);state.expedition={id:ex.id,ends:Date.now()+ex.time*1000};save();$('#modal').close();toast('Equipe enviada para expedição')});
  if($('#claimExp'))$('#claimExp').onclick=()=>{const ex=EXPEDITIONS.find(e=>e.id===state.expedition.id);if(Date.now()<state.expedition.ends)return;state[ex.reward]+=ex.amount;state.expedition=null;gainXP(25);save();renderUI();$('#modal').close();toast(`${ex.amount} recursos encontrados`)};
  if($('#breedBtn'))$('#breedBtn').onclick=()=>{const ids=$$('input[name="parent"]:checked').map(x=>x.value);if(ids.length!==2){toast('Escolha exatamente duas criaturas');return}if(state.dna<4||localCreatures().length>=capacity()){toast('Verifique o DNA e a capacidade do aquário');return}const [a,b]=ids.map(id=>creatures.find(c=>c.uid===id));state.dna-=4;const child=Math.random()<.5?a.species:b.species,chance=breedChance(a,b,geneticsBonus(state)+(aq().habitat==='mutant'?.08:0)),genetics=breedGeneticProfile(a,b,chance),baby=addCreature(child,false,aq().id,true,genetics);$('#modal').close();toast(baby.mutated?`Nasceu ${qualityStars(baby.quality)} com mutação ${mutationName(baby.mutationType)}!`:`Nova linhagem G${baby.lineage.generation} · ${qualityStars(baby.quality)}`,baby.species.rarity);burst(baby.x,baby.y,baby.species.color);save();renderUI()}
  $$('[data-upgrade]').forEach(el=>el.onclick=()=>{const result=buyUpgrade(state,el.dataset.upgrade);if(!result.ok){toast(result.reason);return}gainXP(25);save();renderUI();$('#modalBody').innerHTML=sanctuaryScreen(state);bindScreen('sanctuary');toast(`${result.upgrade.name} agora está no nível ${result.level}`)})
}
function startEvent(){if(mode!=='aquarium')return;event={left:30,claimed:false};$('#eventCard').hidden=false;const timer=setInterval(()=>{if(mode!=='aquarium'||!event){clearInterval(timer);return}event.left--;$('#eventTime').textContent=`0:${String(event.left).padStart(2,'0')}`;if(event.left<=0){clearInterval(timer);event=null;$('#eventCard').hidden=true}},1000)}

function loop(now){const dt=Math.min(50,now-last);last=now;if(mode!=='start')updateSharedEconomy(dt);if(mode==='aquarium'){updateAquarium(dt);drawAquarium();if(now-lastTimerRefresh>250){refreshGrowthTimer();refreshIncubatorButton();lastTimerRefresh=now}}else if(mode==='store'){updateStoreBackground(dt);updateStorePlayer(dt);updateNpcs(dt);drawStore()}requestAnimationFrame(loop)}

$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.tab-content').forEach(x=>x.classList.remove('active'));t.classList.add('active');$(`#tab-${t.dataset.tab}`).classList.add('active')});
$('#feedBtn').onclick=feed;$('#buyEggBtn').onclick=hatch;$('#codexBtn').onclick=showCodex;$('#modalClose').onclick=()=>$('#modal').close();$('#backToStoreBtn').onclick=returnToStore;
$('#soundBtn').onclick=()=>{state.sound=!state.sound;$('#soundBtn').classList.toggle('muted',!state.sound);toast(state.sound?'Som ativado':'Som desativado');save()};
$('#settingsBtn').onclick=()=>{$('#modalBody').innerHTML=`<small>PAINEL DO GUARDIÃO</small><h2>Sua galeria</h2><div class="resource-strip"><b>¤ ${Math.floor(state.shopCredits)} créditos</b><b>⬡ ${state.dna} DNA</b><b>◫ ${state.fossils} fósseis</b><b>◆ ${state.essence} essência</b></div><p>Existem duas economias: Créditos da Loja compram novos aquários; Lúmens ficam guardados separadamente em cada tanque.</p><div class="settings-actions"><button class="primary" id="exportSave">Baixar backup</button><button class="primary" id="importSave">Importar backup</button><input id="importFile" type="file" accept="application/json,.json" hidden><button class="danger wide" id="resetGame">Reiniciar progresso</button></div>`;$('#modal').showModal();$('#exportSave').onclick=()=>{state.creatures=creatures.map(c=>c.serialize());const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Abyss-Garden-v2.14.2-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};$('#importSave').onclick=()=>$('#importFile').click();$('#importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;const result=SaveManager.importData(await file.text(),defaults);if(!result.ok){toast(result.error);return}location.reload()};$('#resetGame').onclick=()=>{if(confirm('Reiniciar todo o progresso?')){SaveManager.reset();location.reload()}}};
$('#eventCard').onclick=()=>{if(!event||event.claimed)return;event.claimed=true;$('#eventCard').hidden=true;state.coins+=35;state.pearls++;gainXP(10);burst(dims().w*.5,dims().h*.35,'#fff29a');toast('Fragmento estelar coletado!');renderUI()};
$('#collectRevenueBtn').onclick=()=>{const amount=collectVisitorRevenue(state);if(!amount){toast('Ainda não há receita para coletar');return}toast(`¤ ${amount} créditos coletados no caixa`);renderStoreHUD();save()};
['Todos','Comum','Raro','Épico','Lendário'].forEach(r=>{const b=document.createElement('button');b.textContent=r;b.className=r==='Todos'?'active':'';b.onclick=()=>{selectedFilter=r;$$('#rarityFilters button').forEach(x=>x.classList.toggle('active',x===b));renderUI()};$('#rarityFilters').append(b)});
canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,c=[...localCreatures()].reverse().find(c=>c.contains(x,y));if(c)showCreature(c);else{particles.push({x,y,vx:0,vy:-.2,life:.7,color:'#fff'});localCreatures().forEach(c=>{if(Math.hypot(c.x-x,c.y-y)<140){c.vx+=(c.x-x)*.002;c.vy+=(c.y-y)*.002}})}});
storeCanvas.addEventListener('pointerdown',e=>{const r=storeCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,slot=storeSlotRects().find(s=>x>=s.x-8&&x<=s.x+s.w+8&&y>=s.y-12&&y<=s.y+s.h+52);if(slot){const tank=aquariumAtSlot(slot.slot);if(tank)enterAquarium(tank.id);else openPurchase(slot.slot);return}player.target={x,y}});
window.addEventListener('keydown',e=>{if($('#modal').open)return;if(mode==='aquarium'&&e.code==='Space'&&!e.repeat&&!['INPUT','SELECT','TEXTAREA','BUTTON'].includes(e.target.tagName)){e.preventDefault();feed();return}if(mode==='store'){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){moveKeys.add(e.code);e.preventDefault()}if(e.code==='KeyE'&&!e.repeat){interactNearest();e.preventDefault()}}});
window.addEventListener('keyup',e=>moveKeys.delete(e.code));window.addEventListener('resize',()=>{resizeStore();resizeAquarium()});window.addEventListener('beforeunload',save);
$$('[data-move]').forEach(btn=>{const key=btn.dataset.move;const down=e=>{e.preventDefault();moveKeys.add(key)},up=e=>{e.preventDefault();moveKeys.delete(key)};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up)});$('#interactBtn').onclick=interactNearest;
$('#continueBtn').onclick=()=>{$('#startScreen').classList.add('leaving');setTimeout(()=>{$('#startScreen').hidden=true;mode='store';storeBackgroundAccumulator=0;storeEconomyAccumulator=0;$('#storeView').hidden=false;$('#aquariumView').hidden=true;releaseAquariumSprites();resizeStore();renderStoreHUD();shopFx.spawnCd=1200;if(offlineReport){const r=offlineReport;offlineReport=null;showOffline(r.seconds,r.earned,r.fossils)}},650)};
$$('[data-screen]').forEach(b=>b.onclick=()=>openScreen(b.dataset.screen));

load();requestAnimationFrame(loop);

