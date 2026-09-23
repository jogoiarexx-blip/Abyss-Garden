const KEY='abyss-garden-save-v5';
const LEGACY_KEYS=['abyss-garden-save-v4','abyss-garden-save-v3','abyss-garden-save-v2','abyss-garden-save-v1'];
const SAVE_VERSION=10;

function validSave(parsed){return parsed&&Array.isArray(parsed.creatures)&&(Number.isFinite(parsed.coins)||Array.isArray(parsed.aquariums)||Number.isFinite(parsed.shopCredits))}

export class SaveManager{
  static load(defaults){
    try{
      for(const key of [KEY,KEY+'-backup',...LEGACY_KEYS]){
        try{
          const raw=localStorage.getItem(key);if(!raw)continue;
          const parsed=JSON.parse(raw);if(!validSave(parsed))continue;
          return {...structuredClone(defaults),...parsed,version:SAVE_VERSION};
        }catch{}
      }
      return structuredClone(defaults);
    }catch{return structuredClone(defaults)}
  }
  static save(state,creatures){
    state.creatures=creatures.map(c=>c.serialize());state.lastSave=Date.now();state.version=SAVE_VERSION;
    try{
      const previous=localStorage.getItem(KEY);if(previous){try{JSON.parse(previous);localStorage.setItem(KEY+'-backup',previous)}catch{}}
      localStorage.setItem(KEY,JSON.stringify(state));return true;
    }catch{return false}
  }
  static importData(text,defaults){
    try{
      const parsed=JSON.parse(text);if(!validSave(parsed))return {ok:false,error:'Backup inválido ou incompatível.'};
      const merged={...structuredClone(defaults),...parsed,version:SAVE_VERSION,lastSave:Date.now()};
      localStorage.setItem(KEY,JSON.stringify(merged));
      return {ok:true};
    }catch{return {ok:false,error:'Não foi possível ler o arquivo de backup.'}}
  }
  static offline(lastSave,maxHours=12){return Math.min(maxHours*3600,Math.max(0,(Date.now()-(lastSave||Date.now()))/1000))}
  static reset(){localStorage.removeItem(KEY+'-backup');localStorage.removeItem(KEY);for(const key of LEGACY_KEYS)localStorage.removeItem(key)}
}
