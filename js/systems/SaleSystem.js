import {SPECIES} from '../data.js';
export function salePrice(c){
  const species=1+Math.max(0,SPECIES.findIndex(s=>s.id===c.species.id))*.04;
  const rarity={Comum:1,Raro:2,Épico:4,Lendário:8}[c.species.rarity]??1;
  const growth={Filhote:1,Jovem:1.8,Adulto:3.5,Ancião:6}[c.stage]??1;
  const quality=1+(Math.max(1,c.quality||1)-1)*.22;
  const genes=.85+(((c.genome?.productivity??1)+(c.genome?.size??1))/2)*.15;
  return Math.floor(25*species*rarity*growth*(c.mutated?1.6:1)*quality*genes);
}
export function sellCreature(state,creatures,uid){
  const index=creatures.findIndex(c=>c.uid===uid);if(index<0)return 0;
  const price=salePrice(creatures[index]);creatures.splice(index,1);state.coins+=price;return price;
}
