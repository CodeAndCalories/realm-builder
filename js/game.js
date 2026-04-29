// TODO: G state object, gameTick(), calcStats(), setSpeed()
// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
function freshState(){
  const b={};
  BUILDINGS.forEach(bd=>b[bd.id]=0);
  return {res:{gold:50,population:5,food:20,wood:30,stone:0,happiness:70},
          b,prestige:0,tick:0,year:1,speed:1,activeEvents:[],log:[],bonusGold:0,popCap:10};
}
let G=freshState();
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const fmt=n=>n>=10000?Math.floor(n/100)/10+'k':n>=1000?(Math.floor(n/100)/10)+'k':Math.round(n);

// ══════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════
function calcStats(){
  let popCap=10,foodProd=0,woodProd=0,stoneProd=0,goldProd=0,happBase=50,prodMult=1,warehouseMult=1,tradeBonus=0;
  BUILDINGS.forEach(bd=>{
    const cnt=G.b[bd.id]||0; if(!cnt) return; const p=bd.prod;
    if(p.popCap)          popCap    +=p.popCap*cnt;
    if(p.food)            foodProd  +=p.food*cnt;
    if(p.wood)            woodProd  +=p.wood*cnt;
    if(p.stone)           stoneProd +=p.stone*cnt;
    if(p.gold)            goldProd  +=p.gold*cnt;
    if(p.happiness)       happBase  +=p.happiness*cnt;
    if(p.productionBonus) prodMult  +=p.productionBonus*cnt;
    if(p.capBonus)        warehouseMult+=p.capBonus*cnt;
    if(p.tradeBonus)      tradeBonus+=p.tradeBonus*cnt;
  });
  goldProd+=G.bonusGold;
  const taxGold=Math.floor(G.res.population/5);
  goldProd+=taxGold;
  const presBonus=1+G.prestige*.1;
  foodProd =Math.round(foodProd *prodMult*presBonus);
  woodProd =Math.round(woodProd *prodMult*presBonus);
  stoneProd=Math.round(stoneProd*prodMult*presBonus);
  goldProd =Math.round(goldProd *prodMult*presBonus);
  const foodConsume=Math.ceil(G.res.population/3);
  const foodNet=foodProd-foodConsume;
  const maxFood=100*warehouseMult,maxWood=200*warehouseMult,maxStone=200*warehouseMult;
  let popGrowth=0;
  if(G.res.food>10&&G.res.population<popCap&&G.res.happiness>=45&&G.tick%20===0&&G.tick>0)
    popGrowth=Math.max(1,Math.floor(G.res.happiness/25));
  return {popCap,foodProd,foodConsume,foodNet,woodProd,stoneProd,goldProd,happBase,
          maxFood,maxWood,maxStone,popGrowth,prodMult,presBonus,taxGold,tradeBonus};
}

// ══════════════════════════════════════════════
// TICK
// ══════════════════════════════════════════════
let tickInterval=null;
function gameTick(){
  G.tick++;
  if(G.tick%10===0) G.year=Math.floor(G.tick/10)+1;
  const s=calcStats();
  G.popCap=s.popCap;
  G.res.gold =Math.min(G.res.gold +s.goldProd, 999999);
  G.res.food =Math.min(G.res.food +s.foodNet,  s.maxFood);
  G.res.wood =Math.min(G.res.wood +s.woodProd, s.maxWood);
  G.res.stone=Math.min(G.res.stone+s.stoneProd,s.maxStone);
  if(G.res.food<=0){
    G.res.food=0;
    G.res.happiness=Math.max(0,G.res.happiness-3);
    if(G.tick%8===0){G.res.population=Math.max(5,G.res.population-1);addLog('⚠ Famine! Citizens are dying. Build Farms!','bad');}
  }
  const happTarget=Math.min(100,s.happBase);
  G.res.happiness+=(happTarget-G.res.happiness)*.05;
  G.res.happiness=Math.max(0,Math.min(100,Math.round(G.res.happiness)));
  if(s.popGrowth&&G.res.population<s.popCap){
    G.res.population=Math.min(s.popCap,G.res.population+s.popGrowth);
    if(G.tick%40===0) addLog(`Population grows to ${G.res.population}.`,'good');
  }
  if(G.res.population>s.popCap) G.res.population=s.popCap;
  if(G.activeEvents.length===0&&G.tick>15){
    EVENT_POOL.forEach(ev=>{
      if(!G.activeEvents.find(a=>a.id===ev.id)&&ev.trigger(G)){
        G.activeEvents.push({...ev});
        addLog(`⚡ Event: ${ev.title}`,'event');
        toast('📜 New Event! Check Events tab');
      }
    });
  }
  updateUI(s); renderCity();
}

function setSpeed(s){
  G.speed=s; clearInterval(tickInterval);
  ['spd0','spd1','spd3'].forEach(id=>document.getElementById(id).classList.remove('active'));
  if(s===0){document.getElementById('spd0').classList.add('active');return;}
  document.getElementById(s===1?'spd1':'spd3').classList.add('active');
  tickInterval=setInterval(gameTick,s===1?1200:400);
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
window.addEventListener('resize',()=>{resizeCanvas();renderCity();});
resizeCanvas(); renderBuildCards(); updateUI(); renderCity();
addLog('Your realm begins. Build a 🪓 Woodcutter first — costs gold only!','good');
addLog('💡 Gold tip: Citizens pay 1🪙 per 5 pop/tick automatically. Grow your city!','event');
addLog('⚖️ Sell surplus resources for gold in the TRADE tab.','event');
setSpeed(1);
