export const UPGRADES=[
  {id:'incubator',name:'Incubadora Temporal',desc:'Reduz em 12% o tempo de incubação por nível.',resource:'pearls',icon:'◈',max:4,baseCost:3},
  {id:'filtration',name:'Filtragem Profunda',desc:'Reduz em 15% a deterioração da água por nível.',resource:'fossils',icon:'◫',max:5,baseCost:3},
  {id:'production',name:'Reator de Lúmens',desc:'Aumenta em 8% toda produção de lúmens por nível.',resource:'essence',icon:'◆',max:5,baseCost:2},
  {id:'capacity',name:'Expansão de Habitat',desc:'Adiciona +2 espaços para criaturas por nível em todos os habitats.',resource:'pearls',icon:'◈',max:4,baseCost:4},
  {id:'genetics',name:'Sequenciador Genético',desc:'Adiciona +3% de chance de mutação em cruzamentos e no Núcleo Mutante.',resource:'dna',icon:'⬡',max:4,baseCost:5}
];

export function ensureUpgrades(state){
  state.upgrades??={};
  for(const u of UPGRADES)state.upgrades[u.id]=Math.max(0,Math.min(u.max,Number(state.upgrades[u.id])||0));
  return state.upgrades;
}
export function upgradeLevel(state,id){ensureUpgrades(state);return state.upgrades[id]||0}
export function upgradeCost(state,id){const u=UPGRADES.find(x=>x.id===id);if(!u)return Infinity;const level=upgradeLevel(state,id);return Math.ceil(u.baseCost*(1+level*.75));}
export function capacityBonus(state){return upgradeLevel(state,'capacity')*2}
export function incubationMultiplier(state){return Math.max(.52,1-upgradeLevel(state,'incubator')*.12)}
export function waterDecayMultiplier(state){return Math.max(.25,1-upgradeLevel(state,'filtration')*.15)}
export function productionUpgradeMultiplier(state){return 1+upgradeLevel(state,'production')*.08}
export function geneticsBonus(state){return upgradeLevel(state,'genetics')*.03}
export function buyUpgrade(state,id){
  const u=UPGRADES.find(x=>x.id===id);if(!u)return {ok:false,reason:'Aprimoramento inválido'};
  const level=upgradeLevel(state,id);if(level>=u.max)return {ok:false,reason:'Nível máximo alcançado'};
  const cost=upgradeCost(state,id);if((state[u.resource]||0)<cost)return {ok:false,reason:'Recursos insuficientes'};
  state[u.resource]-=cost;state.upgrades[id]=level+1;return {ok:true,upgrade:u,level:level+1,cost};
}
