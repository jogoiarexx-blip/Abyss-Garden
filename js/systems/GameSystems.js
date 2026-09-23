export const RESOURCES={dna:{icon:'⬡',name:'DNA'},fossils:{icon:'◫',name:'Fósseis'},essence:{icon:'◆',name:'Essência'},pearls:{icon:'◈',name:'Pérolas'}};
export const SHOP=[
  {id:'basic-food',name:'Ração de plâncton',desc:'Grãos que restauram 25 de saciedade',price:35,icon:'●',kind:'food'},
  {id:'vitamin',name:'Néctar de crescimento',desc:'+5 minutos de crescimento',price:90,icon:'✦',kind:'boost'},
  {id:'cleaner',name:'Filtro biológico',desc:'Restaura a qualidade da água',price:120,icon:'≈',kind:'water'},
  {id:'mystery',name:'Ovo do habitat',desc:'Inicia uma incubação exclusiva deste habitat',price:240,icon:'◉',kind:'egg'}
];
export const EXPEDITIONS=[
  {id:'cave',name:'Cavernas de Coral',time:60,reward:'fossils',amount:3,level:1,icon:'⌁'},
  {id:'ruins',name:'Ruínas Submersas',time:180,reward:'dna',amount:4,level:3,icon:'⌂'},
  {id:'rift',name:'Fenda Desconhecida',time:420,reward:'essence',amount:2,level:6,icon:'◈'}
];
export function waterDecay(state,dt,multiplier=1){state.water=Math.max(0,(state.water??100)-dt/240000*Math.max(0,multiplier));}
export function averageMood(creatures){if(!creatures.length)return 100;return creatures.reduce((n,c)=>n+c.happiness,0)/creatures.length}
export function expeditionStatus(exp){if(!exp)return null;return Math.max(0,Math.ceil((exp.ends-Date.now())/1000))}
export function breedChance(a,b,bonus=0){const base=a.species.rarity===b.species.rarity ? .12 : .07;return Math.min(.65,base+(a.happiness+b.happiness)/2000+bonus)}
