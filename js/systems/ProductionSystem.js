export function productionInfo(c,multiplier=1){
  const interval=c.stage==='Filhote'?90000:c.stage==='Jovem'?60000:45000;
  const base={Filhote:2,Jovem:4,Adulto:12,Ancião:22}[c.stage];
  const raw=base*(c.species.rarity==='Lendário'?3:c.species.rarity==='Épico'?2:1);
  const genetic=c.genome?.productivity??1;
  const amount=Math.max(1,Math.round(raw*Math.max(.1,multiplier)*genetic));
  return {interval,amount};
}
export function settleProduction(c,elapsed,multiplier=1){
  const {interval,amount}=productionInfo(c,multiplier);
  const pending=c.ready?1:0;c.ready=false;
  c.production=Math.max(0,Number(c.production)||0)+Math.max(0,elapsed);
  const cycles=Math.floor(c.production/interval);c.production%=interval;
  return {cycles:cycles+pending,coins:(cycles+pending)*amount,amount};
}
