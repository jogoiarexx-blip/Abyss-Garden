import {rollEgg} from './systems/EggSystem.js';
import {SPECIES} from './data.js';
import {createGeneticProfile} from './systems/GeneticsSystem.js';
import {getAquariumAtlas} from './core/SpriteLoader.js';

export class Creature {
  constructor(data, canvas, restored={}) {
    this.habitat=restored.habitat??'astral';this.aquariumId=restored.aquariumId??null;this.uid=restored.uid || (globalThis.crypto?.randomUUID?.()||`fish-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`); this.species=data;
    this.x=restored.x ?? 80+Math.random()*(canvas.width-160); this.y=restored.y ?? 120+Math.random()*(canvas.height-250);
    this.vx=restored.vx ?? (Math.random()>.5?1:-1)*(0.25+Math.random()*.4); this.vy=restored.vy??(Math.random()-.5)*.18;
    this.production=restored.production ?? 0;this.animation='swim';this.animationTime=0;
    this.age=restored.age ?? 0; this.hunger=restored.hunger ?? 80; this.ready=restored.ready ?? false;
    this.happiness=restored.happiness ?? 85;this.energy=restored.energy??100;this.health=restored.health??100;
    const genetics=createGeneticProfile(data,restored);
    this.quality=genetics.quality;this.genome=genetics.genome;this.lineage=genetics.lineage;this.mutationType=genetics.mutationType;
    this.mutated=restored.mutated ?? Boolean(this.mutationType);this.gene=restored.gene??Math.floor(Math.random()*5); this.bob=Math.random()*Math.PI*2; this.canvas=canvas;
  }
  get stage(){return this.age>=21600?'Ancião':this.age>=3600?'Adulto':this.age>=600?'Jovem':'Filhote'}
  get scale(){
    const index=['Filhote','Jovem','Adulto','Ancião'].indexOf(this.stage),base=[.55,.73,.92,1.12][index],blend=[.32,.55,.82,1][index];
    const genetic=this.genome?.size??1;return base*(1+(genetic-1)*blend);
  }
  update(dt, speed=1){
    this.justEvolved=false;
    this.animationTime=Math.max(0,this.animationTime-dt);if(!this.animationTime)this.animation='swim';
    const previousStage=this.stage;
    const nourished=this.hunger>35&&this.health>50,growthGene=this.genome?.growth??1,vitality=this.genome?.vitality??1;
    this.age+=dt/1000*speed*growthGene*(nourished?1:.35); this.hunger=Math.max(0,this.hunger-dt/180000);
    this.happiness=Math.max(10,Math.min(100,this.happiness+(this.hunger>40?.002:-.008)*dt));
    this.health=Math.max(10,Math.min(100,this.health+(this.hunger>15?.0005* vitality:-.003/Math.max(.75,vitality))*dt)); this.bob+=dt*.002;
    const motion=this.genome?.speed??1;
    this.x+=this.vx*dt*.06*motion; this.y+=this.vy*dt*.06*motion+Math.sin(this.bob)*.06;
    const m=55*this.scale; if(this.x<m||this.x>this.canvas.width-m){this.vx*=-1;this.x=Math.max(m,Math.min(this.canvas.width-m,this.x))}
    if(this.y<105||this.y>this.canvas.height-105){this.vy*=-1;this.y=Math.max(105,Math.min(this.canvas.height-105,this.y))}
    if(previousStage!==this.stage){this.animation='evolve';this.animationTime=2500;this.justEvolved=true;}
  }
  drawGeneticPattern(ctx,size){
    const pattern=this.genome?.pattern||'natural';if(pattern==='natural')return;
    ctx.save();ctx.globalAlpha=.28;ctx.lineWidth=2.2;ctx.strokeStyle=this.mutated?'#eaff73':this.species.accent;ctx.fillStyle=this.species.accent;
    if(pattern==='stripes')for(let x=-size*.25;x<size*.3;x+=12){ctx.beginPath();ctx.moveTo(x,-size*.18);ctx.lineTo(x+9,size*.18);ctx.stroke()}
    if(pattern==='aurora'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(i*9,0,size*.18+i*2,0,Math.PI*2);ctx.stroke()}}
    if(pattern==='pearlescent')for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*size*.18,Math.sin(a)*size*.1,2.3,0,Math.PI*2);ctx.fill()}
    if(pattern==='shadow'){ctx.globalAlpha=.22;ctx.fillStyle='#03040c';ctx.beginPath();ctx.ellipse(0,0,size*.34,size*.19,0,0,Math.PI*2);ctx.fill()}
    if(pattern==='prismatic'){for(let i=0;i<5;i++){ctx.strokeStyle=`hsl(${(i*72+(this.genome?.hue||0))%360} 90% 70%)`;ctx.beginPath();ctx.arc(0,0,size*(.12+i*.035),Math.PI*.15,Math.PI*1.45);ctx.stroke()}}
    ctx.restore();
  }
  drawMutationAura(ctx,size){
    if(!this.mutated)return;const t=this.mutationType||'luminous',time=this.bob;
    ctx.save();ctx.globalAlpha=.52;ctx.lineWidth=1.5;
    const color={luminous:'#f6ff9c',giant:'#ffc86f',swift:'#72e9ff',resilient:'#8fff91',prismatic:'#ff8dff',shadow:'#9774ff'}[t]||'#dfff43';
    ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=12;
    if(t==='giant'||t==='resilient'){ctx.beginPath();ctx.arc(0,0,size*.43+Math.sin(time)*2,0,Math.PI*2);ctx.stroke()}
    else for(let i=0;i<3;i++){const a=time+i*Math.PI*2/3;ctx.beginPath();ctx.arc(Math.cos(a)*size*.43,Math.sin(a)*size*.27,2.2+i*.4,0,Math.PI*2);ctx.stroke()}
    ctx.restore();
  }
  draw(ctx){
    const s=this.scale, dir=Math.sign(this.vx)||1, c=this.species.color, a=this.mutated?'#dfff43':this.species.accent;
    ctx.save();ctx.translate(this.x,this.y);ctx.scale(dir*s,s);const pulse=Math.sin(this.bob);ctx.rotate(pulse*.035);ctx.scale(1+pulse*.025,1-pulse*.035);if(this.animation==='eat'){const bite=Math.sin(this.animationTime*.025);ctx.scale(1+Math.abs(bite)*.12,1-Math.abs(bite)*.08)};if(this.animation==='evolve'){ctx.shadowColor='#fff8b0';ctx.shadowBlur=28;}ctx.shadowColor=a;ctx.shadowBlur=this.mutated?18:8;
    const atlas=getAquariumAtlas(this.species.sheet);
    const atlasIndex=Number.isFinite(this.species.frame)?this.species.frame:SPECIES.findIndex(s=>s.id===this.species.id)%6;
    if(atlas?.complete&&atlas.naturalWidth&&atlasIndex>=0){
      const cols=3,rows=2,cw=atlas.naturalWidth/cols,ch=atlas.naturalHeight/rows,col=atlasIndex%cols,row=Math.floor(atlasIndex/cols),size=100;
      const hue=(this.genome?.hue||0)+(this.mutationType==='prismatic'?40:0),sat=this.genome?.saturation||1,bright=this.mutationType==='shadow'?.76:1;
      ctx.filter=`hue-rotate(${hue}deg) saturate(${sat}) brightness(${bright})`;
      ctx.drawImage(atlas,col*cw,row*ch,cw,ch,-size/2,-size/2,size,size*.75);ctx.filter='none';ctx.shadowBlur=0;
      this.drawGeneticPattern(ctx,size);this.drawMutationAura(ctx,size);
      if(this.ready){ctx.fillStyle='#ffd773';ctx.beginPath();ctx.arc(0,-38,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14242a';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('✦',0,-35)}
      ctx.restore();return;
    }
    const sh=this.species.shape;
    if(sh==='jelly'){
      ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,-3,25,Math.PI,0);ctx.quadraticCurveTo(20,18,0,14);ctx.quadraticCurveTo(-20,18,-25,-3);ctx.fill();
      ctx.strokeStyle=a;ctx.lineWidth=3;for(let i=-15;i<=15;i+=10){ctx.beginPath();ctx.moveTo(i,12);ctx.quadraticCurveTo(i+8,25,i,37);ctx.stroke()}
    } else if(sh==='ray'){
      ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-35,0);ctx.quadraticCurveTo(0,-30,35,0);ctx.quadraticCurveTo(0,22,-35,0);ctx.fill();ctx.strokeStyle=a;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-30,0);ctx.quadraticCurveTo(-55,10,-65,3);ctx.stroke();
    } else if(sh==='serpent'){
      ctx.strokeStyle=c;ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-32,9);ctx.bezierCurveTo(-12,-18,12,22,35,-4);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(34,-5,20,14,0,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,34,19,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-28,0);ctx.lineTo(-50,-20);ctx.lineTo(-48,20);ctx.closePath();ctx.fill();
      if(sh==='ancient'){ctx.strokeStyle=a;ctx.lineWidth=4;for(let i=-18;i<22;i+=12){ctx.beginPath();ctx.moveTo(i,-14);ctx.lineTo(i+4,14);ctx.stroke()}}
    }
    ctx.shadowBlur=0;ctx.fillStyle=a;ctx.beginPath();ctx.arc(18,-5,3.5,0,Math.PI*2);ctx.fill();
    this.drawGeneticPattern(ctx,92);this.drawMutationAura(ctx,92);
    if(this.ready){ctx.fillStyle='#ffd773';ctx.beginPath();ctx.arc(0,-32,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#14242a';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('✦',0,-29)}
    ctx.restore();
  }
  contains(x,y){return Math.hypot(x-this.x,y-this.y)<48*this.scale}
  serialize(){return {habitat:this.habitat,aquariumId:this.aquariumId,uid:this.uid,id:this.species.id,x:this.x,y:this.y,vx:this.vx,vy:this.vy,age:this.age,hunger:this.hunger,happiness:this.happiness,energy:this.energy,health:this.health,ready:this.ready,production:this.production,mutated:this.mutated,mutationType:this.mutationType,quality:this.quality,genome:this.genome,lineage:this.lineage,gene:this.gene}}
}

export function hatchSpecies(level,biome){return rollEgg(biome)}
