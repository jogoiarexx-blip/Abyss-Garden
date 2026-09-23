const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const round=(n,p=2)=>Number(n.toFixed(p));

export const COLOR_PATTERNS=[
  {id:'natural',name:'Natural'},
  {id:'aurora',name:'Aurora'},
  {id:'stripes',name:'Listrado'},
  {id:'pearlescent',name:'Perolado'},
  {id:'shadow',name:'Sombrio'},
  {id:'prismatic',name:'Prismático'}
];

export const MUTATIONS={
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

export function rollQuality(rarity='Comum',random=Math.random){return weightedIndex(qualityWeights[rarity]||qualityWeights.Comum,random)+1}
export function qualityStars(q=1){const n=clamp(Math.round(q),1,5);return '★'.repeat(n)+'☆'.repeat(5-n)}
export function patternName(id='natural'){return COLOR_PATTERNS.find(p=>p.id===id)?.name||'Natural'}
export function mutationName(id){return id?(MUTATIONS[id]?.name||'Mutação'):'Nenhuma'}

export function createGeneticProfile(species,restored={},random=Math.random){
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

export function geneticScore(creature){
  const g=creature.genome||{};
  return Math.round(((g.size||1)+(g.productivity||1)+(g.speed||1)+(g.growth||1)+(g.vitality||1))/5*100);
}
export function genePercent(value=1){return `${Math.round(value*100)}%`}

export function applyMutation(creature,type=null,random=Math.random){
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

export function breedGeneticProfile(a,b,mutationChance=.1,random=Math.random){
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

export function profileSummary(c){
  return {stars:qualityStars(c.quality),score:geneticScore(c),pattern:patternName(c.genome?.pattern),mutation:mutationName(c.mutationType),generation:c.lineage?.generation||1,lineage:c.lineage?.name||'Linhagem desconhecida'};
}
