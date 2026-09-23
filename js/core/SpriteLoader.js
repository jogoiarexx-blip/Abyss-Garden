const SOURCES={
  astral:'assets/atlas-astral.webp',
  jurassic:'assets/atlas-jurassic.webp',
  abyss:'assets/atlas-abyss.webp',
  mutant:'assets/atlas-mutant.webp'
};
let activeHabitat=null;
const cache=new Map();
const loading=new Map();

function loadImage(src,onProgress,start=0,end=100){
  return new Promise((resolve,reject)=>{
    const img=new Image();img.decoding='async';
    onProgress?.(start);
    img.onload=async()=>{try{if(img.decode)await img.decode()}catch{}onProgress?.(end);resolve(img)};
    img.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));
    img.src=src;
  });
}

export async function loadAquariumSprites(habitat,onProgress=()=>{}){
  if(!SOURCES[habitat])throw new Error('Habitat sem sprites.');
  if(cache.has(habitat)){activeHabitat=habitat;onProgress(100);return cache.get(habitat)}
  if(loading.has(habitat))return loading.get(habitat);
  releaseAquariumSprites();
  activeHabitat=habitat;
  const promise=loadImage(SOURCES[habitat],onProgress,8,92).then(img=>{cache.set(habitat,img);loading.delete(habitat);onProgress(100);return img}).catch(err=>{loading.delete(habitat);throw err});
  loading.set(habitat,promise);return promise;
}
export function getAquariumAtlas(habitat){return cache.get(habitat)||null;}
export function releaseAquariumSprites(){for(const key of [...cache.keys()])cache.delete(key);activeHabitat=null;}
export function loadedHabitat(){return activeHabitat;}
