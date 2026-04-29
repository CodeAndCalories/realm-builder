// TODO: BUILDINGS array and build card rendering
const BUILDINGS = [
  // HOUSING
  {id:'tent',      name:'Tent',           icon:'⛺',cat:'housing',color:'#c8a060',
   desc:'Shelters 2 settlers.',prod:{popCap:2},cost:{gold:5},canBuild:()=>true,max:999},
  {id:'cottage',   name:'Cottage',        icon:'🏠',cat:'housing',color:'#dd9955',
   desc:'Home for 5 citizens.',prod:{popCap:5,happiness:1},cost:{gold:20,wood:8},canBuild:()=>G.b.tent>=2,max:999},
  {id:'house',     name:'Stone House',    icon:'🏡',cat:'housing',color:'#aabbcc',
   desc:'Sturdy home for 10.',prod:{popCap:10,happiness:2},cost:{gold:50,wood:10,stone:8},canBuild:()=>G.b.cottage>=3,max:999},
  {id:'manor',     name:'Manor',          icon:'🏰',cat:'housing',color:'#cc9944',
   desc:'25 capacity, earns rent.',prod:{popCap:25,happiness:4,gold:2},cost:{gold:130,wood:20,stone:25},canBuild:()=>G.b.house>=4,max:50},
  // RESOURCE
  {id:'woodcutter',name:'Woodcutter',     icon:'🪓',cat:'resource',color:'#996633',
   desc:'No wood needed to build! +2 wood/tick.',prod:{wood:2},cost:{gold:10},canBuild:()=>true,max:999},
  {id:'farm',      name:'Farm',           icon:'🌾',cat:'resource',color:'#88bb44',
   desc:'Produces 3 food/tick.',prod:{food:3},cost:{gold:20,wood:5},canBuild:()=>true,max:999},
  {id:'lumbermill',name:'Lumber Mill',    icon:'🪚',cat:'resource',color:'#aa7733',
   desc:'+6 wood/tick. Upgrade from Woodcutter.',prod:{wood:6},cost:{gold:45,wood:10},canBuild:()=>G.b.woodcutter>=2,max:999},
  {id:'orchard',   name:'Orchard',        icon:'🍎',cat:'resource',color:'#ee7744',
   desc:'+3 food, +2 happiness.',prod:{food:3,happiness:2},cost:{gold:35,wood:8},canBuild:()=>G.b.farm>=2,max:20},
  {id:'quarry',    name:'Quarry',         icon:'⛏️',cat:'resource',color:'#8899aa',
   desc:'+3 stone/tick.',prod:{stone:3},cost:{gold:35,wood:8},canBuild:()=>G.b.woodcutter>=3||G.b.lumbermill>=1,max:999},
  {id:'mill',      name:'Windmill',       icon:'🌀',cat:'resource',color:'#ddcc88',
   desc:'+5 food, +1 gold/tick.',prod:{food:5,gold:1},cost:{gold:55,wood:15,stone:5},canBuild:()=>G.b.farm>=3,max:30},
  // INDUSTRY
  {id:'mine',      name:'Gold Mine',      icon:'🥇',cat:'industry',color:'#ffcc44',
   desc:'+5 gold/tick.',prod:{gold:5},cost:{gold:70,wood:15,stone:12},canBuild:()=>G.b.quarry>=2,max:30},
  {id:'market',    name:'Market',         icon:'🏪',cat:'industry',color:'#ee8833',
   desc:'+8 gold, +3 happiness.',prod:{gold:8,happiness:3},cost:{gold:90,wood:20,stone:10},canBuild:()=>G.b.cottage>=5,max:20},
  {id:'forge',     name:'Blacksmith',     icon:'⚒️',cat:'industry',color:'#cc5533',
   desc:'+3 gold/tick.',prod:{gold:3},cost:{gold:75,wood:10,stone:20},canBuild:()=>G.b.quarry>=1,max:10},
  {id:'warehouse', name:'Warehouse',      icon:'🏗️',cat:'industry',color:'#99aabb',
   desc:'Doubles all resource caps.',prod:{capBonus:1},cost:{gold:110,wood:30,stone:20},canBuild:()=>G.b.market>=1,max:10},
  {id:'tradingpost',name:'Trading Post',  icon:'🚢',cat:'industry',color:'#44aacc',
   desc:'+5 gold, +15% sell price.',prod:{gold:5,tradeBonus:0.15},cost:{gold:120,wood:25,stone:15},canBuild:()=>G.b.market>=2,max:5},
  // CIVIC
  {id:'well',      name:'Town Well',      icon:'🪣',cat:'civic',color:'#4488ff',
   desc:'+5 happiness.',prod:{happiness:5},cost:{gold:30,stone:8},canBuild:()=>true,max:10},
  {id:'tavern',    name:'Tavern',         icon:'🍺',cat:'civic',color:'#cc8833',
   desc:'+10 happiness, +2 gold.',prod:{happiness:10,gold:2},cost:{gold:65,wood:20},canBuild:()=>G.b.cottage>=3,max:15},
  {id:'temple',    name:'Temple',         icon:'⛩️',cat:'civic',color:'#cc99ff',
   desc:'+15 happiness, prestige.',prod:{happiness:15,prestige:1},cost:{gold:160,wood:20,stone:30},canBuild:()=>G.b.house>=3,max:10},
  {id:'academy',   name:'Academy',        icon:'🎓',cat:'civic',color:'#44aaee',
   desc:'+10% all production.',prod:{productionBonus:0.1},cost:{gold:220,wood:30,stone:30},canBuild:()=>G.b.temple>=1,max:5},
  {id:'castle',    name:'Castle',         icon:'🏯',cat:'civic',color:'#ddbb66',
   desc:'+20 pop, +20 happiness, defends from bandits.',prod:{popCap:20,happiness:20,prestige:5},cost:{gold:500,wood:50,stone:100},canBuild:()=>G.b.manor>=2,max:3},
];

function canAfford(bd){
  const c=bd.cost;
  return (!c.gold||G.res.gold>=c.gold)&&(!c.wood||G.res.wood>=c.wood)&&(!c.stone||G.res.stone>=c.stone);
}
function prodText(p){
  const pts=[];
  if(p.popCap)          pts.push(`+${p.popCap} pop`);
  if(p.food)            pts.push(`+${p.food} food`);
  if(p.wood)            pts.push(`+${p.wood} wood`);
  if(p.stone)           pts.push(`+${p.stone} stone`);
  if(p.gold)            pts.push(`+${p.gold} gold`);
  if(p.happiness)       pts.push(`+${p.happiness} 😊`);
  if(p.prestige)        pts.push(`+${p.prestige}⭐`);
  if(p.productionBonus) pts.push(`+${p.productionBonus*100}% all`);
  if(p.capBonus)        pts.push('2× storage');
  if(p.tradeBonus)      pts.push(`+${Math.round(p.tradeBonus*100)}% sell`);
  return pts.join(' · ')||'—';
}
function renderBuildCards(){
  const cats={housing:[],resource:[],industry:[],civic:[]};
  BUILDINGS.forEach(b=>cats[b.cat].push(b));
  for(const [cat,list] of Object.entries(cats)){
    const grid=document.getElementById('grid-'+cat); if(!grid) continue;
    grid.innerHTML=list.map(b=>{
      const count=G.b[b.id]||0, unlocked=b.canBuild(), atMax=count>=b.max, disabled=!unlocked||atMax;
      const costHtml=Object.entries(b.cost).map(([res,amt])=>{
        const icons={gold:'🪙',wood:'🪵',stone:'🪨'};
        const have=res==='gold'?G.res.gold:res==='wood'?G.res.wood:G.res.stone;
        return `<span class="cost-tag${have<amt?' cant':''}">${icons[res]}${amt}</span>`;
      }).join('');
      return `<div class="bld-card${disabled?' disabled':''}" style="--card-color:${b.color}"
                   onclick="${disabled?'':'buildBuilding(\''+b.id+'\')'}">
        ${count>0?`<div class="bld-count">${count}</div>`:''}
        <span class="bld-icon">${b.icon}</span>
        <div class="bld-name">${b.name}</div>
        <div class="bld-desc">${b.desc}</div>
        <div class="bld-prod">${prodText(b.prod)}</div>
        <div class="bld-cost">${unlocked?costHtml:`<span style="font-size:8px;color:var(--text-dim);font-style:italic">🔒 Locked</span>`}</div>
      </div>`;
    }).join('');
  }
}
function buildBuilding(id){
  const b=BUILDINGS.find(x=>x.id===id);
  if(!b||!b.canBuild()||!canAfford(b)||(G.b[id]||0)>=b.max) return;
  Object.entries(b.cost).forEach(([res,amt])=>{
    if(res==='gold') G.res.gold-=amt;
    if(res==='wood') G.res.wood-=amt;
    if(res==='stone') G.res.stone-=amt;
  });
  G.b[id]=(G.b[id]||0)+1;
  addLog(`Built ${b.icon} ${b.name}`,'good');
  toast(`Built ${b.name}!`);
  updateUI(); renderCity();
}
