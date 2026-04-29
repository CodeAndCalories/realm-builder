// TODO: city skyline canvas renderer, generateSprites()
const canvas=document.getElementById('city-canvas');
const ctx=canvas.getContext('2d');
let buildingSprites=[];

function resizeCanvas(){const w=document.getElementById('city-canvas-wrap');canvas.width=w.clientWidth;canvas.height=w.clientHeight;}

function generateSprites(){
  buildingSprites=[];
  const W=canvas.width,H=canvas.height,groundY=H*.72; let x=16;
  const all=[]; BUILDINGS.forEach(b=>{for(let i=0;i<(G.b[b.id]||0);i++)all.push(b);});
  const colorMap={housing:'#8a6a4a',resource:'#5a7a4a',industry:'#6a6a7a',civic:'#7a5a8a'};
  const roofMap={housing:'#c07840',resource:'#8ab050',industry:'#909090',civic:'#a060b0'};
  all.forEach(b=>{
    const bw=Math.max(16,Math.min(36,18+rnd(0,14))),bh=Math.max(22,Math.min(60,26+rnd(0,28)));
    if(x+bw>W-8) x=10+rnd(0,15);
    buildingSprites.push({x:x+rnd(-2,2),y:groundY-bh,w:bw,h:bh,color:colorMap[b.cat],roof:roofMap[b.cat]});
    x+=bw+rnd(2,7);
  });
}

function renderCity(){
  resizeCanvas();
  const W=canvas.width,H=canvas.height,isNight=(G.tick%40)>20;
  document.getElementById('day-night-label').textContent=isNight?'🌙 NIGHT':'☀️ DAY';
  const sky=ctx.createLinearGradient(0,0,0,H*.7);
  sky.addColorStop(0,isNight?'#050510':'#1a2a4a'); sky.addColorStop(1,isNight?'#0a0520':'#0e1820');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);
  if(isNight){ctx.fillStyle='rgba(255,255,220,.6)';for(let i=0;i<35;i++)ctx.fillRect((i*137+G.tick)%W,(i*73)%(H*.5),1,1);}
  else{ctx.fillStyle='rgba(255,220,100,.2)';ctx.beginPath();ctx.arc(W*.8,H*.18,28,0,Math.PI*2);ctx.fill();}
  const groundY=H*.72,gr=ctx.createLinearGradient(0,groundY,0,H);
  gr.addColorStop(0,'#2a3a20');gr.addColorStop(.3,'#1e2a16');gr.addColorStop(1,'#111810');
  ctx.fillStyle=gr;ctx.fillRect(0,groundY,W,H-groundY);
  ctx.fillStyle='#1a1a1a';ctx.fillRect(0,groundY+2,W,4);
  const total=BUILDINGS.reduce((a,b)=>a+(G.b[b.id]||0),0);
  if(total===0) buildingSprites=[];
  else if(buildingSprites.length===0) generateSprites();
  buildingSprites.forEach(bs=>{
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(bs.x+3,bs.y+bs.h,bs.w,4);
    ctx.fillStyle=isNight?shade(bs.color,-35):bs.color; ctx.fillRect(bs.x,bs.y,bs.w,bs.h);
    ctx.fillStyle=isNight?shade(bs.roof,-35):bs.roof;
    ctx.beginPath();ctx.moveTo(bs.x-2,bs.y);ctx.lineTo(bs.x+bs.w/2,bs.y-bs.h*.22);ctx.lineTo(bs.x+bs.w+2,bs.y);ctx.closePath();ctx.fill();
    ctx.fillStyle=isNight?'#ffdd88':'#b0cce8';
    const rows=Math.max(1,Math.floor(bs.h/14));
    for(let r=0;r<rows;r++){ctx.fillRect(bs.x+3,bs.y+5+r*11,3,4);if(bs.w>18)ctx.fillRect(bs.x+bs.w-7,bs.y+5+r*11,3,4);}
  });
  const fog=ctx.createLinearGradient(0,0,W,0);
  fog.addColorStop(0,'rgba(10,10,20,.4)');fog.addColorStop(.08,'transparent');fog.addColorStop(.92,'transparent');fog.addColorStop(1,'rgba(10,10,20,.4)');
  ctx.fillStyle=fog;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(232,196,106,.55)';ctx.font='9px serif';ctx.textAlign='left';
  ctx.fillText(`👥 ${G.res.population}  🏛 ${BUILDINGS.reduce((a,b)=>a+(G.b[b.id]||0),0)} bldgs`,8,H-7);
}

function shade(hex,d){
  const r=Math.max(0,Math.min(255,parseInt(hex.slice(1,3),16)+d));
  const g=Math.max(0,Math.min(255,parseInt(hex.slice(3,5),16)+d));
  const b=Math.max(0,Math.min(255,parseInt(hex.slice(5,7),16)+d));
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

let lastBldCount=-1;
setInterval(()=>{
  const cnt=BUILDINGS.reduce((a,b)=>a+(G.b[b.id]||0),0);
  if(cnt!==lastBldCount){lastBldCount=cnt;generateSprites();}
},600);
