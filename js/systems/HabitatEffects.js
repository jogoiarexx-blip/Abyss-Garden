import {productionUpgradeMultiplier,waterDecayMultiplier,geneticsBonus} from './UpgradeSystem.js';

export function growthMultiplier(state,creature,water=100){
  let value=creature.habitat==='astral'?1.10:1;
  if(water<=35)value*=.5;
  return value;
}

export function productionMultiplier(state,creature){
  let value=productionUpgradeMultiplier(state);
  if(creature.habitat==='jurassic'&&['Adulto','Ancião'].includes(creature.stage))value*=1.25;
  const care=(creature.hunger+creature.happiness+creature.health)/300;
  value*=.55+Math.max(0,Math.min(1,care))*.55;
  return value;
}

export function mutationChance(state,creature){
  if(creature.habitat!=='mutant')return 0;
  return .10+geneticsBonus(state);
}

export function decayMultiplier(state){return waterDecayMultiplier(state)}

export function jurassicFossilChance(creature,cycles=1){
  if(creature.habitat!=='jurassic'||!['Adulto','Ancião'].includes(creature.stage)||cycles<=0)return 0;
  return 1-Math.pow(.975,cycles);
}
