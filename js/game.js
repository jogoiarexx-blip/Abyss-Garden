import {EGGS,eggPreview,eggArt,incubationStatus,startIncubation,finishIncubation,incubationSeconds,ensureIncubators} from './systems/EggSystem.js';
import {settleProduction,productionInfo} from './systems/ProductionSystem.js';
import {growthEstimate,formatDuration} from './systems/GrowthTimer.js';
import {feedCreatures} from './systems/FeedingSystem.js';
import {salePrice,sellCreature} from './systems/SaleSystem.js';
import {BIOMES,SPECIES,DECORS,rarityColors} from './data.js';
import {Creature,hatchSpecies} from './entities.js';
import {SaveManager} from './core/SaveManager.js';
import {loadAquariumSprites,releaseAquariumSprites} from './core/SpriteLoader.js';
import {SHOP,EXPEDITIONS,waterDecay,averageMood,breedChance} from './systems/GameSystems.js';
import {ensureUpgrades,capacityBonus,geneticsBonus,buyUpgrade} from './systems/UpgradeSystem.js';
import {growthMultiplier,productionMultiplier,mutationChance,decayMultiplier,jurassicFossilChance} from './systems/HabitatEffects.js';
import {shopScreen,labScreen,expeditionScreen,sanctuaryScreen,codexScreen} from './ui/Screens.js';
import {qualityStars,patternName,mutationName,genePercent,applyMutation,breedGeneticProfile,profileSummary} from './systems/GeneticsSystem.js';
import {MAX_AQUARIUMS,initializeStore,activeAquarium,aquariumById,aquariumForLegacyHabitat,residents,aquariumCapacity,emptySlots,nextAquariumCost,buyAquarium,transferCreature,accrueVisitorRevenue,pendingRevenueTotal,collectVisitorRevenue} from './systems/StoreSystem.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#gameCanvas'),ctx=canvas.getContext('2d');
const storeCanvas=$('#storeCanvas'),storeCtx=storeCanvas.getContext('2d');
const defaults={version:12,globalLumens:350,coins:350,shopCredits:1400,storeReputation:50,storeStats:{date:"",visitors:0,sales:0,revenue:0,satisfactionTotal:0},aquariums:[],activeAquariumId:null,pearls:4,dna:6,fossils:0,essence:0,water:100,xp:0,level:1,biome:'astral',unlocked:['astral'],decor:[],discovered:[],sound:true,feeds:0,collected:0,hatched:0,missions:[0,0,0],claimed:[false,false,false],missionDate:'',lastSave:Date.now(),creatures:[],expedition:null,incubators:{},upgrades:{}};
let state={...defaults},creatures=[],food=[],particles=[],selectedFilter='Todos',last=performance.now(),autosave=0,event=null,backgroundAccumulator=0,storeEconomyAccumulator=0,storeBackgroundAccumulator=0;
let mode='start',inspectedCreature=null,lastTimerRefresh=0,saveWarning=false,offlineReport=null;
const player={x:0,y:0,r:15,speed:230,target:null,initialized:false,dir:'down',walk:0};
const shopFx={npcs:[],spawnCd:1900,customerSeq:0,floaters:[],activeService:null};
const moveKeys=new Set();
const shopPlayerSheet=new Image();shopPlayerSheet.src='assets/player-shop-sheet.webp';
const shopNpcSheet=new Image();shopNpcSheet.src='assets/npc-shop-sheet.webp';


function aq(){return activeAquarium(state)}
function localCreatures(){return residents(creatures,aq().id)}
function capacity(){return aquariumCapacity(state)}
function biome(){return BIOMES.find(b=>b.id===aq().habitat)||BIOMES[0]}
function dims(){return {w:canvas.logicalWidth||900,h:canvas.logicalHeight||600}}
function storeDims(){return {w:storeCanvas.logicalWidth||1200,h:storeCanvas.logicalHeight||700}}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function localDateKey(){const d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${d.getFullYear()}-${m}-${day}`}
function ensureDailyMissions(){const today=localDateKey();if(state.missionDate!==today){state.missionDate=today;state.missions=[0,0,0];state.claimed=[false,false,false]}}
function ensureStoreStats(){
  const today=localDateKey();
  state.storeReputation=Math.max(5,Math.min(100,Number(state.storeReputation)||50));
  const prev=state.storeStats&&typeof state.storeStats==='object'?state.storeStats:{};
  state.storeStats={date:String(prev.date||''),visitors:Number(prev.visitors)||0,sales:Number(prev.sales)||0,revenue:Number(prev.revenue)||0,satisfactionTotal:Number(prev.satisfactionTotal)||0};
  if(state.storeStats.date!==today)state.storeStats={date:today,visitors:0,sales:0,revenue:0,satisfactionTotal:0};
  return state.storeStats;
}
function reputationStars(){return Math.max(1,Math.min(5,Math.round(state.storeReputation/20)))}
function storeQueue(){return shopFx.npcs.filter(n=>n.state==='queue').sort((a,b)=>(a.queueEnteredAt||0)-(b.queueEnteredAt||0))}
function cashierQueuePoint(index){const l=storeLayout();return nearestFreeStorePoint({x:l.counter.x+l.counter.w*.5,y:l.counter.y+l.counter.h+48+Math.max(0,index)*34},11)}
function customerSatisfaction(npc,tank){
  const appeal=Math.max(.25,npc.favoriteScore||aquariumCustomerAppeal(tank)),appealBonus=Math.min(34,Math.log2(1+appeal)*10.5),waitPenalty=Math.min(38,(npc.queueWait||0)/1000*2.2),waterBonus=Math.max(0,Math.min(12,((tank?.water||0)-55)*.18));
  return Math.max(8,Math.min(100,Math.round(48+appealBonus+waterBonus-waitPenalty)));
}
function updateStoreReputation(satisfaction){state.storeReputation=Math.max(5,Math.min(100,state.storeReputation+(satisfaction-state.storeReputation)*.055))}
function recordCustomerSale(amount,satisfaction){const stats=ensureStoreStats();stats.sales++;stats.revenue+=amount;stats.satisfactionTotal+=satisfaction;updateStoreReputation(satisfaction)}
function abandonCustomer(npc){
  if(npc.remove||npc.abandoned)return;npc.abandoned=true;shopFx.activeService=shopFx.activeService===npc.id?null:shopFx.activeService;state.storeReputation=Math.max(5,state.storeReputation-1.25);
  const l=storeLayout();shopFx.floaters.push({x:npc.x,y:npc.y-55,text:'Sem paciência!',life:1.6,color:'#ff9f92'});npc.state='exit';setNpcTarget(npc,{x:l.entrance.cx,y:88});renderStoreHUD();
}
function migrateLegacyIncubators(){
  ensureIncubators(state);
  for(const habitat of BIOMES.map(b=>b.id)){
    const old=state.incubators?.[habitat];if(!old)continue;
    const target=state.aquariums.find(a=>a.habitat===habitat);
    if(target&&!state.incubators[target.id])state.incubators[target.id]={...old,aquariumId:target.id,habitat};
    delete state.incubators[habitat];
  }
}
function storeLayout(){
  const {w,h}=storeDims();
  const entrance={x:w*.43,y:18,w:w*.14,h:58,cx:w*.5};
  const counter={x:Math.max(18,w-250),y:96,w:Math.min(220,w*.22),h:74};
  const leftShelf={x:24,y:94,w:120,h:56};
  const rightShelf={x:Math.max(24,w-392),y:94,w:120,h:56};
  const lounge={x:30,y:Math.max(190,h-150),w:180,h:86};
  return {w,h,entrance,counter,leftShelf,rightShelf,lounge};
}

function load(){
  state=SaveManager.load(defaults);initializeStore(state);ensureUpgrades(state);ensureIncubators(state);migrateLegacyIncubators();ensureDailyMissions();ensureStoreStats();
  const fake={width:900,height:600};
  creatures=state.creatures.map(raw=>{
    const sp=SPECIES.find(s=>s.id===raw.id);if(!sp)return null;
    const legacy=raw.aquariumId?aquariumById(state,raw.aquariumId):aquariumForLegacyHabitat(state,raw.habitat||'astral');
    if(!legacy)return null;
    return new Creature(sp,fake,{...raw,aquariumId:legacy.id,habitat:legacy.habitat});
  }).filter(Boolean);
  if(!creatures.length&&!state.hatched){
    const starter=state.aquariums[0];
    for(const id of ['lumifin','lumifin']){
      const sp=SPECIES.find(s=>s.id===id),c=new Creature(sp,fake,{aquariumId:starter.id,habitat:starter.habitat});creatures.push(c);if(!state.discovered.includes(sp.id))state.discovered.push(sp.id)
    }
  }
  const away=SaveManager.offline(state.lastSave);
  if(away>10&&creatures.length)simulateOffline(away);
  syncActiveAquarium(state.activeAquariumId);
  resizeStore();renderStoreHUD();save();
}

function simulateOffline(seconds){
  let earned=0,cycles=0,fossils=0;
  const totalMs=seconds*1000,step=30000;
  for(let elapsed=0;elapsed<totalMs;elapsed+=step){
    const dt=Math.min(step,totalMs-elapsed);
    for(const tank of state.aquariums)waterDecay(tank,dt,decayMultiplier(state));
    for(const c of creatures){
      const tank=aquariumById(state,c.aquariumId);if(!tank)continue;
      c.update(dt,growthMultiplier(state,c,tank.water));
      if(tank.water<25)c.health=Math.max(10,c.health-dt*.001);
      if(c.justEvolved&&!c.mutated&&Math.random()<mutationChance(state,c))applyMutation(c);
      const payout=settleProduction(c,dt,productionMultiplier(state,c));state.coins+=payout.coins;earned+=payout.coins;cycles+=payout.cycles;
      const chance=jurassicFossilChance(c,payout.cycles);if(chance&&Math.random()<chance)fossils++;
    }
  }
  accrueVisitorRevenue(state,creatures,seconds);state.fossils+=fossils;state.collected+=cycles;state.missions[2]+=cycles;gainXP(cycles*4,false);
  offlineReport={seconds,earned,fossils};
}

function save(){if(!SaveManager.save(state,creatures)&&!saveWarning){saveWarning=true;toast('Não foi possível salvar. Exporte seu progresso nas configurações.')}}
function syncActiveAquarium(id){const tank=aquariumById(state,id)||state.aquariums[0];state.activeAquariumId=tank.id;state.biome=tank.habitat}

function resizeAquarium(){
  if(mode!=='aquarium')return;const r=$('#aquarium').getBoundingClientRect(),d=Math.min(devicePixelRatio,2);if(!r.width||!r.height)return;
  canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);canvas.logicalWidth=r.width;canvas.logicalHeight=r.height;
  for(const c of localCreatures()){c.canvas={width:r.width,height:r.height};c.x=Math.max(50,Math.min(r.width-50,c.x));c.y=Math.max(105,Math.min(r.height-105,c.y))}
}
function resizeStore(){
  const r=$('#storeView').getBoundingClientRect(),d=Math.min(devicePixelRatio,2);if(!r.width||!r.height)return;
  storeCanvas.width=Math.round(r.width*d);storeCanvas.height=Math.round(r.height*d);storeCanvas.style.width=r.width+'px';storeCanvas.style.height=r.height+'px';storeCtx.setTransform(d,0,0,d,0,0);storeCanvas.logicalWidth=r.width;storeCanvas.logicalHeight=r.height;
  const layout=storeLayout();
  if(!player.initialized){player.x=layout.entrance.cx;player.y=Math.max(118,layout.entrance.y+layout.entrance.h+28);player.initialized=true}else{player.x=Math.max(22,Math.min(r.width-22,player.x));player.y=Math.max(80,Math.min(r.height-24,player.y))}
}


function addCreature(sp,celebrate=true,aquariumId=aq().id,track=true,genetics=null){
  const tank=aquariumById(state,aquariumId)||aq(),d=dims(),c=new Creature(sp,{width:d.w,height:d.h},{aquariumId:tank.id,habitat:tank.habitat,...(genetics||{})});creatures.push(c);
  if(track){state.hatched++;state.missions[1]++}if(!state.discovered.includes(sp.id)){state.discovered.push(sp.id);state.pearls++}
  if(celebrate){toast(`${sp.name} nasceu ${qualityStars(c.quality)}!`,sp.rarity);burst(c.x,c.y,sp.color)}renderUI();save();return c
}
function toast(msg,type=''){
  const root=mode==='store'?$('#storeToastStack'):$('#toastStack');if(!root)return;const el=document.createElement('div');el.className='toast';el.innerHTML=`<span style="color:${rarityColors[type]||'#6fe5cd'}">✦</span><b>${msg}</b>`;root.append(el);setTimeout(()=>el.remove(),2600)
}
function burst(x,y,color){for(let i=0;i<22;i++)particles.push({x,y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:1,color})}
function floatText(x,y,text){particles.push({x,y,vx:0,vy:-.5,life:1,color:'#ffe38a',text})}

function reward(c,dt=0){
  const payout=settleProduction(c,dt,productionMultiplier(state,c));if(!payout.cycles)return false;const tank=aquariumById(state,c.aquariumId);if(!tank)return false;
  state.coins+=payout.coins;state.collected+=payout.cycles;state.missions[2]+=payout.cycles;gainXP(4*payout.cycles,false);
  const fossilChance=jurassicFossilChance(c,payout.cycles);if(fossilChance&&Math.random()<fossilChance){state.fossils++;if(c.aquariumId===aq().id)floatText(c.x,c.y,'+1 fóssil')}
  if(mode==='aquarium'&&c.aquariumId===aq().id)particles.push({x:c.x,y:c.y-40*c.scale,vx:0,vy:-.35,life:2,color:'#ffe38a',text:`+${payout.coins} lúmens`,follow:c.uid});return true
}
function gainXP(n,notify=true){state.xp+=n;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.shopCredits+=100;if(notify)toast(`Nível ${state.level} alcançado! +100 créditos`);BIOMES.forEach(b=>{if(b.unlock<=state.level&&!state.unlocked.includes(b.id)){state.unlocked.push(b.id);if(notify)toast(`${b.name} liberado para novos aquários!`)}})}}
function dropFood(nutrition=12,count=5){const d=dims();for(let i=0;i<count;i++)food.push({aquariumId:aq().id,habitat:aq().habitat,nutrition,x:65+Math.random()*Math.max(1,d.w-130),y:110,vy:.12,life:60000})}
function feed(){if(!localCreatures().length){toast('Este aquário está vazio');return}if(food.filter(f=>f.aquariumId===aq().id).length>=40){toast('Aguarde os peixes comerem');return}if(state.coins<2){toast('Lúmens compartilhados insuficientes');return}state.coins-=2;state.feeds++;state.missions[0]++;dropFood();renderUI();save()}
function hatch(){
  const tank=aq(),status=incubationStatus(state,tank.id);
  if(status.active){if(!status.ready){toast(`Ovo incubando — ${status.remaining}s restantes`);return}if(localCreatures().length>=capacity()){toast('Aquário cheio — libere espaço');return}const item=finishIncubation(state,tank.id),sp=SPECIES.find(s=>s.id===item.speciesId);if(!sp){toast('Ovo inválido');return}addCreature(sp,true,tank.id,true);toast('Incubação concluída!',sp.rarity);return}
  const price=EGGS[tank.habitat].price;if(localCreatures().length>=capacity()){toast('Aquário cheio — aumente a capacidade');return}if(state.coins<price){toast(`Você precisa de ✦ ${price.toLocaleString('pt-BR')} Lúmens compartilhados`);return}state.coins-=price;const sp=hatchSpecies(state.level,tank.habitat);startIncubation(state,tank.id,tank.habitat,sp.id);toast(`${EGGS[tank.habitat].name} colocado na incubadora`);renderUI();save()
}

function updateCreature(c,elapsed){
  const tank=aquariumById(state,c.aquariumId);if(!tank)return false;c.update(elapsed,growthMultiplier(state,c,tank.water));if(tank.water<25)c.health=Math.max(10,c.health-elapsed*.001);
  if(c.justEvolved&&!c.mutated&&Math.random()<mutationChance(state,c)){const mutation=applyMutation(c);if(mode==='aquarium'&&c.aquariumId===aq().id){toast(`${c.species.name} sofreu mutação ${mutationName(mutation)}!`,'Épico');burst(c.x,c.y,'#dfff43')}}return reward(c,elapsed)
}
function updateAquarium(dt){
  let paid=false;const currentId=aq().id;
  const localFood=food.filter(f=>f.aquariumId===currentId);feedCreatures(localCreatures(),localFood,dt,(c,f)=>{burst(f.x,f.y,'#ffd66b');floatText(c.x,c.y,'+ saciedade')});
  for(const tank of state.aquariums)waterDecay(tank,dt,decayMultiplier(state));
  for(const c of localCreatures())if(updateCreature(c,dt))paid=true;
  backgroundAccumulator+=dt;if(backgroundAccumulator>=1000){const elapsed=backgroundAccumulator;backgroundAccumulator=0;for(const c of creatures){if(c.aquariumId===currentId)continue;if(updateCreature(c,elapsed))paid=true}}
  if(paid){renderUI();save()}
  food.forEach(f=>{if(f.aquariumId!==currentId)return;f.y=Math.min(dims().h-115,f.y+f.vy*dt*.06);f.life-=dt});food=food.filter(f=>!f.eaten&&f.life>0);
  particles.forEach(p=>{if(p.follow){const owner=creatures.find(c=>c.uid===p.follow);if(owner)p.x=owner.x}p.x+=p.vx*dt*.06;p.y+=p.vy*dt*.06;p.life-=dt*.001});particles=particles.filter(p=>p.life>0);
  if(Math.random()<dt*.000003&&!event)startEvent()
}
function updateSharedEconomy(dt){
  if(mode==='start')return;
  storeEconomyAccumulator+=dt;autosave+=dt;
  if(storeEconomyAccumulator>=1000){
    const elapsed=storeEconomyAccumulator/1000;storeEconomyAccumulator=0;
    if(mode!=='store')accrueVisitorRevenue(state,creatures,elapsed);
    if(mode==='store')renderStoreHUD();
  }
  if(autosave>12000){save();autosave=0;if(mode==='aquarium')renderVitals();else if(mode==='store')renderStoreHUD()}
}

function updateStoreBackground(dt){
  storeBackgroundAccumulator+=dt;if(storeBackgroundAccumulator<1000)return;
  const elapsed=storeBackgroundAccumulator;storeBackgroundAccumulator=0;
  for(const tank of state.aquariums)waterDecay(tank,elapsed,decayMultiplier(state));
  for(const c of creatures)updateCreature(c,elapsed);
}

function drawAquarium(){
  const {w,h}=dims(),b=biome(),g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,b.colors[0]);g.addColorStop(.65,b.colors[1]);g.addColorStop(1,'#071318');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.globalAlpha=.16;for(let i=0;i<18;i++){const x=(i*97+performance.now()*.006*(i%3+1))%w,y=(i*53)%h;ctx.fillStyle=i%2?b.colors[2]:'#fff';ctx.beginPath();ctx.arc(x,y,1+i%3,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  ctx.fillStyle='#071217';ctx.beginPath();ctx.moveTo(0,h-45);for(let x=0;x<=w;x+=60)ctx.quadraticCurveTo(x+30,h-65-Math.sin(x)*10,x+60,h-45);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();drawDecor(h);
  food.filter(f=>f.aquariumId===aq().id).forEach(f=>{ctx.fillStyle='#ffd66b';ctx.beginPath();ctx.arc(f.x,f.y,3,0,Math.PI*2);ctx.fill()});localCreatures().forEach(c=>c.draw(ctx));
  particles.forEach(p=>{ctx.globalAlpha=Math.min(1,p.life);ctx.fillStyle=p.color;if(p.text){ctx.font='bold 15px sans-serif';ctx.fillText(p.text,p.x,p.y)}else{ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill()}});ctx.globalAlpha=1
}
function drawDecor(h){aq().decor.forEach((id,i)=>{const d=DECORS.find(x=>x.id===id);if(!d)return;const x=90+i*115;ctx.fillStyle=d.color;ctx.globalAlpha=.72;ctx.font='42px serif';ctx.fillText(d.icon,x,h-42);ctx.globalAlpha=1})}

function storeSlotRects(){
  const {w,h}=storeDims(),cols=w>=1050?4:w>=700?3:2,margin=w<680?18:36,top=w<680?160:125,bottom=w<680?115:90,rows=Math.ceil(MAX_AQUARIUMS/cols),cellW=(w-margin*2)/cols,rowH=Math.max(78,(h-top-bottom)/rows),tankW=Math.max(110,Math.min(190,cellW-26)),tankH=Math.max(56,Math.min(112,rowH-22)),out=[];
  for(let i=0;i<MAX_AQUARIUMS;i++){const col=i%cols,row=Math.floor(i/cols),x=margin+col*cellW+(cellW-tankW)/2,y=top+row*rowH+(rowH-tankH)/2;out.push({slot:i,x,y,w:tankW,h:tankH,cx:x+tankW/2,cy:y+tankH/2})}return out
}
function aquariumAtSlot(slot){return state.aquariums.find(a=>a.slot===slot)||null}
function storeCollisionRects(radius=0){
  const l=storeLayout(),pad=Math.max(0,Number(radius)||0),rects=[];
  const add=(r,extra=0)=>rects.push({x:r.x-pad-extra,y:r.y-pad-extra,w:r.w+(pad+extra)*2,h:r.h+(pad+extra)*2});
  add(l.counter,4);add(l.leftShelf,3);add(l.rightShelf,3);add(l.lounge,3);
  for(const r of storeSlotRects())if(aquariumAtSlot(r.slot))add({x:r.x-7,y:r.y-9,w:r.w+14,h:r.h+18},3);
  return rects;
}
function pointInRect(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
function storePointFree(x,y,radius=12){
  const {w,h}=storeDims(),r=Math.max(1,radius);
  if(x<r+8||x>w-r-8||y<74+r||y>h-r-8)return false;
  return !storeCollisionRects(r).some(rect=>pointInRect(x,y,rect));
}
function moveStoreActor(actor,dx,dy,radius=12){
  const ox=actor.x,oy=actor.y;let nx=ox+dx,ny=oy;
  if(storePointFree(nx,ny,radius))actor.x=nx;
  nx=actor.x;ny=oy+dy;
  if(storePointFree(nx,ny,radius))actor.y=ny;
  return Math.hypot(actor.x-ox,actor.y-oy);
}
function nearestFreeStorePoint(point,radius=12){
  const cell=26,{w,h}=storeDims(),base={x:Math.max(radius+10,Math.min(w-radius-10,point.x)),y:Math.max(74+radius,Math.min(h-radius-10,point.y))};
  if(storePointFree(base.x,base.y,radius))return base;
  for(let ring=1;ring<=9;ring++)for(let gy=-ring;gy<=ring;gy++)for(let gx=-ring;gx<=ring;gx++){
    if(Math.max(Math.abs(gx),Math.abs(gy))!==ring)continue;
    const p={x:base.x+gx*cell,y:base.y+gy*cell};if(storePointFree(p.x,p.y,radius))return p;
  }
  return base;
}
function storeSegmentFree(a,b,radius=12){
  const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d/12));
  for(let i=1;i<=steps;i++){const t=i/steps,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;if(!storePointFree(x,y,radius))return false}
  return true;
}
function planStorePath(start,target,radius=12){
  const cell=26,{w,h}=storeDims(),minY=74+radius,maxX=Math.max(1,Math.floor((w-radius-9)/cell)),maxY=Math.max(1,Math.floor((h-radius-9-minY)/cell));
  const safeTarget=nearestFreeStorePoint(target,radius),safeStart=nearestFreeStorePoint(start,radius);
  if(storeSegmentFree(safeStart,safeTarget,radius))return [safeTarget];
  const toGrid=p=>({x:Math.max(0,Math.min(maxX,Math.round((p.x-radius-9)/cell))),y:Math.max(0,Math.min(maxY,Math.round((p.y-minY)/cell)))}),
        toWorld=g=>({x:radius+9+g.x*cell,y:minY+g.y*cell});
  const s=toGrid(safeStart),goal=toGrid(safeTarget),key=(x,y)=>`${x},${y}`,open=[{x:s.x,y:s.y,f:0}],came=new Map(),gScore=new Map([[key(s.x,s.y),0]]),closed=new Set();
  const dirs=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
  let found=null,guard=0;
  while(open.length&&guard++<3500){
    open.sort((a,b)=>a.f-b.f);const cur=open.shift(),ck=key(cur.x,cur.y);if(closed.has(ck))continue;closed.add(ck);
    if(cur.x===goal.x&&cur.y===goal.y){found=cur;break}
    for(const [dx,dy,cost] of dirs){const x=cur.x+dx,y=cur.y+dy;if(x<0||y<0||x>maxX||y>maxY)continue;const wp=toWorld({x,y});if(!storePointFree(wp.x,wp.y,radius))continue;
      if(dx&&dy){const p1=toWorld({x:cur.x+dx,y:cur.y}),p2=toWorld({x:cur.x,y:cur.y+dy});if(!storePointFree(p1.x,p1.y,radius)||!storePointFree(p2.x,p2.y,radius))continue}
      const nk=key(x,y),tent=(gScore.get(ck)??1e9)+cost;if(tent>=(gScore.get(nk)??1e9))continue;came.set(nk,ck);gScore.set(nk,tent);const hcost=Math.hypot(goal.x-x,goal.y-y);open.push({x,y,f:tent+hcost});
    }
  }
  if(!found)return [safeTarget];
  const cells=[];let k=key(goal.x,goal.y);cells.push(goal);while(k!==key(s.x,s.y)&&came.has(k)){k=came.get(k);const [x,y]=k.split(',').map(Number);cells.push({x,y})}cells.reverse();
  let raw=cells.map(toWorld);raw.push(safeTarget);const simplified=[],origin=safeStart;let anchor=origin,i=0;
  while(i<raw.length){let best=i;for(let j=i;j<raw.length;j++){if(storeSegmentFree(anchor,raw[j],radius))best=j;else break}const p=raw[best];simplified.push(p);anchor=p;i=best+1}
  return simplified;
}
function setNpcTarget(npc,point){
  npc.target=nearestFreeStorePoint(point,11);npc.path=planStorePath({x:npc.x,y:npc.y},npc.target,11);npc.pathIndex=0;
}
function moveNpcAlongPath(npc,dt){
  if(!npc.path?.length)setNpcTarget(npc,npc.target||{x:npc.x,y:npc.y});
  let wp=npc.path[Math.min(npc.pathIndex||0,npc.path.length-1)]||npc.target,dx=wp.x-npc.x,dy=wp.y-npc.y,dist=Math.hypot(dx,dy);
  if(dist<7&&(npc.pathIndex||0)<npc.path.length-1){npc.pathIndex=(npc.pathIndex||0)+1;wp=npc.path[npc.pathIndex];dx=wp.x-npc.x;dy=wp.y-npc.y;dist=Math.hypot(dx,dy)}
  const final=(npc.pathIndex||0)>=npc.path.length-1;
  if(final&&dist<8)return true;
  if(dist>0){const step=Math.min(dist,npc.speed*dt/1000),moved=moveStoreActor(npc,dx/dist*step,dy/dist*step,11);if(moved<.05){setNpcTarget(npc,npc.target);return false}npc.walk=(npc.walk||0)+dt*.024;npc.moving=true;npc.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')}
  return false;
}
function separateStoreNpcs(){
  for(let i=0;i<shopFx.npcs.length;i++)for(let j=i+1;j<shopFx.npcs.length;j++){
    const a=shopFx.npcs[i],b=shopFx.npcs[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,min=19;if(d>=min)continue;const push=(min-d)*.18,nx=dx/d,ny=dy/d;
    if(storePointFree(a.x-nx*push,a.y-ny*push,10)){a.x-=nx*push;a.y-=ny*push}if(storePointFree(b.x+nx*push,b.y+ny*push,10)){b.x+=nx*push;b.y+=ny*push}
  }
}


function nearestStoreSlot(){let best=null,dist=Infinity;for(const r of storeSlotRects()){const d=Math.hypot(player.x-r.cx,player.y-r.cy);if(d<dist){dist=d;best=r}}return dist<150?{rect:best,aquarium:aquariumAtSlot(best.slot),distance:dist}:null}
function nearestInteraction(){
  const nearTank=nearestStoreSlot(),layout=storeLayout();
  const counterX=layout.counter.x+layout.counter.w*.5,counterY=layout.counter.y+layout.counter.h*.55;
  const cashDist=Math.hypot(player.x-counterX,player.y-counterY);
  let best=nearTank?{kind:'tank',distance:nearTank.distance,rect:nearTank.rect,aquarium:nearTank.aquarium}:null;
  if(cashDist<120&&(!best||cashDist<best.distance-10))best={kind:'cashier',distance:cashDist};
  return best;
}
function updateNearbyPrompt(near){
  const el=$('#nearbyPrompt');if(!el)return;if(!near){el.hidden=true;return}
  if(near.kind==='cashier'){const pending=Math.floor(pendingRevenueTotal(state));el.innerHTML=pending?`Pressione <b>E</b> no <b>Caixa da Loja</b> para coletar <b>¤ ${pending}</b>`:`<b>Mira</b> está no caixa · nenhuma receita aguardando`;el.hidden=false;return}
  const tank=near.aquarium;if(tank)el.innerHTML=`Pressione <b>E</b> para entrar em <b>${tank.name}</b>`;else el.innerHTML=`Pressione <b>E</b> para comprar um aquário · <b>¤ ${nextAquariumCost(state)}</b>`;el.hidden=false
}

function drawStore(){
  const {w,h}=storeDims(),t=performance.now(),layout=storeLayout(),near=nearestInteraction();
  const g=storeCtx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#123947');g.addColorStop(.42,'#0a2530');g.addColorStop(1,'#061317');storeCtx.fillStyle=g;storeCtx.fillRect(0,0,w,h);
  // walls and ceiling
  storeCtx.fillStyle='rgba(230,255,250,.06)';storeCtx.fillRect(0,0,w,78);storeCtx.fillStyle='rgba(0,0,0,.16)';storeCtx.fillRect(0,78,w,3);
  storeCtx.strokeStyle='rgba(111,196,190,.055)';storeCtx.lineWidth=1;for(let y=86;y<h;y+=44){storeCtx.beginPath();storeCtx.moveTo(0,y);storeCtx.lineTo(w,y);storeCtx.stroke()}for(let x=0;x<w;x+=72){storeCtx.beginPath();storeCtx.moveTo(x,0);storeCtx.lineTo(x,h);storeCtx.stroke()}
  // entrance door
  storeCtx.save();storeCtx.fillStyle='rgba(0,0,0,.24)';storeCtx.fillRect(layout.entrance.x-22,0,layout.entrance.w+44,layout.entrance.h+32);storeCtx.fillStyle='rgba(83,210,216,.16)';storeCtx.fillRect(layout.entrance.x,0,layout.entrance.w,layout.entrance.h+8);storeCtx.strokeStyle='rgba(200,255,247,.35)';storeCtx.strokeRect(layout.entrance.x,0,layout.entrance.w,layout.entrance.h+8);storeCtx.fillStyle='#e7fffb';storeCtx.font='600 12px sans-serif';storeCtx.textAlign='center';storeCtx.fillText('ENTRADA',layout.entrance.cx,layout.entrance.h+24);storeCtx.restore();
  // attendant stays behind the counter; the counter is painted over the lower body.
  drawAttendant(layout);
  // furniture
  drawFurniture(layout,near);
  for(const r of storeSlotRects()){
    const tank=aquariumAtSlot(r.slot),highlight=near?.kind==='tank'&&near?.rect.slot===r.slot;storeCtx.save();
    if(tank){const b=BIOMES.find(x=>x.id===tank.habitat)||BIOMES[0];storeCtx.shadowColor=highlight?b.colors[2]:'transparent';storeCtx.shadowBlur=highlight?22:0;storeCtx.fillStyle='#13262b';storeCtx.fillRect(r.x-7,r.y-9,r.w+14,r.h+18);const wg=storeCtx.createLinearGradient(0,r.y,0,r.y+r.h);wg.addColorStop(0,b.colors[1]);wg.addColorStop(1,b.colors[0]);storeCtx.fillStyle=wg;storeCtx.fillRect(r.x,r.y,r.w,r.h);storeCtx.strokeStyle=highlight?'#c8fff5':'rgba(155,224,219,.35)';storeCtx.lineWidth=highlight?2:1;storeCtx.strokeRect(r.x,r.y,r.w,r.h);
      storeCtx.globalAlpha=.5;for(let i=0;i<6;i++){const bx=r.x+18+((i*37+t*.015*(i%2+1))%(r.w-36)),by=r.y+r.h-12-((i*29+t*.01)%(r.h-24));storeCtx.strokeStyle=b.colors[2];storeCtx.beginPath();storeCtx.arc(bx,by,2+(i%2),0,Math.PI*2);storeCtx.stroke()}storeCtx.globalAlpha=1;
      const list=residents(creatures,tank.id);storeCtx.fillStyle='rgba(210,255,249,.78)';for(let i=0;i<Math.min(8,list.length);i++){const fx=r.x+18+(i*31)%Math.max(35,r.w-36),fy=r.y+35+(i%3)*20;storeCtx.beginPath();storeCtx.ellipse(fx,fy,7,3.5,0,0,Math.PI*2);storeCtx.fill();storeCtx.beginPath();storeCtx.moveTo(fx-6,fy);storeCtx.lineTo(fx-11,fy-5);storeCtx.lineTo(fx-11,fy+5);storeCtx.fill()}
      storeCtx.fillStyle='#eafffb';storeCtx.font='600 12px sans-serif';storeCtx.textAlign='center';storeCtx.fillText(tank.name,r.cx,r.y+r.h+31);storeCtx.fillStyle='#83aaa9';storeCtx.font='10px sans-serif';storeCtx.fillText(`${list.length}/${capacity()} peixes · Ovo ✦ ${EGGS[tank.habitat].price.toLocaleString('pt-BR')}`,r.cx,r.y+r.h+45);const pending=Math.floor(tank.pendingRevenue||0);if(pending>0){storeCtx.fillStyle='#a9ecff';storeCtx.fillText(`Caixa +¤ ${pending}`,r.cx,r.y-16)}
    }else{storeCtx.setLineDash([7,7]);storeCtx.strokeStyle=highlight?'#a8fff0':'rgba(129,194,189,.23)';storeCtx.lineWidth=highlight?2:1;storeCtx.strokeRect(r.x,r.y,r.w,r.h);storeCtx.setLineDash([]);storeCtx.fillStyle=highlight?'#d9fff8':'#718e8f';storeCtx.textAlign='center';storeCtx.font='600 12px sans-serif';storeCtx.fillText('+ espaço para novo aquário',r.cx,r.cy-4);storeCtx.font='10px sans-serif';storeCtx.fillText(`¤ ${nextAquariumCost(state)} créditos`,r.cx,r.cy+14)}storeCtx.restore()
  }
  drawCashierQueueGuide();
  drawCustomers();
  drawStoreFloaters();
  drawPlayer();
  updateNearbyPrompt(near);
}
function drawFurniture(layout,near){
  const c=storeCtx;
  // counter / cashier
  c.save();c.fillStyle='rgba(16,36,40,.95)';c.fillRect(layout.counter.x,layout.counter.y,layout.counter.w,layout.counter.h);c.fillStyle='rgba(104,228,220,.14)';c.fillRect(layout.counter.x+8,layout.counter.y+8,layout.counter.w-16,layout.counter.h-16);c.strokeStyle=near?.kind==='cashier'?'#c8fff5':'rgba(167,231,224,.3)';c.lineWidth=near?.kind==='cashier'?2:1;c.strokeRect(layout.counter.x,layout.counter.y,layout.counter.w,layout.counter.h);c.fillStyle='#ecfffc';c.font='700 13px sans-serif';c.textAlign='center';c.fillText('MIRA · ATENDENTE',layout.counter.x+layout.counter.w/2,layout.counter.y+22);c.fillStyle='#a7dfd9';c.font='11px sans-serif';c.fillText(`¤ ${Math.floor(pendingRevenueTotal(state))} aguardando`,layout.counter.x+layout.counter.w/2,layout.counter.y+42);c.fillText('Clientes pagam aqui · E coleta o caixa',layout.counter.x+layout.counter.w/2,layout.counter.y+59);
  c.fillStyle='#58d7d0';c.fillRect(layout.counter.x+16,layout.counter.y+18,26,14);c.fillStyle='#183941';c.fillRect(layout.counter.x+48,layout.counter.y+16,38,18);c.restore();
  // shelves
  for(const shelf of [layout.leftShelf,layout.rightShelf]){c.save();c.fillStyle='rgba(11,23,27,.9)';c.fillRect(shelf.x,shelf.y,shelf.w,shelf.h);c.strokeStyle='rgba(146,214,207,.22)';c.strokeRect(shelf.x,shelf.y,shelf.w,shelf.h);for(let i=0;i<4;i++){const px=shelf.x+18+i*22; c.fillStyle=['#5ed4ff','#7ef0c1','#ffcf7b','#c49dff'][i%4]; c.beginPath(); c.arc(px,shelf.y+18,7,0,Math.PI*2); c.fill(); c.fillStyle='#133139'; c.fillRect(px-8,shelf.y+31,16,12)} c.restore()}
  // lounge/planters
  c.save();c.fillStyle='rgba(10,24,28,.88)';c.fillRect(layout.lounge.x,layout.lounge.y,layout.lounge.w,layout.lounge.h);c.strokeStyle='rgba(149,219,213,.18)';c.strokeRect(layout.lounge.x,layout.lounge.y,layout.lounge.w,layout.lounge.h);c.fillStyle='#e8fffb';c.font='600 12px sans-serif';c.fillText('ÁREA DE DESCANSO',layout.lounge.x+14,layout.lounge.y+18);for(let i=0;i<3;i++){const bx=layout.lounge.x+24+i*50,by=layout.lounge.y+54; c.fillStyle='#29464e';c.fillRect(bx,by,32,12);c.fillStyle='#64d59a';c.beginPath();c.moveTo(bx+16,by-30);c.lineTo(bx+4,by);c.lineTo(bx+28,by);c.fill();}c.restore();
}
function drawPlayer(){
  const c=storeCtx;
  const dirIndex={down:0,left:1,right:2,up:3}[player.dir]??0;
  const frame=player.moving?Math.floor((player.walk||0)/2.55)%6:2;
  if(shopPlayerSheet.complete&&shopPlayerSheet.naturalWidth){
    const cols=6,rows=4,cw=shopPlayerSheet.naturalWidth/cols,ch=shopPlayerSheet.naturalHeight/rows;
    const drawW=80,drawH=88,drawX=-40,drawY=-84;
    c.save();c.translate(Math.round(player.x),Math.round(player.y));
    c.shadowColor='rgba(114,231,210,.38)';c.shadowBlur=12;
    c.drawImage(shopPlayerSheet,frame*cw,dirIndex*ch,cw,ch,drawX,drawY,drawW,drawH);
    c.shadowBlur=0;c.globalAlpha=.22;c.fillStyle='#061418';c.beginPath();c.ellipse(0,1,18,5,0,0,Math.PI*2);c.fill();
    c.restore();return;
  }
  c.save();c.translate(player.x,player.y);c.fillStyle='#d7fff8';c.beginPath();c.arc(0,-20,8,0,Math.PI*2);c.fill();c.fillStyle='#164650';c.fillRect(-9,-8,18,24);c.restore();
}
function drawAttendant(layout){
  if(!shopNpcSheet.complete||!shopNpcSheet.naturalWidth)return;
  const c=storeCtx,t=performance.now(),cols=6,rows=16,cw=shopNpcSheet.naturalWidth/cols,ch=shopNpcSheet.naturalHeight/rows;
  const variant=3,dirIndex=0,row=variant*4+dirIndex,serving=!!shopFx.activeService,frame=serving?(Math.floor(t/170)%6):((Math.floor(t/850)%2)?2:5);
  const x=layout.counter.x+layout.counter.w*.5,y=layout.counter.y+50;
  c.save();c.translate(Math.round(x),Math.round(y));c.shadowColor='rgba(92,211,220,.30)';c.shadowBlur=8;
  c.drawImage(shopNpcSheet,frame*cw,row*ch,cw,ch,-38,-82,76,84);c.restore();
}
function updateStorePlayer(dt){
  let dx=0,dy=0;if(moveKeys.has('ArrowLeft')||moveKeys.has('KeyA')||moveKeys.has('left'))dx--;if(moveKeys.has('ArrowRight')||moveKeys.has('KeyD')||moveKeys.has('right'))dx++;if(moveKeys.has('ArrowUp')||moveKeys.has('KeyW')||moveKeys.has('up'))dy--;if(moveKeys.has('ArrowDown')||moveKeys.has('KeyS')||moveKeys.has('down'))dy++;
  let moved=false;
  if(dx||dy){
    player.target=null;const len=Math.hypot(dx,dy)||1,step=player.speed*dt/1000;const amount=moveStoreActor(player,dx/len*step,dy/len*step,14);moved=amount>.02;
    if(Math.abs(dx)>Math.abs(dy))player.dir=dx<0?'left':'right';else player.dir=dy<0?'up':'down';
  }else if(player.target){
    const target=nearestFreeStorePoint(player.target,14),vx=target.x-player.x,vy=target.y-player.y,dist=Math.hypot(vx,vy);
    if(dist<5)player.target=null;else{const step=Math.min(dist,player.speed*dt/1000),amount=moveStoreActor(player,vx/dist*step,vy/dist*step,14);moved=amount>.02;if(!moved)player.target=null;if(Math.abs(vx)>Math.abs(vy))player.dir=vx<0?'left':'right';else player.dir=vy<0?'up':'down'}
  }
  player.moving=moved;if(moved)player.walk=(player.walk||0)+dt*.024;else player.walk=(player.walk||0)*.86;
}

function drawCustomers(){for(const npc of shopFx.npcs){drawNpc(npc)}}
function drawNpc(npc){
  const c=storeCtx;
  const dirIndex={down:0,left:1,right:2,up:3}[npc.dir]??0;
  const frame=npc.moving?Math.floor((npc.walk||0)/2.8)%6:2;
  if(shopNpcSheet.complete&&shopNpcSheet.naturalWidth){
    const cols=6,rows=16,cw=shopNpcSheet.naturalWidth/cols,ch=shopNpcSheet.naturalHeight/rows,row=(npc.variant||0)*4+dirIndex;
    c.save();c.translate(Math.round(npc.x),Math.round(npc.y));c.shadowColor='rgba(125,242,227,.18)';c.shadowBlur=6;
    c.drawImage(shopNpcSheet,frame*cw,row*ch,cw,ch,-34,-71,68,75);
    c.shadowBlur=0;c.globalAlpha=.18;c.fillStyle='#061418';c.beginPath();c.ellipse(0,1,15,4,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
    if(npc.state==='browse'){
      c.fillStyle='rgba(238,255,251,.96)';c.beginPath();c.arc(1,-43,5,0,Math.PI*2);c.arc(8,-49,3.5,0,Math.PI*2);c.arc(13,-54,2,0,Math.PI*2);c.fill();
    }else if(npc.state==='queue'){
      c.fillStyle=(npc.queueWait||0)>(npc.patience||1)*.7?'#ff9f92':'#bfefff';c.font='bold 14px sans-serif';c.textAlign='center';c.fillText('◷',0,-47);
    }else if(npc.state==='service'){
      c.fillStyle='#ffe081';c.font='bold 16px sans-serif';c.textAlign='center';c.fillText('¤',0,-47);
    }else if(npc.state==='exit'&&npc.abandoned){
      c.fillStyle='#ff9f92';c.font='bold 15px sans-serif';c.textAlign='center';c.fillText('!',0,-47);
    }
    c.restore();return;
  }
}
function drawCashierQueueGuide(){
  const c=storeCtx,q=storeQueue();c.save();c.textAlign='center';c.font='700 9px sans-serif';
  for(let i=0;i<Math.max(3,Math.min(6,q.length+1));i++){const p=cashierQueuePoint(i);c.strokeStyle=i<q.length?'rgba(255,224,129,.42)':'rgba(132,217,210,.16)';c.setLineDash([4,4]);c.beginPath();c.arc(p.x,p.y,12,0,Math.PI*2);c.stroke();c.setLineDash([]);if(i===0){c.fillStyle='rgba(220,255,249,.48)';c.fillText('FILA',p.x,p.y+25)}}c.restore();
}
function drawStoreFloaters(){
  const c=storeCtx;c.save();c.textAlign='center';c.font='700 14px sans-serif';
  for(const f of shopFx.floaters){c.globalAlpha=Math.max(0,Math.min(1,f.life));c.fillStyle=f.color||'#baffdf';c.fillText(f.text,f.x,f.y)}
  c.restore();
}
function aquariumCustomerAppeal(tank){
  if(!tank)return 0;const list=residents(creatures,tank.id);if(!list.length)return .25;
  const fish=list.reduce((sum,c)=>{const rarity=rarityValue[c.species.rarity]||1,quality=Math.max(1,c.quality||1),stage={Filhote:.45,Jovem:.75,Adulto:1.15,Ancião:1.45}[c.stage]||.45,mutation=c.mutated?1.35:1;return sum+rarity*(.72+quality*.19)*stage*mutation},0);
  const care=.55+Math.max(0,Math.min(100,tank.water||0))/100*.45;
  const decor=1+Math.min(5,(tank.decor||[]).length)*.075;
  return fish*care*decor;
}
function customerPayment(npc){
  const tank=aquariumById(state,npc.favoriteAquariumId||npc.viewedAquariumId);if(!tank)return 0;
  const appeal=Math.max(.25,npc.favoriteScore||aquariumCustomerAppeal(tank)),satisfaction=customerSatisfaction(npc,tank),loyalty=1+Math.min(3,npc.visits||0)*.08,rep=.82+(state.storeReputation/100)*.34,sat=.78+(satisfaction/100)*.44,roll=.9+Math.random()*.22;
  const amount=Math.max(3,Math.min(95,Math.round((4+appeal*1.05)*loyalty*rep*sat*roll)));
  tank.pendingRevenue=(tank.pendingRevenue||0)+amount;npc.satisfaction=satisfaction;recordCustomerSale(amount,satisfaction);
  const layout=storeLayout(),mood=satisfaction>=85?'★★★★★':satisfaction>=70?'★★★★☆':satisfaction>=55?'★★★☆☆':satisfaction>=40?'★★☆☆☆':'★☆☆☆☆';
  shopFx.floaters.push({x:layout.counter.x+layout.counter.w*.5,y:layout.counter.y+layout.counter.h+18,text:`+¤ ${amount} · ${mood}`,life:2,color:satisfaction>=70?'#baffdf':'#ffd19a'});
  renderStoreHUD();return amount;
}
function interactNearest(){const near=nearestInteraction();if(!near)return;if(near.kind==='cashier'){const amount=collectVisitorRevenue(state);if(!amount){toast('Ainda não há receita para coletar');return}toast(`¤ ${amount} créditos coletados no caixa`);renderStoreHUD();save();return}if(near.aquarium)enterAquarium(near.aquarium.id);else openPurchase(near.rect.slot)}
function pickCustomerTank(exclude=[]){
  const stocked=state.aquariums.filter(a=>residents(creatures,a.id).length&&!exclude.includes(a.id));
  const pool=stocked.length?stocked:state.aquariums.filter(a=>!exclude.includes(a.id));
  return pool[Math.floor(Math.random()*pool.length)]||state.aquariums[0];
}
function customerTankPoint(tank){const r=storeSlotRects().find(x=>x.slot===tank.slot)||storeSlotRects()[0];return {x:r.cx,y:r.y+r.h+35}}
function spawnNpc(){
  ensureStoreStats();const maxCustomers=Math.min(8,4+Math.floor(state.storeReputation/20));
  if(mode!=='store'||shopFx.npcs.length>=maxCustomers||!state.aquariums.length)return;
  const layout=storeLayout(),viewed=pickCustomerTank(),point=customerTankPoint(viewed),variant=shopFx.customerSeq%4,palette=[['#ffeaa8','#507d88'],['#fbd0ff','#5671a9'],['#d2ffe2','#447b67'],['#ffd5c1','#8b6359']][variant];
  shopFx.customerSeq++;state.storeStats.visitors++;
  const npc={id:`npc-${shopFx.customerSeq}`,x:layout.entrance.cx+(Math.random()*34-17),y:Math.max(88,layout.entrance.h+26),speed:92+Math.random()*34,dir:'down',walk:0,state:'toTank',viewedAquariumId:viewed.id,target:point,linger:0,palette,variant,visits:0,maxVisits:1+Math.floor(Math.random()*3),seen:[viewed.id],favoriteAquariumId:viewed.id,favoriteScore:0,moving:true,paid:false,path:[],pathIndex:0,queueEnteredAt:0,queueWait:0,patience:10500+Math.random()*7500,satisfaction:70,serviceTimer:0};
  const safe=nearestFreeStorePoint({x:npc.x,y:npc.y},11);npc.x=safe.x;npc.y=safe.y;setNpcTarget(npc,point);shopFx.npcs.push(npc);renderStoreHUD();
}
function updateNpcs(dt){
  if(mode!=='store'){shopFx.npcs.length=0;shopFx.floaters.length=0;shopFx.activeService=null;return}
  ensureStoreStats();shopFx.spawnCd-=dt;
  if(shopFx.spawnCd<=0){spawnNpc();const rep=state.storeReputation,base=Math.max(2300,6500-rep*34);shopFx.spawnCd=base+Math.random()*2200}
  const layout=storeLayout();
  for(const f of shopFx.floaters){f.life-=dt/1000;f.y-=dt*.018}shopFx.floaters=shopFx.floaters.filter(f=>f.life>0);
  if(shopFx.activeService&&!shopFx.npcs.some(n=>n.id===shopFx.activeService&&!n.remove))shopFx.activeService=null;
  const queue=storeQueue();
  queue.forEach((npc,index)=>{
    npc.queueIndex=index;npc.queueWait=(npc.queueWait||0)+dt;
    const point=cashierQueuePoint(index),changed=!npc.target||Math.hypot(npc.target.x-point.x,npc.target.y-point.y)>8;
    if(changed)setNpcTarget(npc,point);
    if(npc.queueWait>npc.patience&&npc.id!==shopFx.activeService){abandonCustomer(npc);return}
    const reached=moveNpcAlongPath(npc,dt);
    if(index===0&&!shopFx.activeService&&reached&&!npc.remove){shopFx.activeService=npc.id;npc.state='service';npc.serviceTimer=850+Math.random()*450;npc.moving=false;npc.dir='up'}
  });
  for(const npc of shopFx.npcs){
    if(npc.remove)continue;npc.moving=npc.moving||false;
    if(npc.state==='queue')continue;
    if(npc.state==='service'){
      npc.moving=false;npc.dir='up';npc.serviceTimer-=dt;
      if(npc.serviceTimer<=0){if(!npc.paid){npc.paid=true;customerPayment(npc)}shopFx.activeService=null;setNpcTarget(npc,{x:layout.entrance.cx,y:88});npc.state='exit'}
      continue;
    }
    if(npc.state==='browse'){
      npc.linger-=dt;npc.walk*=.92;const tank=aquariumById(state,npc.viewedAquariumId),rect=storeSlotRects().find(r=>r.slot===tank?.slot);
      if(rect){const dx=rect.cx-npc.x;npc.dir=Math.abs(dx)>9?(dx<0?'left':'right'):'up'}
      if(npc.linger<=0){
        const score=aquariumCustomerAppeal(tank)*(.9+Math.random()*.22);if(score>npc.favoriteScore){npc.favoriteScore=score;npc.favoriteAquariumId=tank?.id||npc.favoriteAquariumId}
        npc.visits++;
        if(npc.visits<npc.maxVisits&&state.aquariums.length>1){const next=pickCustomerTank(npc.seen);if(next){npc.seen.push(next.id);npc.viewedAquariumId=next.id;setNpcTarget(npc,customerTankPoint(next));npc.state='toTank';continue}}
        npc.state='queue';npc.queueEnteredAt=performance.now();npc.queueWait=0;setNpcTarget(npc,cashierQueuePoint(storeQueue().length));renderStoreHUD();
      }continue;
    }
    if(moveNpcAlongPath(npc,dt)){
      if(npc.state==='toTank'){npc.state='browse';npc.linger=1800+Math.random()*2500;npc.walk=0;npc.moving=false}
      else if(npc.state==='exit'){npc.remove=true}
    }
  }
  separateStoreNpcs();shopFx.npcs=shopFx.npcs.filter(n=>!n.remove);
}

async function enterAquarium(id){
  const tank=aquariumById(state,id);if(!tank)return;syncActiveAquarium(id);save();showLoading(tank,5);
  try{await Promise.all([loadAquariumSprites(tank.habitat,p=>updateLoading(tank,p)),wait(420)])}catch(err){hideLoading();toast('Falha ao carregar os sprites deste aquário');return}
  mode='aquarium';$('#storeView').hidden=true;$('#aquariumView').hidden=false;$('#lumensResource').hidden=false;$('#modeLabel').textContent=`${tank.name} · ${biome().name}`;food=[];particles=[];requestAnimationFrame(()=>{resizeAquarium();renderUI();updateLoading(tank,100);setTimeout(hideLoading,180)})
}
function returnToStore(){save();mode='store';storeBackgroundAccumulator=0;releaseAquariumSprites();$('#aquariumView').hidden=true;$('#storeView').hidden=false;$('#lumensResource').hidden=false;$('#modeLabel').textContent='Galeria aquática · v2.15.1';food=[];particles=[];event=null;$('#eventCard').hidden=true;resizeStore();renderStoreHUD()}
function showLoading(tank,p=0){const b=BIOMES.find(x=>x.id===tank.habitat);$('#loadingTitle').textContent=tank.name;$('#loadingEyebrow').textContent=`CARREGANDO ${b?.name?.toUpperCase()||'AQUÁRIO'}`;$('#loadingScreen').hidden=false;updateLoading(tank,p)}
function updateLoading(tank,p){const value=Math.max(0,Math.min(100,Math.round(p)));$('#loadingBar').style.width=value+'%';$('#loadingPercent').textContent=value+'%';$('#loadingText').textContent=value<90?'Carregando sprites somente deste aquário':'Montando criaturas e ambiente'}
function hideLoading(){$('#loadingScreen').hidden=true}

function openPurchase(slot){
  const cost=nextAquariumCost(state),available=BIOMES.filter(b=>state.unlocked.includes(b.id));
  $('#modalBody').innerHTML=`<small>EXPANSÃO DA LOJA</small><h2>Novo aquário</h2><p>O tanque custa <b>¤ ${cost}</b> créditos da loja. Água, peixes e incubadora são individuais, mas ele usa o mesmo saldo compartilhado de Lúmens.</p><div class="economy-explainer"><article><b>¤ Créditos da loja</b><small>Compram novos aquários e ampliam a galeria.</small></article><article><b>✦ Lúmens compartilhados</b><small>Um único saldo paga ração, ovos, filtros e cuidados de todos os tanques.</small></article></div><div class="purchase-grid">${BIOMES.map(b=>`<button class="purchase-habitat" data-purchase-habitat="${b.id}" style="--c:${b.colors[2]}" ${!state.unlocked.includes(b.id)||state.shopCredits<cost?'disabled':''}><span></span><b>${b.name}</b><small>${state.unlocked.includes(b.id)?`Ovo: ✦ ${EGGS[b.id].price.toLocaleString('pt-BR')}`:`Libera no nível ${b.unlock}`}</small></button>`).join('')}</div><div class="store-summary"><span>¤ ${Math.floor(state.shopCredits)} disponíveis</span><span>${state.aquariums.length}/${MAX_AQUARIUMS} aquários</span><span>${available.length} habitats liberados</span></div>`;
  $('#modal').showModal();$$('[data-purchase-habitat]').forEach(btn=>btn.onclick=()=>{const result=buyAquarium(state,slot,btn.dataset.purchaseHabitat);if(!result.ok){toast(result.reason);return}$('#modal').close();toast(`${result.aquarium.name} comprado!`);save();renderStoreHUD()})
}

function renderStoreHUD(){
  ensureStoreStats();$('#shopCredits').textContent=Math.floor(state.shopCredits);$('#coins').textContent=Math.floor(state.coins);$('#pearls').textContent=state.pearls;$('#level').textContent=state.level;$('#xpBar').style.width=`${Math.min(100,state.xp/(state.level*100)*100)}%`;$('#lumensResource').hidden=false;
  const pending=Math.floor(pendingRevenueTotal(state)),stats=state.storeStats,avg=stats.sales?Math.round(stats.revenue/stats.sales):0,avgSat=stats.sales?Math.round(stats.satisfactionTotal/stats.sales):0,q=storeQueue().length+(shopFx.activeService?1:0),stars='★'.repeat(reputationStars())+'☆'.repeat(5-reputationStars());
  $('#pendingRevenueText').textContent=pending?`¤ ${pending} aguardando coleta`:'Nenhuma receita aguardando';$('#collectRevenueBtn').disabled=pending<=0;
  const rep=$('#storeReputation'),vis=$('#storeVisitors'),ticket=$('#storeTicket'),queue=$('#storeQueue');if(rep)rep.textContent=`${stars} ${Math.round(state.storeReputation)}%`;if(vis)vis.textContent=`${stats.visitors} visitantes · ${stats.sales} vendas`;if(ticket)ticket.textContent=`¤ ${avg}${stats.sales?` · ${avgSat}% satisfação`:''}`;if(queue)queue.textContent=q?`${q} aguardando`:'Sem fila';
}

function refreshIncubatorButton(){
  const btn=$('#buyEggBtn');if(!btn||mode!=='aquarium')return;const tank=aq(),status=incubationStatus(state,tank.id),egg=EGGS[tank.habitat],duration=incubationSeconds(state,tank.habitat),key=status.active?`${tank.id}:${status.ready?'ready':status.remaining}`:`${tank.id}:idle:${duration}:${egg.price}`;if(btn.dataset.incubatorKey===key)return;btn.dataset.incubatorKey=key;btn.classList.toggle('incubator-active',status.active&&!status.ready);btn.classList.toggle('incubator-ready',status.ready);
  if(!status.active){btn.innerHTML=`${eggArt(tank.habitat)}<div><b>${egg.name}</b><small>Incubar por ~${duration}s</small></div><span>✦ ${egg.price}</span>`;return}if(status.ready){btn.innerHTML=`${eggArt(tank.habitat)}<div><b>Ovo pronto para nascer!</b><small>${egg.name} · clique para chocar</small></div><span>ABRIR</span>`;return}const m=Math.floor(status.remaining/60),s=String(status.remaining%60).padStart(2,'0');btn.innerHTML=`${eggArt(tank.habitat)}<div><b>Incubando ${egg.name}</b><small>Continua mesmo fora deste aquário</small></div><span>⏳ ${m}:${s}</span>`
}
function renderUI(){
  if(mode!=='aquarium')return;ensureDailyMissions();const tank=aq(),b=biome();$('#shopCredits').textContent=Math.floor(state.shopCredits);$('#coins').textContent=Math.floor(state.coins);$('#pearls').textContent=state.pearls;$('#level').textContent=state.level;$('#xpBar').style.width=`${Math.min(100,state.xp/(state.level*100)*100)}%`;$('#lumensResource').hidden=false;refreshIncubatorButton();$('#eggSpecies').textContent=eggPreview(tank.habitat);
  $('#biomeName').textContent=tank.name;$('#biomeEra').textContent=b.era;$('#biomeEffect').textContent=`${b.name} · ${b.bonus}`;$('#aquarium').style.setProperty('--accent',b.colors[2]);$('#biomeProgress').textContent=`#${tank.slot+1}`;
  const pending=Math.floor(tank.pendingRevenue||0);$('#biomeList').innerHTML=`<article class="aquarium-current" style="--aq:${b.colors[2]}"><div class="aq-heading"><span class="aq-dot"></span><div><b>${tank.name}</b><small>${b.name} · tanque físico independente</small></div></div><div class="aq-economies"><div><small>LÚMENS COMPARTILHADOS</small><b>✦ ${Math.floor(state.coins).toLocaleString('pt-BR')}</b></div><div><small>RECEITA NA LOJA</small><b>¤ ${pending}</b></div></div><button class="primary wide" id="panelBackStore">Voltar para a loja</button></article>`;
  $('#decorList').innerHTML=DECORS.map(d=>`<button class="decor ${tank.decor.includes(d.id)?'owned':''}" data-decor="${d.id}"><span style="color:${d.color}">${d.icon}</span><b>${d.name}</b><small>${tank.decor.includes(d.id)?'No aquário':`✦ ${d.price}`}</small></button>`).join('');
  const filtered=localCreatures().filter(c=>selectedFilter==='Todos'||c.species.rarity===selectedFilter);$('#creatureList').innerHTML=filtered.length?filtered.map(c=>`<button class="creature-row" data-creature="${c.uid}"><span class="mini-fish" style="--fish:${c.species.color}">◖</span><div><b>${c.species.name}${c.mutated?' ✧':''}</b><small class="row-stars">${qualityStars(c.quality)}</small><small>${c.stage} · G${c.lineage?.generation||1} · ${patternName(c.genome?.pattern)}</small></div><em style="color:${rarityColors[c.species.rarity]}">${c.species.rarity}</em></button>`).join(''):'<p class="empty">Nenhuma criatura neste aquário.</p>';
  $('#creatureCount').textContent=`${localCreatures().length}/${capacity()}`;$('#codexText').textContent=`${state.discovered.length} de ${SPECIES.length} espécies descobertas`;
  const ms=[{t:'Banquete coletivo',d:'Alimente 12 vezes',v:state.missions[0],goal:12,reward:90},{t:'Novos habitantes',d:'Choque 2 ovos',v:state.missions[1],goal:2,reward:2,pearl:true},{t:'Colheita luminosa',d:'Produza 18 recompensas automáticas',v:state.missions[2],goal:18,reward:150}];
  $('#missionList').innerHTML=ms.map((m,i)=>`<article class="mission"><span>${['●','◉','✦'][i]}</span><div><b>${m.t}</b><small>${m.d}</small><div class="progress"><i style="width:${Math.min(100,m.v/m.goal*100)}%"></i></div></div><button data-claim="${i}" ${m.v<m.goal||state.claimed[i]?'disabled':''}>${state.claimed[i]?'OK':`${m.pearl?'◈':'✦'} ${m.reward}`}</button></article>`).join('');const done=ms.filter((m,i)=>m.v>=m.goal&&!state.claimed[i]).length;$('#missionDot').style.display=done?'block':'none';$('#missionProgress').textContent=`${state.claimed.filter(Boolean).length}/3`;renderVitals();bindDynamic()
}
function renderVitals(){if(mode!=='aquarium')return;const mood=Math.round(averageMood(localCreatures()));$('#waterValue').textContent=`${Math.round(aq().water)}%`;$('#moodValue').textContent=`${mood}%`;$('#capacityValue').textContent=`${localCreatures().length}/${capacity()}`;$('#waterValue').classList.toggle('warning',aq().water<35);$('#moodValue').classList.toggle('warning',mood<40)}
function bindDynamic(){
  $('#panelBackStore')?.addEventListener('click',returnToStore);
  $$('.decor').forEach(el=>el.onclick=()=>{const d=DECORS.find(x=>x.id===el.dataset.decor);if(aq().decor.includes(d.id)){aq().decor=aq().decor.filter(x=>x!==d.id)}else if(state.coins>=d.price){state.coins-=d.price;aq().decor.push(d.id);gainXP(15);toast(`${d.name} adicionado`)}else toast('Lúmens compartilhados insuficientes');renderUI();save()});
  $$('[data-claim]').forEach(el=>el.onclick=()=>{const i=+el.dataset.claim,rewards=[90,2,150];if(i===1)state.pearls+=rewards[i];else state.coins+=rewards[i];state.claimed[i]=true;gainXP(20);toast('Recompensa coletada');renderUI();save()});
  $$('.creature-row').forEach(el=>el.onclick=()=>showCreature(creatures.find(c=>c.uid===el.dataset.creature)))
}

function refreshGrowthTimer(){const el=$('#adultTimer');if(!el||!$('#modal').open||!inspectedCreature)return;const c=inspectedCreature,tank=aquariumById(state,c.aquariumId);if(!tank)return;const g=growthEstimate(c,tank.water);el.textContent=g.adult?'Fase adulta alcançada':formatDuration(g.seconds);$('#adultProgress').value=g.percent;$('#adultProgressText').textContent=`${Math.floor(g.percent)}% do crescimento até adulto`;$('#growthStage').textContent=c.stage;$('#growthNeeds').textContent=`Saciedade ${Math.round(c.hunger)}% · Saúde ${Math.round(c.health)}%`;$('#sellFish').textContent=`Vender por ✦ ${salePrice(c)}`}
function showCreature(c){
  if(!c)return;inspectedCreature=c;const profile=profileSummary(c),parents=c.lineage?.parents||[],geneCards=[['TAMANHO',c.genome.size],['PRODUÇÃO',c.genome.productivity],['VELOCIDADE',c.genome.speed],['CRESCIMENTO',c.genome.growth],['VITALIDADE',c.genome.vitality]],targets=state.aquariums.filter(t=>t.id!==c.aquariumId);
  $('#modalBody').innerHTML=`<div class="modal-hero genetic-hero" style="--hero:${c.species.color};--hue:${c.genome.hue}deg"><span>◖</span><div class="hero-quality">${qualityStars(c.quality)}</div></div><small>${c.species.type} · ${c.species.rarity}${c.mutated?` · ${mutationName(c.mutationType)}`:''}</small><h2>${c.species.name}</h2><div class="identity-strip"><b>${profile.lineage}</b><span>Geração ${profile.generation}</span><span>${profile.pattern}</span><span>Score ${profile.score}</span></div><div class="creature-stats"><div><small>ESTÁGIO</small><b id="growthStage">${c.stage}</b></div><div><small>SACIEDADE</small><b>${Math.round(c.hunger)}%</b></div><div><small>HUMOR</small><b>${Math.round(c.happiness)}%</b></div><div><small>SAÚDE</small><b>${Math.round(c.health)}%</b></div></div><section class="gene-panel"><div class="gene-title"><span>GENOMA INDIVIDUAL</span><b>${qualityStars(c.quality)}</b></div>${geneCards.map(([label,value])=>`<div class="gene-row"><span>${label}</span><div><i style="width:${Math.min(100,Math.max(8,(value-.7)/.85*100))}%"></i></div><b>${genePercent(value)}</b></div>`).join('')}<small>Padrão de cor: <b>${profile.pattern}</b> · Variação cromática ${Math.round(c.genome.hue)}°</small>${c.mutated?`<small class="mutation-line">Mutação ${profile.mutation}</small>`:''}</section>${parents.length?`<section class="lineage-panel"><b>ANCESTRALIDADE</b>${parents.map(p=>`<span>${p.name} · ${qualityStars(p.quality)} · G${p.generation}</span>`).join('')}</section>`:''}<p>Produção automática: <b>+${productionInfo(c,productionMultiplier(state,c)).amount} lúmens</b>. Esta renda entra no saldo compartilhado de Lúmens.</p><section class="growth-timer"><span>Tempo estimado até adulto</span><strong id="adultTimer"></strong><progress id="adultProgress" max="100" value="0"></progress><span id="adultProgressText"></span><small id="growthNeeds"></small></section><button class="primary" id="focusCreature">Encontrar no aquário</button><button class="danger" id="sellFish">Vender por ✦ ${salePrice(c)}</button><div class="transfer-controls"><label for="transferTarget">Transferir para outro aquário da loja</label><select id="transferTarget">${targets.map(t=>`<option value="${t.id}">${t.name} · ${BIOMES.find(b=>b.id===t.habitat)?.name} (${residents(creatures,t.id).length}/${capacity()})</option>`).join('')}</select><button class="primary" id="transferBtn">Transferir</button><small>Ao transferir, o peixe muda de aquário, mas continua produzindo para o mesmo saldo compartilhado.</small></div>`;
  $('#modal').showModal();refreshGrowthTimer();
  $('#sellFish').onclick=()=>{const price=salePrice(c);$('#modalBody').innerHTML=`<h2>Vender ${c.species.name}?</h2><p>Você receberá <b>✦ ${price}</b> no saldo compartilhado de Lúmens. Créditos da loja continuam separados.</p><button class="primary" id="cancelSale">Cancelar</button><button class="danger" id="confirmSale">Confirmar venda</button>`;$('#cancelSale').onclick=()=>showCreature(c);$('#confirmSale').onclick=()=>{const oldId=c.aquariumId,sync=state.activeAquariumId;syncActiveAquarium(oldId);const earned=sellCreature(state,creatures,c.uid);syncActiveAquarium(sync);if(!earned)return;save();renderUI();$('#modal').close();toast(`Peixe vendido por ${earned} lúmens`)}};
  $('#transferBtn').disabled=!targets.length;$('#transferBtn').onclick=()=>{if(!transferCreature(state,creatures,c.uid,$('#transferTarget').value)){toast('Destino indisponível ou aquário cheio');return}save();renderUI();$('#modal').close();toast('Criatura transferida para outro aquário')};$('#focusCreature').onclick=()=>{$('#modal').close();burst(c.x,c.y,c.species.color)}
}

function showCodex(){openScreen('codex')}
function showOffline(seconds,earned,fossils=0){
  const pending=Math.floor(pendingRevenueTotal(state));$('#modalBody').innerHTML=`<small>RELATÓRIO OFFLINE</small><h2>A loja continuou funcionando</h2><div class="offline-orb">◉</div><p>Você ficou ausente por <b>${Math.floor(seconds/3600)}h ${Math.floor(seconds%3600/60)}min</b>. Cada aquário manteve sua própria produção de Lúmens e a loja recebeu visitantes.</p><div class="offline-reward">✦ +${earned} lúmens distribuídos${fossils?` · ◫ +${fossils} fósseis`:''}<br>¤ ${pending} créditos aguardando no caixa</div><button class="primary wide" id="offlineClose">Continuar</button>`;$('#modal').showModal();$('#offlineClose').onclick=()=>$('#modal').close()
}
function openScreen(name){if(name==='shop')$('#modalBody').innerHTML=shopScreen(state);if(name==='lab')$('#modalBody').innerHTML=labScreen(state,localCreatures());if(name==='expedition')$('#modalBody').innerHTML=expeditionScreen(state);if(name==='sanctuary')$('#modalBody').innerHTML=sanctuaryScreen(state);if(name==='codex')$('#modalBody').innerHTML=codexScreen(state);$('#modal').showModal();bindScreen(name)}
function bindScreen(name){
  $$('[data-buy]').forEach(el=>el.onclick=()=>{const source=SHOP.find(i=>i.id===el.dataset.buy);if(source.kind==='egg'){$('#modal').close();hatch();return}const item=source;if(state.coins<item.price){toast('Lúmens compartilhados insuficientes');return}state.coins-=item.price;if(item.kind==='food')dropFood(25,Math.max(5,localCreatures().length));if(item.kind==='boost')localCreatures().forEach(c=>c.age+=300);if(item.kind==='water')aq().water=100;save();renderUI();$('#modal').close();toast(`${item.name} utilizado`)})
  $$('[data-expedition]').forEach(el=>el.onclick=()=>{const ex=EXPEDITIONS.find(e=>e.id===el.dataset.expedition);state.expedition={id:ex.id,ends:Date.now()+ex.time*1000};save();$('#modal').close();toast('Equipe enviada para expedição')});
  if($('#claimExp'))$('#claimExp').onclick=()=>{const ex=EXPEDITIONS.find(e=>e.id===state.expedition.id);if(Date.now()<state.expedition.ends)return;state[ex.reward]+=ex.amount;state.expedition=null;gainXP(25);save();renderUI();$('#modal').close();toast(`${ex.amount} recursos encontrados`)};
  if($('#breedBtn'))$('#breedBtn').onclick=()=>{const ids=$$('input[name="parent"]:checked').map(x=>x.value);if(ids.length!==2){toast('Escolha exatamente duas criaturas');return}if(state.dna<4||localCreatures().length>=capacity()){toast('Verifique o DNA e a capacidade do aquário');return}const [a,b]=ids.map(id=>creatures.find(c=>c.uid===id));state.dna-=4;const child=Math.random()<.5?a.species:b.species,chance=breedChance(a,b,geneticsBonus(state)+(aq().habitat==='mutant'?.08:0)),genetics=breedGeneticProfile(a,b,chance),baby=addCreature(child,false,aq().id,true,genetics);$('#modal').close();toast(baby.mutated?`Nasceu ${qualityStars(baby.quality)} com mutação ${mutationName(baby.mutationType)}!`:`Nova linhagem G${baby.lineage.generation} · ${qualityStars(baby.quality)}`,baby.species.rarity);burst(baby.x,baby.y,baby.species.color);save();renderUI()}
  $$('[data-upgrade]').forEach(el=>el.onclick=()=>{const result=buyUpgrade(state,el.dataset.upgrade);if(!result.ok){toast(result.reason);return}gainXP(25);save();renderUI();$('#modalBody').innerHTML=sanctuaryScreen(state);bindScreen('sanctuary');toast(`${result.upgrade.name} agora está no nível ${result.level}`)})
}
function startEvent(){if(mode!=='aquarium')return;event={left:30,claimed:false};$('#eventCard').hidden=false;const timer=setInterval(()=>{if(mode!=='aquarium'||!event){clearInterval(timer);return}event.left--;$('#eventTime').textContent=`0:${String(event.left).padStart(2,'0')}`;if(event.left<=0){clearInterval(timer);event=null;$('#eventCard').hidden=true}},1000)}

function loop(now){const dt=Math.min(50,now-last);last=now;if(mode!=='start')updateSharedEconomy(dt);if(mode==='aquarium'){updateAquarium(dt);drawAquarium();if(now-lastTimerRefresh>250){refreshGrowthTimer();refreshIncubatorButton();lastTimerRefresh=now}}else if(mode==='store'){updateStoreBackground(dt);updateStorePlayer(dt);updateNpcs(dt);drawStore()}requestAnimationFrame(loop)}

$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.tab-content').forEach(x=>x.classList.remove('active'));t.classList.add('active');$(`#tab-${t.dataset.tab}`).classList.add('active')});
$('#feedBtn').onclick=feed;$('#buyEggBtn').onclick=hatch;$('#codexBtn').onclick=showCodex;$('#modalClose').onclick=()=>$('#modal').close();$('#backToStoreBtn').onclick=returnToStore;
$('#soundBtn').onclick=()=>{state.sound=!state.sound;$('#soundBtn').classList.toggle('muted',!state.sound);toast(state.sound?'Som ativado':'Som desativado');save()};
$('#settingsBtn').onclick=()=>{$('#modalBody').innerHTML=`<small>PAINEL DO GUARDIÃO</small><h2>Sua galeria</h2><div class="resource-strip"><b>¤ ${Math.floor(state.shopCredits)} créditos</b><b>⬡ ${state.dna} DNA</b><b>◫ ${state.fossils} fósseis</b><b>◆ ${state.essence} essência</b></div><p>Existem duas economias: Créditos da Loja vêm dos clientes; Lúmens são compartilhados por todos os tanques, mas cada habitat possui preços próprios.</p><div class="settings-actions"><button class="primary" id="exportSave">Baixar backup</button><button class="primary" id="importSave">Importar backup</button><input id="importFile" type="file" accept="application/json,.json" hidden><button class="danger wide" id="resetGame">Reiniciar progresso</button></div>`;$('#modal').showModal();$('#exportSave').onclick=()=>{state.creatures=creatures.map(c=>c.serialize());const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Abyss-Garden-v2.15.1-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};$('#importSave').onclick=()=>$('#importFile').click();$('#importFile').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;const result=SaveManager.importData(await file.text(),defaults);if(!result.ok){toast(result.error);return}location.reload()};$('#resetGame').onclick=()=>{if(confirm('Reiniciar todo o progresso?')){SaveManager.reset();location.reload()}}};
$('#eventCard').onclick=()=>{if(!event||event.claimed)return;event.claimed=true;$('#eventCard').hidden=true;state.coins+=35;state.pearls++;gainXP(10);burst(dims().w*.5,dims().h*.35,'#fff29a');toast('Fragmento estelar coletado!');renderUI()};
$('#collectRevenueBtn').onclick=()=>{const amount=collectVisitorRevenue(state);if(!amount){toast('Ainda não há receita para coletar');return}toast(`¤ ${amount} créditos coletados no caixa`);renderStoreHUD();save()};
['Todos','Comum','Raro','Épico','Lendário'].forEach(r=>{const b=document.createElement('button');b.textContent=r;b.className=r==='Todos'?'active':'';b.onclick=()=>{selectedFilter=r;$$('#rarityFilters button').forEach(x=>x.classList.toggle('active',x===b));renderUI()};$('#rarityFilters').append(b)});
canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,c=[...localCreatures()].reverse().find(c=>c.contains(x,y));if(c)showCreature(c);else{particles.push({x,y,vx:0,vy:-.2,life:.7,color:'#fff'});localCreatures().forEach(c=>{if(Math.hypot(c.x-x,c.y-y)<140){c.vx+=(c.x-x)*.002;c.vy+=(c.y-y)*.002}})}});
storeCanvas.addEventListener('pointerdown',e=>{const r=storeCanvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,slot=storeSlotRects().find(s=>x>=s.x-8&&x<=s.x+s.w+8&&y>=s.y-12&&y<=s.y+s.h+52);if(slot){const tank=aquariumAtSlot(slot.slot);if(tank)enterAquarium(tank.id);else openPurchase(slot.slot);return}player.target={x,y}});
window.addEventListener('keydown',e=>{if($('#modal').open)return;if(mode==='aquarium'&&e.code==='Space'&&!e.repeat&&!['INPUT','SELECT','TEXTAREA','BUTTON'].includes(e.target.tagName)){e.preventDefault();feed();return}if(mode==='store'){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){moveKeys.add(e.code);e.preventDefault()}if(e.code==='KeyE'&&!e.repeat){interactNearest();e.preventDefault()}}});
window.addEventListener('keyup',e=>moveKeys.delete(e.code));window.addEventListener('resize',()=>{resizeStore();resizeAquarium()});window.addEventListener('beforeunload',save);
$$('[data-move]').forEach(btn=>{const key=btn.dataset.move;const down=e=>{e.preventDefault();moveKeys.add(key)},up=e=>{e.preventDefault();moveKeys.delete(key)};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up)});$('#interactBtn').onclick=interactNearest;
$('#continueBtn').onclick=()=>{$('#startScreen').classList.add('leaving');setTimeout(()=>{$('#startScreen').hidden=true;mode='store';storeBackgroundAccumulator=0;storeEconomyAccumulator=0;$('#storeView').hidden=false;$('#aquariumView').hidden=true;releaseAquariumSprites();resizeStore();renderStoreHUD();shopFx.spawnCd=1200;if(offlineReport){const r=offlineReport;offlineReport=null;showOffline(r.seconds,r.earned,r.fossils)}},650)};
$$('[data-screen]').forEach(b=>b.onclick=()=>openScreen(b.dataset.screen));

load();requestAnimationFrame(loop);
