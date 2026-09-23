export function growthEstimate(c,water=100){
  const genetics=c.genome?.growth??1;
  const rate=(c.habitat==='astral'?1.1:1)*(water>35?1:.5)*(c.hunger>35&&c.health>50?1:.35)*genetics;
  const adult=c.age>=3600;
  return {adult,seconds:Math.max(0,3600-c.age)/rate,percent:Math.min(100,Math.max(0,c.age/3600*100)),rate};
}
export function formatDuration(seconds){
  const n=Math.max(0,Math.ceil(seconds));return [Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(v=>String(v).padStart(2,'0')).join(':');
}
