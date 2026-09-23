import {SPECIES} from '../data.js';
import {incubationMultiplier} from './UpgradeSystem.js';

export const EGGS={
 astral:{name:'Ovo Astral',type:'Mágico',price:140,position:'0% 0%',weights:[42,24,12,12,7,3],seconds:35},
 jurassic:{name:'Ovo Fóssil',type:'Primordial',price:220,position:'100% 0%',weights:[40,24,12,12,8,4],seconds:50},
 abyss:{name:'Ovo Abissal',type:'Abissal',price:360,position:'0% 100%',weights:[34,23,8,18,11,6],seconds:70},
 mutant:{name:'Ovo Mutante',type:'Mutante',price:480,position:'100% 100%',weights:[40,12,6,21,14,7],seconds:90}
};
export function eggSpecies(habitat){const egg=EGGS[habitat];if(!egg)throw Error('Habitat inválido');return SPECIES.filter(s=>s.type===egg.type)}
export function rollEgg(habitat,random=Math.random){const egg=EGGS[habitat],pool=eggSpecies(habitat);let roll=random()*100;for(let i=0;i<pool.length;i++){roll-=egg.weights[i]??0;if(roll<0)return pool[i]}return pool.at(-1)}
export function eggPreview(habitat){const egg=EGGS[habitat];return eggSpecies(habitat).map((s,i)=>`${s.name} (${egg.weights[i]??0}%)`).join(' · ')}
export function eggArt(habitat){return `<span class="habitat-egg" aria-hidden="true" style="background-position:${EGGS[habitat].position}"></span>`}
export function ensureIncubators(state){state.incubators??={};return state.incubators}
export function incubationSeconds(state,habitat){return Math.max(12,Math.round(EGGS[habitat].seconds*incubationMultiplier(state)))}
export function incubationStatus(state,aquariumId){ensureIncubators(state);const item=state.incubators[aquariumId];if(!item)return {active:false,ready:false,remaining:0};const remaining=Math.max(0,Math.ceil((item.ends-Date.now())/1000));return {active:true,ready:remaining===0,remaining,item}}
export function startIncubation(state,aquariumId,habitat,speciesId){ensureIncubators(state);if(state.incubators[aquariumId])return null;const seconds=incubationSeconds(state,habitat);const item={aquariumId,habitat,speciesId,started:Date.now(),ends:Date.now()+seconds*1000};state.incubators[aquariumId]=item;return item}
export function finishIncubation(state,aquariumId){ensureIncubators(state);const status=incubationStatus(state,aquariumId);if(!status.ready)return null;delete state.incubators[aquariumId];return status.item}
