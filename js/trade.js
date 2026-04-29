// TODO: TRADE_ITEMS, doSell(), doBuy(), renderShop()
const SELL_ITEMS = [
  {res:'food', name:'Food',        icon:'🌾', rate:1,   amt:20},
  {res:'food', name:'Food (bulk)', icon:'🌾', rate:0.8, amt:100},
  {res:'wood', name:'Wood',        icon:'🪵', rate:2,   amt:10},
  {res:'wood', name:'Wood (bulk)', icon:'🪵', rate:1.6, amt:50},
  {res:'stone',name:'Stone',       icon:'🪨', rate:3,   amt:10},
  {res:'stone',name:'Stone (bulk)',icon:'🪨', rate:2.5, amt:50},
];
const BUY_ITEMS = [
  {res:'food', name:'Food (emergency)',  icon:'🌾', rate:4,  amt:30},
  {res:'wood', name:'Wood (emergency)',  icon:'🪵', rate:6,  amt:20},
  {res:'stone',name:'Stone (emergency)', icon:'🪨', rate:8,  amt:20},
];

function getTradeBonus(){
  let bonus=0;
  BUILDINGS.forEach(bd=>{if(bd.prod.tradeBonus)bonus+=bd.prod.tradeBonus*(G.b[bd.id]||0);}); return bonus;
}
function doSell(res,amt,baseRate){
  if(G.res[res]<amt){toast(`Not enough ${res}!`);return;}
  const bonus=getTradeBonus();
  const gold=Math.round(amt*baseRate*(1+bonus));
  G.res[res]-=amt; G.res.gold+=gold;
  addLog(`Sold ${amt} ${res} → +${gold} gold`,'good'); toast(`+${gold} 🪙`); updateUI();
}
function doBuy(res,amt,rate){
  const cost=amt*rate;
  if(G.res.gold<cost){toast(`Need ${cost} gold!`);return;}
  G.res.gold-=cost; G.res[res]+=amt;
  addLog(`Bought ${amt} ${res} for ${cost} gold`,'good'); toast(`+${amt} ${res}`); updateUI();
}
function renderShop(s){
  if(!s) s=calcStats();
  const bonus=getTradeBonus();
  const sg=document.getElementById('sell-grid'), bg=document.getElementById('buy-grid'); if(!sg||!bg) return;
  sg.innerHTML=SELL_ITEMS.map(t=>{
    const eff=Math.round(t.rate*(1+bonus)*10)/10;
    const gold=Math.round(t.amt*eff);
    const have=Math.round(G.res[t.res]);
    const ok=have>=t.amt;
    return `<div class="shop-row">
      <div class="shop-icon">${t.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${t.name}</div>
        <div class="shop-desc">Sell ${t.amt} → ${gold} 🪙${bonus>0?' ✨':''}</div>
        <div class="shop-desc" style="color:${ok?'var(--text-dim)':'var(--red)'}">Have: ${have}</div>
      </div>
      <div class="shop-btns">
        <button class="shop-btn sell${ok?'':' off'}" ${ok?`onclick="doSell('${t.res}',${t.amt},${t.rate})"`:''}>SELL ${t.amt}</button>
        <div class="shop-rate">= ${gold}🪙</div>
      </div>
    </div>`;
  }).join('');
  bg.innerHTML=BUY_ITEMS.map(t=>{
    const cost=t.amt*t.rate;
    const ok=G.res.gold>=cost;
    return `<div class="shop-row">
      <div class="shop-icon">${t.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${t.name}</div>
        <div class="shop-desc">Buy ${t.amt} for ${cost} 🪙</div>
        <div class="shop-desc" style="color:${ok?'var(--text-dim)':'var(--red)'}">Treasury: ${Math.round(G.res.gold)}</div>
      </div>
      <div class="shop-btns">
        <button class="shop-btn buy${ok?'':' off'}" ${ok?`onclick="doBuy('${t.res}',${t.amt},${t.rate})"`:''}>BUY ${t.amt}</button>
        <div class="shop-rate">${cost}🪙</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('price-display').innerHTML=
    `Trading Post bonus: <b style="color:var(--teal)">+${Math.round(bonus*100)}%</b> sell price<br>`+
    `Sell rates — Food: ${SELL_ITEMS[0].rate}g, Wood: ${SELL_ITEMS[2].rate}g, Stone: ${SELL_ITEMS[4].rate}g per unit<br>`+
    `<span style="color:var(--green2)">Tip: Build more Trading Posts to improve sell rates.</span>`;
}
