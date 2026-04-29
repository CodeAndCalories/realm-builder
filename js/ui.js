// TODO: updateUI(), switchTab(), toast(), addLog()
function updateUI(s){
  if(!s) s=calcStats();
  const r=G.res;
  document.getElementById('r-gold').textContent=fmt(r.gold);
  document.getElementById('r-pop').textContent=fmt(r.population);
  document.getElementById('r-food').textContent=fmt(r.food);
  document.getElementById('r-wood').textContent=fmt(r.wood);
  document.getElementById('r-stone').textContent=fmt(r.stone);
  document.getElementById('r-hap').textContent=Math.round(r.happiness);
  const gr=document.getElementById('r-gold-rate');
  gr.textContent=(s.goldProd>=0?'+':'')+s.goldProd; gr.className='res-rate'+(s.goldProd<0?' neg':'');
  const fr=document.getElementById('r-food-rate');
  fr.textContent=(s.foodNet>=0?'+':'')+s.foodNet; fr.className='res-rate'+(s.foodNet<0?' neg':'');
  document.getElementById('r-wood-rate').textContent='+'+s.woodProd;
  document.getElementById('r-stone-rate').textContent='+'+s.stoneProd;
  document.getElementById('tick-num').textContent=G.tick;
  document.getElementById('year-num').textContent=G.year;
  document.getElementById('ov-pop').textContent=r.population;
  document.getElementById('ov-year').textContent=G.year;
  document.getElementById('ov-buildings').textContent=BUILDINGS.reduce((a,b)=>a+(G.b[b.id]||0),0);
  document.getElementById('ov-prestige').textContent=G.prestige;
  document.getElementById('bar-gold').style.width=Math.min(100,r.gold/1000*100)+'%';
  document.getElementById('bar-gold-lbl').textContent=fmt(r.gold)+' gold';
  document.getElementById('bar-pop').style.width=Math.min(100,r.population/s.popCap*100)+'%';
  document.getElementById('bar-pop-lbl').textContent=r.population+'/'+s.popCap;
  document.getElementById('bar-food').style.width=Math.min(100,r.food/s.maxFood*100)+'%';
  document.getElementById('bar-food-lbl').textContent=fmt(r.food)+'/'+fmt(s.maxFood);
  document.getElementById('bar-hap').style.width=r.happiness+'%';
  document.getElementById('bar-hap-lbl').textContent=Math.round(r.happiness)+'%';
  document.getElementById('income-summary').innerHTML=
    `<span style="color:var(--gold)">Gold:</span> +${s.goldProd}/tick `+
    `<span style="color:var(--text-dim);font-size:9px;">(${s.taxGold} from ${r.population} citizens)</span><br>`+
    `<span style="color:var(--green)">Food net:</span> ${s.foodNet>=0?'+':''}${s.foodNet}/tick `+
    `<span style="color:var(--text-dim);font-size:9px;">(consuming ${s.foodConsume}/tick)</span><br>`+
    `<span style="color:#aa7733">Wood:</span> +${s.woodProd}/tick &nbsp; <span style="color:#99aaaa">Stone:</span> +${s.stoneProd}/tick<br>`+
    `<span style="color:var(--purple)">Prestige bonus:</span> +${Math.round((s.presBonus-1)*100)}% all production`;
  renderBuildCards();
  // Only refresh shop if visible
  if(document.getElementById('panel-shop').classList.contains('active')) renderShop(s);
}

function addLog(msg,cls=''){
  G.log.unshift({msg,cls,year:G.year}); if(G.log.length>60) G.log.pop();
  const el=document.getElementById('log-list'); if(!el) return;
  el.innerHTML=G.log.slice(0,35).map(e=>`
    <div class="log-entry ${e.cls}"><span style="color:var(--text-dim);font-size:9px;">Yr ${e.year}</span> — ${e.msg}</div>`).join('');
}

let toastTimer=null;
function toast(msg){
  const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2400);
}

function switchTab(name){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const panel=document.getElementById('panel-'+name); if(panel) panel.classList.add('active');
  const tab=document.querySelector(`.tab[data-tab="${name}"]`); if(tab) tab.classList.add('active');
  if(name==='shop') renderShop();
  if(name==='events') renderEventsList();
}
