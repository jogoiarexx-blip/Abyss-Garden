import {BIOMES,rarityValue} from '../data.js';
import {capacityBonus} from './UpgradeSystem.js';

export const MAX_AQUARIUMS=8;
const BASE_COSTS=[0,700,1050,1500,2100,2850,3750,4800];

const finite=(n,fallback=0)=>Number.isFinite(Number(n))?Number(n):fallback;
const uniqueId=()=>`aq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

function habitatName(id){return BIOMES.find(b=>b.id===id)?.name||'Habitat';}

export function initializeStore(state){
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

export function activeAquarium(state){return state.aquariums?.find(a=>a.id===state.activeAquariumId)||state.aquariums?.[0];}
export function aquariumById(state,id){return state.aquariums?.find(a=>a.id===id)||null;}
export function aquariumForLegacyHabitat(state,habitat){return state.aquariums?.find(a=>a.habitat===habitat)||state.aquariums?.[0]||null;}
export function residents(creatures,aquariumId){return creatures.filter(c=>c.aquariumId===aquariumId);}
export function aquariumCapacity(state){return 8+state.level+capacityBonus(state);}
export function emptySlots(state){const used=new Set(state.aquariums.map(a=>a.slot));return [...Array(MAX_AQUARIUMS).keys()].filter(i=>!used.has(i));}
export function nextAquariumCost(state){const count=state.aquariums.length;return BASE_COSTS[Math.min(BASE_COSTS.length-1,count)]||BASE_COSTS.at(-1);}

export function buyAquarium(state,slot,habitat){
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

export function transferCreature(state,creatures,uid,destinationId){
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
export function visitorRevenueRate(aquarium,creatures){
  const list=residents(creatures,aquarium.id);
  if(!list.length)return 0;
  const appeal=list.reduce((sum,c)=>sum+visitorValue(c),0);
  return appeal/210; // créditos por segundo
}
export function accrueVisitorRevenue(state,creatures,seconds){
  const elapsed=Math.max(0,Number(seconds)||0);
  if(!elapsed)return 0;
  let total=0;
  for(const aq of state.aquariums){const gain=visitorRevenueRate(aq,creatures)*elapsed;aq.pendingRevenue+=gain;total+=gain}
  return total;
}
export function pendingRevenueTotal(state){return state.aquariums.reduce((n,a)=>n+(a.pendingRevenue||0),0);}
export function collectVisitorRevenue(state,aquariumId=null){
  const targets=aquariumId?[aquariumById(state,aquariumId)].filter(Boolean):state.aquariums;
  const amount=targets.reduce((n,a)=>n+Math.floor(a.pendingRevenue||0),0);
  if(amount<=0)return 0;
  for(const aq of targets){const whole=Math.floor(aq.pendingRevenue||0);aq.pendingRevenue=Math.max(0,(aq.pendingRevenue||0)-whole)}
  state.shopCredits+=amount;return amount;
}
