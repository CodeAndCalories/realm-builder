// TODO: EVENT_POOL array and resolveEvent()
const EVENT_POOL = [
  {id:'drought',title:'☀️ Great Drought',desc:'Fields wither under a relentless sun. Harvests are failing.',
   trigger:g=>g.b.farm>=2&&Math.random()<.008,
   choices:[
    {text:'Ration food strictly',         effect:'-20 food, -15 happiness',    good:false,apply:g=>{g.res.food=Math.max(0,g.res.food-20);g.res.happiness=Math.max(0,g.res.happiness-15);}},
    {text:'Buy food from merchants (50g)',effect:'+40 food, -50 gold',          good:true, apply:g=>{if(g.res.gold>=50){g.res.gold-=50;g.res.food+=40;}else toast('Need 50 gold!');}},
  ]},
  {id:'plague',title:'🦠 Plague Spreads',desc:'A mysterious sickness creeps through the lower districts.',
   trigger:g=>g.res.population>=25&&Math.random()<.006,
   choices:[
    {text:'Quarantine the district',      effect:'-10% pop, -20 happiness',    good:false,apply:g=>{g.res.population=Math.max(5,Math.floor(g.res.population*.9));g.res.happiness=Math.max(0,g.res.happiness-20);}},
    {text:'Hire healers (80g)',            effect:'pop safe, +5 happiness',     good:true, apply:g=>{if(g.res.gold>=80){g.res.gold-=80;g.res.happiness=Math.min(100,g.res.happiness+5);}else toast('Need 80 gold!');}},
  ]},
  {id:'trader',title:'🐫 Merchant Caravan',desc:'A wealthy caravan arrives at your gates, eager to trade.',
   trigger:g=>g.b.market>=1&&Math.random()<.012,
   choices:[
    {text:'Trade wood & stone for gold',  effect:'-20 wood, -10 stone, +70g',  good:true, apply:g=>{g.res.wood=Math.max(0,g.res.wood-20);g.res.stone=Math.max(0,g.res.stone-10);g.res.gold+=70;}},
    {text:'Buy rare goods (40g)',          effect:'-40g, +25 happiness',        good:true, apply:g=>{if(g.res.gold>=40){g.res.gold-=40;g.res.happiness=Math.min(100,g.res.happiness+25);}else toast('Need 40g!');}},
    {text:'Send them away',               effect:'No effect',                  good:false,apply:()=>{}},
  ]},
  {id:'festival',title:'🎉 Grand Festival',desc:'Citizens petition for a grand festival!',
   trigger:g=>g.b.tavern>=1&&Math.random()<.009,
   choices:[
    {text:'Hold the festival (30g)',      effect:'+30 happiness, +5 pop',      good:true, apply:g=>{if(g.res.gold>=30){g.res.gold-=30;g.res.happiness=Math.min(100,g.res.happiness+30);g.res.population+=Math.min(5,g.popCap-g.res.population);}else toast('Need 30g!');}},
    {text:'Decline',                      effect:'-10 happiness',              good:false,apply:g=>{g.res.happiness=Math.max(0,g.res.happiness-10);}},
  ]},
  {id:'bandits',title:'⚔️ Bandit Raiders',desc:'A ruthless gang descends upon your outer farms.',
   trigger:g=>g.res.gold>=60&&Math.random()<.007,
   choices:[
    {text:'Pay tribute (50g)',            effect:'-50 gold, peace',            good:false,apply:g=>{g.res.gold=Math.max(0,g.res.gold-50);}},
    {text:'Raise militia (-5 pop)',        effect:'Bandits repelled',           good:true, apply:g=>{g.res.population=Math.max(5,g.res.population-5);addLog('Militia repels the bandits!','good');}},
    {text:'Castle walls (needs castle)',  effect:'Free defense',               good:true, apply:g=>{if(g.b.castle>0)addLog('Castle walls hold! Bandits flee.','good');else toast('Need a Castle first!');}},
  ]},
  {id:'goldvein',title:'✨ Gold Vein Found',desc:'Miners discover a rich gold seam beneath your quarry!',
   trigger:g=>g.b.quarry>=2&&Math.random()<.008,
   choices:[
    {text:'Excavate immediately',         effect:'+80 gold, +10 stone',        good:true, apply:g=>{g.res.gold+=80;g.res.stone+=10;}},
    {text:'Sell rights (long-term)',      effect:'+40g now, +3g/tick forever', good:true, apply:g=>{g.res.gold+=40;g.bonusGold+=3;}},
  ]},
  {id:'immigrants',title:'🧳 Wave of Immigrants',desc:'Word of your realm has spread. Settlers arrive.',
   trigger:g=>g.res.happiness>=70&&Math.random()<.012,
   choices:[
    {text:'Welcome them',                 effect:'+20 pop if housing available',good:true,apply:g=>{const s=g.popCap-g.res.population;g.res.population+=Math.min(20,s);addLog('New settlers join!','good');}},
    {text:'Turn them away',              effect:'-5 happiness',               good:false,apply:g=>{g.res.happiness=Math.max(0,g.res.happiness-5);}},
  ]},
];

function renderEventsList(){
  const el=document.getElementById('events-list'); if(!el) return;
  if(G.activeEvents.length===0){el.innerHTML='<div style="color:var(--text-dim);font-style:italic;font-size:11px;text-align:center;padding:28px 0;">No events yet.<br>Grow your city and history will unfold...</div>';return;}
  el.innerHTML=G.activeEvents.map((ev,ei)=>`
    <div class="event-card">
      <div class="event-title">${ev.title}</div>
      <div class="event-desc">${ev.desc}</div>
      <div class="event-choices">${ev.choices.map((c,ci)=>`
        <button class="evt-btn" onclick="resolveEvent(${ei},${ci})">
          ${c.text}<div class="choice-effect${c.good?'':' bad'}">${c.effect}</div>
        </button>`).join('')}
      </div>
    </div>`).join('');
}
function resolveEvent(ei,ci){
  const ev=G.activeEvents[ei]; if(!ev) return;
  ev.choices[ci].apply(G);
  addLog(`${ev.title}: "${ev.choices[ci].text}"`,ev.choices[ci].good?'good':'bad');
  G.activeEvents.splice(ei,1); renderEventsList(); updateUI();
}
