// Food is isolated per physical aquarium. Legacy habitat matching is kept as fallback.
export function feedCreatures(creatures,food,dt,onEat=()=>{}){
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
