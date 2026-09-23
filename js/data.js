export const BIOMES = [
  {id:'astral',era:'ERA I',name:'Lago Astral',effect:'Crescimento equilibrado',unlock:0,colors:['#071f2b','#0d5260','#52d8c5'],bonus:'+10% de velocidade de crescimento'},
  {id:'jurassic',era:'ERA II',name:'Recife Primordial',effect:'Fósseis e criaturas antigas',unlock:3,colors:['#16271e','#35633c','#a4d160'],bonus:'+25% de lúmens para Adultos e Anciãos'},
  {id:'abyss',era:'ERA III',name:'Fenda Leviatã',effect:'Raros aparecem com frequência',unlock:6,colors:['#100d2b','#342365','#a75dc6'],bonus:'+12 pontos de chance para espécies raras'},
  {id:'mutant',era:'ERA IV',name:'Núcleo Mutante',effect:'Mutações únicas',unlock:10,colors:['#171627','#454429','#d2e74d'],bonus:'10% de mutação ao evoluir + bônus genético'}
];

export const SPECIES = [
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

export const DECORS = [
  {id:'coral',name:'Coral lunar',icon:'♨',price:180,color:'#ff7eb3'},
  {id:'ruin',name:'Ruína antiga',icon:'⌂',price:320,color:'#c7b58a'},
  {id:'crystal',name:'Cristal vivo',icon:'♦',price:460,color:'#9c8cff'},
  {id:'kelp',name:'Bosque kelp',icon:'♧',price:140,color:'#76d271'}
];

export const rarityValue = {Comum:1,Raro:2,Épico:3,Lendário:4};
export const rarityColors = {Comum:'#86a6ae',Raro:'#5bbfe4',Épico:'#b986ff',Lendário:'#ffd36b'};
