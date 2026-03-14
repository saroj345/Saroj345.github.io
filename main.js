// ── SECURITY: HTML escape helper ────────────────────────
function esc(str) {
  if(typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ═══════════════════════════════════════════════════════
//  SAROJ-OS — SECURITY DESKTOP JAVASCRIPT
// ═══════════════════════════════════════════════════════

// ── GURKHA / KHUKURI INTRO ──────────────────────────────
var introDone = false;
var deflectTriggered = false;

// ── Matrix rain on intro background ──
(function(){
  var c = document.getElementById('intro-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var drops = [];
  function rsz(){ c.width=window.innerWidth; c.height=window.innerHeight; drops=Array(Math.floor(c.width/16)).fill(1); }
  rsz(); window.addEventListener('resize', rsz);
  var chars = '01アカタハ</>{}[]SAROJ⚔🏔🇳🇵';
  setInterval(function(){
    ctx.fillStyle='rgba(0,0,0,.14)';
    ctx.fillRect(0,0,c.width,c.height);
    drops.forEach(function(y,i){
      ctx.font="12px 'JetBrains Mono'";
      ctx.fillStyle='rgba(0,255,65,'+(Math.random()*.1+.03)+')';
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, y*16);
      if(y*16>c.height && Math.random()>.97) drops[i]=0;
      drops[i]++;
    });
  }, 55);
})();

// ── Build animated battle cry ──
(function(){
  var el = document.getElementById('battle-cry-text');
  if(!el) return;
  var text = 'JAI MAHAKALI · AYOO GORKHALI ⚔';
  var delay = 0;
  for(var i=0;i<text.length;i++){
    var ch = text[i];
    var span = document.createElement('span');
    if(ch === ' '){
      span.className = 'cry-char space';
      span.innerHTML = '&nbsp;';
    } else if(ch === '·' || ch === '⚔'){
      span.className = 'cry-char dot';
      span.textContent = ch;
    } else {
      span.className = 'cry-char';
      span.textContent = ch;
    }
    span.style.animationDelay = (i * 0.06) + 's';
    el.appendChild(span);
  }
})();

// ── Khukuri Battle Canvas Animation ──
(function(){
  var bc=document.getElementById('battle-canvas');
  if(!bc) return;
  var ctx=bc.getContext('2d');
  bc.width=window.innerWidth; bc.height=window.innerHeight;
  window.addEventListener('resize',function(){bc.width=window.innerWidth;bc.height=window.innerHeight;});
  var W=bc.width,H=bc.height;

  function ec(e,sz){
    var c=document.createElement('canvas');
    c.width=sz*2;c.height=sz*2;
    var x=c.getContext('2d');
    x.font=sz+'px serif';
    x.textAlign='center';
    x.textBaseline='middle';
    x.fillText(e,sz,sz);
    return c;
  }
  var ninja=ec('\uD83E\uDD77',80);
  var dev=ec('\uD83E\uDDD1\u200D\uD83D\uDCBB',80);
  var kimg=ec('\uD83D\uDD2A',28);

  var attackers=[
    {id:0,ex:0.05,ey:0.38,label:'HACKER #1',color:'#ff3333',hp:100,bobOff:0,  si:18,ls:0, d:false},
    {id:1,ex:0.05,ey:0.62,label:'HACKER #2',color:'#ff5500',hp:100,bobOff:1.2,si:22,ls:18,d:false},
    {id:2,ex:0.35,ey:0.08,label:'HACKER #3',color:'#cc00ff',hp:100,bobOff:2.1,si:26,ls:35,d:false},
    {id:3,ex:0.65,ey:0.08,label:'HACKER #4',color:'#ff0066',hp:100,bobOff:0.8,si:30,ls:55,d:false},
  ];
  var def={ex:0.88,ey:0.5};
  var knives=[],parts=[],fc=0,dShake=0,done=false,defeated=0;
  var msgs=['Khukuri barrage - DEFLECTED!','Multi-angle - BLOCKED!','Coordinated - COUNTERED!','Surround - NEUTRALIZED!','Final barrage - REPELLED!','One Gurkha. Many enemies. No fear.'];
  var mi=0;

  function sk(a){
    if(done||a.d) return;
    var dX=bc.width*def.ex,dY=bc.height*def.ey,aX=bc.width*a.ex,aY=bc.height*a.ey;
    knives.push({x:aX,y:aY,tx:dX+(Math.random()-.5)*50,ty:dY+(Math.random()-.5)*60,
      spd:4+Math.random()*3,ang:Math.atan2(dY-aY,dX-aX),
      spin:(Math.random()>.5?1:-1)*(.18+Math.random()*.22),
      hit:false,al:1,col:a.color,ai:a.id});
    var el=document.getElementById('atk-log');
    if(el) el.textContent=msgs[mi++%msgs.length];
  }

  function lbl(t,x,y,c){
    ctx.save();ctx.font="bold 9px 'JetBrains Mono'";
    ctx.textAlign='center';ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=4;
    ctx.fillText(t,x,y);ctx.shadowBlur=0;ctx.restore();
  }
  function hpBar(x,y,p,c){
    ctx.save();ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(x-30,y,60,5);
    ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=4;
    ctx.fillRect(x-30,y,60*Math.max(0,p/100),5);
    ctx.shadowBlur=0;ctx.restore();
  }
  function shl(x,y,t){
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t)*.08);
    ctx.shadowColor='#00ff41';ctx.shadowBlur=18+Math.sin(t*2)*8;
    ctx.strokeStyle='#00ff41';ctx.lineWidth=2.5;ctx.fillStyle='rgba(0,255,65,.1)';
    ctx.beginPath();ctx.moveTo(0,-36);ctx.lineTo(26,-20);ctx.lineTo(26,16);
    ctx.lineTo(0,36);ctx.lineTo(-26,16);ctx.lineTo(-26,-20);ctx.closePath();
    ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  }
  function drawFlag(x,y){
    var s=1.5;
    ctx.save();
    ctx.fillStyle='#003893';
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+38*s);ctx.lineTo(x+30*s,y+26*s);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+20*s);ctx.lineTo(x+22*s,y+10*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='#DC143C';
    ctx.beginPath();ctx.moveTo(x+2,y+2);ctx.lineTo(x+2,y+35*s);ctx.lineTo(x+27*s,y+25*s);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(x+2,y+2);ctx.lineTo(x+2,y+18*s);ctx.lineTo(x+19*s,y+10*s);ctx.closePath();ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath();ctx.arc(x+9*s,y+12*s,4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+11*s,y+26*s,5.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function loop(){
    if(done) return;
    W=bc.width;H=bc.height;ctx.clearRect(0,0,W,H);fc++;
    var t=fc*.04,dX=W*def.ex,dY=H*def.ey;

    attackers.forEach(function(a){
      if(!a.d&&fc>=a.ls+a.si){a.ls=fc;sk(a);}
    });

    attackers.forEach(function(a){
      if(a.d) return;
      var ax=W*a.ex,ay=H*a.ey;
      ctx.save();ctx.strokeStyle='rgba(255,51,51,.05)';ctx.setLineDash([3,12]);
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(dX,dY);ctx.stroke();
      ctx.setLineDash([]);ctx.restore();
    });

    attackers.forEach(function(a){
      var ax=W*a.ex,ay=H*a.ey,bob=Math.sin(t*1.8+a.bobOff)*(a.d?0:5);
      ctx.save();
      if(a.d){
        ctx.globalAlpha=0.25;ctx.drawImage(ninja,ax-40,ay+bob-40,80,80);ctx.globalAlpha=1;
        ctx.strokeStyle='rgba(255,51,51,.7)';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(ax-14,ay-14);ctx.lineTo(ax+14,ay+14);ctx.stroke();
        ctx.beginPath();ctx.moveTo(ax+14,ay-14);ctx.lineTo(ax-14,ay+14);ctx.stroke();
      } else {
        ctx.shadowColor=a.color;ctx.shadowBlur=12;
        ctx.drawImage(ninja,ax-40,ay+bob-40,80,80);
        hpBar(ax,ay+bob+26,a.hp,a.color);
      }
      ctx.restore();
      lbl(a.label,ax,ay+bob+40,a.d?'#333':a.color);
    });

    var sx=dShake>0?Math.random()*8-4:0,sy=dShake>0?Math.random()*5-2.5:0;
    shl(dX-38+sx,dY+Math.sin(t*1.5)*4+sy,t);
    ctx.save();ctx.shadowColor='#00ff41';ctx.shadowBlur=16;
    ctx.drawImage(dev,dX+sx-42,dY+Math.sin(t*1.5)*4+sy-42,84,84);
    ctx.shadowBlur=0;ctx.restore();
    lbl('SAROJ 1v'+attackers.length,dX,dY+40,'#00ff41');
    hpBar(dX,dY+48,100,'#00ff41');
    if(dShake>0) dShake--;

    ctx.save();ctx.font="bold 10px 'Orbitron'";ctx.textAlign='center';
    ctx.fillStyle='rgba(0,255,65,.5)';
    ctx.fillText('DEFEATED: '+defeated+' / '+attackers.length,W/2,30);
    ctx.restore();

    knives.forEach(function(k){
      if(k.hit){k.al-=.07;return;}
      var dx=k.tx-k.x,dy=k.ty-k.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<38){
        k.hit=true;dShake=10;
        var a=attackers[k.ai];
        if(a&&!a.d){
          a.hp=Math.max(0,a.hp-35);
          if(a.hp<=0){
            a.d=true;defeated++;
            for(var i=0;i<25;i++){
              var ang=Math.random()*Math.PI*2,spd=3+Math.random()*7;
              parts.push({x:W*a.ex,y:H*a.ey,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-2,life:1,r:2+Math.random()*4,col:['#ff3333','#ff8800','#ffe000'][Math.floor(Math.random()*3)]});
            }
          }
        }
        for(var i=0;i<15;i++){
          var ang=Math.random()*Math.PI*2,spd=2+Math.random()*5;
          parts.push({x:k.tx,y:k.ty,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-1,life:1,r:2+Math.random()*3,col:['#00ff41','#ffe000','#fff'][Math.floor(Math.random()*3)]});
        }
        if(defeated>=attackers.length&&!deflectTriggered){
          deflectTriggered=true;done=true;setTimeout(triggerDeflect,600);
        }
      } else {
        k.x+=(dx/dist)*k.spd;k.y+=(dy/dist)*k.spd;k.ang+=k.spin;
      }
      ctx.save();ctx.globalAlpha=k.hit?Math.max(0,k.al):1;
      ctx.translate(k.x,k.y);ctx.rotate(k.ang);
      ctx.drawImage(kimg,-14,-14,28,28);
      ctx.restore();
    });

    parts=parts.filter(function(p){return p.life>0;});
    parts.forEach(function(p){
      ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.col;ctx.shadowColor=p.col;ctx.shadowBlur=8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();
      p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=.025;
    });

    drawFlag(8,8);
    ctx.save();ctx.font="bold 12px 'JetBrains Mono'";ctx.fillStyle='rgba(0,255,65,.7)';ctx.textAlign='left';
    ctx.fillText('NEPAL - GURKHA NATION',66,30);
    ctx.font="11px 'JetBrains Mono'";
    ctx.fillStyle='rgba(0,255,65,.4)';
    ctx.fillText('JAI MAHAKALI - AYOO GORKHALI',66,48);
    ctx.restore();

    requestAnimationFrame(loop);
  }
  loop();
})();


// failsafe: force deflect after 8s no matter what
setTimeout(function(){
  if(!deflectTriggered){ deflectTriggered=true; triggerDeflect(); }
}, 2000);

function triggerDeflect() {
  // hide attack phase immediately
  var atk = document.getElementById('ph-attack');
  if(atk){ atk.classList.remove('show'); atk.style.display='none'; }

  // show deflect phase
  var blk = document.getElementById('ph-block');
  if(blk){ blk.style.display='flex'; setTimeout(function(){ blk.classList.add('show'); }, 20); }
  spawnSparks();

  // then show intro phase
  setTimeout(function(){
    if(blk){ blk.classList.remove('show'); blk.style.display='none'; }
    var intro = document.getElementById('ph-intro');
    if(intro){ intro.style.display='flex'; setTimeout(function(){ intro.classList.add('show'); }, 20); }
  }, 600);

  setTimeout(typeIntro, 800);
}

function showPhase(id, delay) {
  setTimeout(function(){
    document.querySelectorAll('.intro-phase').forEach(function(p){
      p.classList.remove('show');
      p.style.display = 'none';
    });
    var el = document.getElementById(id);
    if(!el) return;
    el.style.display = 'flex';
    setTimeout(function(){ el.classList.add('show'); }, 20);
  }, delay);
}

function spawnSparks() {
  var container = document.getElementById('sparks');
  if(!container) return;
  container.innerHTML = '';
  for(var i=0; i<50; i++){
    var s = document.createElement('div'); s.className='spark';
    var angle = Math.random()*Math.PI*2;
    var dist = 60 + Math.random()*220;
    s.style.setProperty('--sx', Math.cos(angle)*dist+'px');
    s.style.setProperty('--sy', Math.sin(angle)*dist+'px');
    s.style.setProperty('--sd', (0.3+Math.random()*0.9)+'s');
    s.style.background = ['#00ff41','#ffe000','#ffffff','#00d4ff'][Math.floor(Math.random()*4)];
    var sz = (2+Math.random()*5)+'px';
    s.style.width=sz; s.style.height=sz;
    container.appendChild(s);
  }
}

// ── Typing intro ──
var introLines = [
  'Namaste! I am Saroj Khadka. 🙏',
  'From Nepal — the land of the mighty Gurkhas. 🏔',
  'A nation of warriors. A nation of fearless fighters.',
  'I carry that spirit into the digital battlefield.',
  'Security & DevOps Engineer · 5+ years defending systems.',
  'I secure your infrastructure so threats never reach you.',
];
var tlIdx=0, tcIdx=0;
function typeIntro() {
  var typingEl = document.getElementById('intro-typing');
  if(!typingEl) return;
  if(tlIdx >= introLines.length) {
    var stats = document.getElementById('intro-stats');
    var acl = document.getElementById('access-lines');
    if(stats) stats.style.display='flex';
    if(acl) { acl.style.display='block'; }
    // auto enter after 2s - no button needed
    setTimeout(function(){ skipIntro(); }, 1200);
    return;
  }
  var line = introLines[tlIdx];
  if(tcIdx <= line.length) {
    typingEl.innerHTML = line.substring(0,tcIdx)+'<span class="typing-cursor"></span>';
    tcIdx++;
    setTimeout(typeIntro, tcIdx===1?120:16);
  } else {
    setTimeout(function(){ tlIdx++; tcIdx=0; setTimeout(typeIntro,200); }, 800);
  }
}

function skipIntro() {
  if(introDone) return;
  introDone = true;

  // glitch flash effect before entering
  var intro = document.getElementById('intro');
  var flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#00ff41;opacity:0;pointer-events:none;transition:opacity .08s';
  document.body.appendChild(flash);

  // rapid glitch flashes
  var flashes = 0;
  function doFlash() {
    flash.style.opacity = flashes % 2 === 0 ? '0.15' : '0';
    flashes++;
    if(flashes < 6) setTimeout(doFlash, 80);
    else {
      // final fade out
      intro.style.transition = 'opacity .5s';
      intro.style.opacity = '0';
      setTimeout(function(){
        intro.style.display = 'none';
        flash.style.display = 'none';
        initDesktop();
      }, 500);
    }
  }
  doFlash();
}

// ── MATRIX CANVAS ───────────────────────────────────────
var wcanvas = document.getElementById('wall-canvas');
var wctx = wcanvas.getContext('2d');
var wdrops = [], won = true;
function wrsz() {
  wcanvas.width = window.innerWidth; wcanvas.height = window.innerHeight;
  wdrops = Array(Math.floor(wcanvas.width/18)).fill(1);
}
wrsz(); window.addEventListener('resize', wrsz);
var wchars = 'アカサタナハ01ABCDEF<>{}|\\nmap-sV-O--script';
function wdraw() {
  wctx.fillStyle = 'rgba(10,14,26,.2)';
  wctx.fillRect(0,0,wcanvas.width,wcanvas.height);
  wctx.font = "11px 'JetBrains Mono',monospace";
  wdrops.forEach(function(y,i){
    wctx.fillStyle = 'rgba(0,255,65,' + (Math.random()*.12+.05) + ')';
    wctx.fillText(wchars[Math.floor(Math.random()*wchars.length)], i*18, y*18);
    if (y*18>wcanvas.height&&Math.random()>.97) wdrops[i]=0;
    wdrops[i]++;
  });
}
var wiv = setInterval(wdraw, 80);
function toggleWallCanvas() { won=!won; wcanvas.style.opacity = won?'.18':'0'; }

// ── CLOCK ───────────────────────────────────────────────
function updateClock() {
  var n = new Date(), h = String(n.getHours()).padStart(2,'0'), m = String(n.getMinutes()).padStart(2,'0');
  document.getElementById('tb-clock').textContent = h + ':' + m;
}
updateClock(); setInterval(updateClock, 10000);

// ── WINDOW MANAGEMENT ───────────────────────────────────
var zTop = 200;
function focusWin(id) {
  document.querySelectorAll('.win').forEach(function(w){ w.classList.remove('focused'); w.style.zIndex = 100; });
  var w = document.getElementById(id);
  if (w) { w.classList.add('focused'); w.style.zIndex = ++zTop; }
  document.querySelectorAll('.tb-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('onclick') && b.getAttribute('onclick').indexOf(id) > -1);
  });
}
function openWin(id) {
  var w = document.getElementById(id);
  if (!w) return;
  w.style.display = 'flex'; w.classList.remove('minimized');
  focusWin(id);
  hideCtx();
}
function closeWin(id) {
  var w = document.getElementById(id);
  if (w) w.style.display = 'none';
  document.querySelectorAll('.tb-btn').forEach(function(b){
    if (b.getAttribute('onclick') && b.getAttribute('onclick').indexOf(id) > -1) b.classList.remove('active');
  });
}
function minimizeWin(id) {
  var w = document.getElementById(id);
  if (w) { w.style.display='none'; w.classList.add('minimized'); }
}
function maximizeWin(id) {
  var w = document.getElementById(id);
  if (!w) return;
  if (w._max) {
    w.style.cssText = w._prev; w._max = false;
  } else {
    w._prev = w.style.cssText;
    w.style.left='0'; w.style.top='0'; w.style.right='0'; w.style.bottom='44px';
    w.style.width='100%'; w.style.height='calc(100vh - 44px)'; w.style.borderRadius='0';
    w._max = true;
  }
}
function toggleWin(id) {
  var w = document.getElementById(id);
  if (!w) return;
  if (w.style.display === 'none' || w.style.display === '') { openWin(id); }
  else if (w.classList.contains('focused')) { minimizeWin(id); }
  else { focusWin(id); }
}
document.querySelectorAll('.win').forEach(function(w){ w.addEventListener('mousedown', function(){ focusWin(w.id); }); });

// ── DRAG ────────────────────────────────────────────────
var drag = null;
document.querySelectorAll('.wbar').forEach(function(bar){
  bar.addEventListener('mousedown', function(e){
    if (e.target.classList.contains('wd')) return;
    var winEl = document.getElementById(bar.dataset.win);
    var startX = e.clientX - winEl.offsetLeft, startY = e.clientY - winEl.offsetTop;
    drag = { el: winEl, sx: startX, sy: startY };
    focusWin(bar.dataset.win);
    e.preventDefault();
  });
});
document.addEventListener('mousemove', function(e){
  if (drag) {
    drag.el.style.left = Math.max(0, e.clientX - drag.sx) + 'px';
    drag.el.style.top = Math.max(0, e.clientY - drag.sy) + 'px';
    drag.el.style.right = 'auto'; drag.el.style.bottom = 'auto';
  }
  if (resz) {
    var dx = e.clientX - resz.sx, dy = e.clientY - resz.sy;
    resz.el.style.width = Math.max(320, resz.w + dx) + 'px';
    resz.el.style.height = Math.max(200, resz.h + dy) + 'px';
  }
});
document.addEventListener('mouseup', function(){ drag = null; resz = null; });

// ── RESIZE ──────────────────────────────────────────────
var resz = null;
function startResize(e, id) {
  var w = document.getElementById(id);
  resz = { el: w, sx: e.clientX, sy: e.clientY, w: w.offsetWidth, h: w.offsetHeight };
  e.stopPropagation(); e.preventDefault();
}

// ── CONTEXT MENU ────────────────────────────────────────
var ctxMenu = document.getElementById('ctx-menu');
document.getElementById('desktop').addEventListener('contextmenu', function(e){
  e.preventDefault();
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth-170) + 'px';
  ctxMenu.style.top = Math.min(e.clientY, window.innerHeight-200) + 'px';
  ctxMenu.style.display = 'block';
});
document.addEventListener('click', hideCtx);
function hideCtx() { ctxMenu.style.display='none'; }

// ── DESKTOP ICONS ────────────────────────────────────────
function selectIcon(el) {
  document.querySelectorAll('.desk-icon').forEach(function(i){ i.classList.remove('selected'); });
  el.classList.add('selected');
}
document.getElementById('desktop').addEventListener('click', function(e){
  if (!e.target.closest('.desk-icon')) {
    document.querySelectorAll('.desk-icon').forEach(function(i){ i.classList.remove('selected'); });
  }
});

// ── DISK PARTITIONS ─────────────────────────────────────
var parts = [
  { name:'/dev/nvme0n1p1', label:'Cloud & Infrastructure', type:'ext4', pct:90, used:'90 GB', total:'100 GB', color:'#00d4ff' },
  { name:'/dev/nvme0n1p2', label:'Security & VAPT', type:'ext4', pct:88, used:'88 GB', total:'100 GB', color:'#ff3366' },
  { name:'/dev/nvme0n1p3', label:'DevSecOps & CI/CD', type:'btrfs', pct:85, used:'85 GB', total:'100 GB', color:'#7c3aed' },
  { name:'/dev/nvme0n1p4', label:'SIEM & Monitoring', type:'xfs', pct:82, used:'82 GB', total:'100 GB', color:'#ff6b00' },
  { name:'/dev/nvme0n1p5', label:'Automation & Scripting', type:'ext4', pct:80, used:'80 GB', total:'100 GB', color:'#00ff88' },
  { name:'/dev/nvme0n1p6', label:'AI Security & ML Hardening', type:'ext4', pct:72, used:'72 GB', total:'100 GB', color:'#ff00ff' },
  { name:'/dev/nvme0n1p7', label:'Low-Level & Exploit Dev', type:'ext4', pct:76, used:'76 GB', total:'100 GB', color:'#ff8800' },
  { name:'/dev/nvme0n1p8', label:'Mission Critical Systems', type:'ext4', pct:55, used:'55 GB', total:'100 GB', color:'#00ccff' },
  { name:'[swap]', label:'CTF & Research', type:'swap', pct:95, used:'∞', total:'∞', color:'#ffd700' },
];
function renderDisk() {
  var pm = document.getElementById('dmap'), pl = document.getElementById('dlegend'), pc = document.getElementById('partitions');
  pm.innerHTML = ''; pl.innerHTML = ''; pc.innerHTML = '';
  parts.forEach(function(p){
    var s = document.createElement('div'); s.className='dms';
    s.style.cssText = 'width:'+Math.round(p.pct/parts.length*100/parts.length*parts.length*0.9/5)+'%;background:'+p.color+';color:'+p.color+';min-width:2%';
    // simpler: equal-ish widths based on pct
    s.style.width = (p.pct / parts.reduce(function(a,b){return a+b.pct;},0) * 100) + '%';
    s.style.background = p.color; s.style.opacity = '.7';
    s.title = p.label; pm.appendChild(s);
    var li = document.createElement('div'); li.className='dl-item';
    li.innerHTML = '<div class="dl-dot" style="background:'+esc(p.color)+'"></div>' + esc(p.label);
    pl.appendChild(li);
    // partition row
    var row = document.createElement('div'); row.className='part-row';
    row.innerHTML = '<div class="part-info">'
      + '<div class="part-label"><div class="part-dot" style="background:'+p.color+'"></div>'
      + '<span class="part-name">'+p.name+'</span>'
      + '<span class="part-type">['+p.type+']</span></div>'
      + '<span class="part-size" style="font-size:10px;color:var(--muted)">'+p.used+' / '+p.total+'</span></div>'
      + '<div class="part-bar">'
      + '<div class="part-fill" style="width:0;background:'+p.color+'" data-w="'+p.pct+'"></div>'
      + '<span class="part-pct">'+p.pct+'%</span></div>'
      + '<div style="font-size:9px;color:var(--muted);margin-top:4px">'+p.label+'</div>';
    pc.appendChild(row);
  });
  // animate bars after small delay
  setTimeout(function(){
    document.querySelectorAll('#partitions .part-fill').forEach(function(b){
      b.style.width = b.dataset.w + '%';
    });
  }, 300);
}
renderDisk();

// ── FILE MANAGER ────────────────────────────────────────
var folderData = {
  experience: {
    title: 'Experience Files',
    path: '/home/saroj/experience',
    files: [
      { ico:'📄', name:'zakipoint-health.md', size:'8.2 KB', date:'2024-01-01', content:'zakipoint' },
      { ico:'📄', name:'cryptogen-nepal.md', size:'5.1 KB', date:'2021-03-15', content:'cryptogen' },
      { ico:'📄', name:'cover-letter.txt', size:'2.4 KB', date:'2024-06-01', content:'cover' },
      { ico:'📊', name:'stats.json', size:'1.1 KB', date:'2024-01-01', content:'stats' },
    ]
  },
  skills: {
    title: 'Skills Index',
    path: '/home/saroj/skills',
    files: [
      { ico:'☁️', name:'cloud-platforms.md', size:'4.4 KB', date:'2024-01-01', content:'skills_cloud' },
      { ico:'🔒', name:'security-tools.md', size:'6.7 KB', date:'2024-01-01', content:'skills_sec' },
      { ico:'🐳', name:'devops-stack.md', size:'3.9 KB', date:'2024-01-01', content:'skills_devops' },
      { ico:'📊', name:'siem-monitoring.md', size:'3.2 KB', date:'2024-01-01', content:'skills_siem' },
      { ico:'🐍', name:'scripting.md', size:'2.8 KB', date:'2024-01-01', content:'skills_code' },
      { ico:'📋', name:'certifications.md', size:'1.9 KB', date:'2024-01-01', content:'skills_certs' },
    ]
  },
  tools: {
    title: 'Security Tools',
    path: '/home/saroj/tools',
    files: [
      { ico:'🔍', name:'nmap', size:'binary', date:'2024-01-01' },
      { ico:'💀', name:'metasploit', size:'binary', date:'2024-01-01' },
      { ico:'🕷️', name:'burpsuite', size:'binary', date:'2024-01-01' },
      { ico:'🔐', name:'hashcat', size:'binary', date:'2024-01-01' },
      { ico:'📡', name:'wireshark', size:'binary', date:'2024-01-01' },
      { ico:'🛡️', name:'wazuh-agent', size:'binary', date:'2024-01-01' },
      { ico:'🔧', name:'nikto', size:'binary', date:'2024-01-01' },
      { ico:'⚔️', name:'sqlmap', size:'binary', date:'2024-01-01' },
      { ico:'🌐', name:'gobuster', size:'binary', date:'2024-01-01' },
      { ico:'🔑', name:'john-the-ripper', size:'binary', date:'2024-01-01' },
      { ico:'📦', name:'docker', size:'binary', date:'2024-01-01' },
      { ico:'☸️', name:'kubectl', size:'binary', date:'2024-01-01' },
    ]
  },
  reports: {
    title: 'Pentest Reports',
    path: '/home/saroj/reports',
    files: [
      { ico:'🔴', name:'pentest-report-2024-Q4.pdf', size:'2.1 MB', date:'2024-12-01' },
      { ico:'🟠', name:'vapt-fintech-2024.pdf', size:'1.8 MB', date:'2024-09-15' },
      { ico:'🟡', name:'red-team-ops-2024.pdf', size:'3.4 MB', date:'2024-07-20' },
      { ico:'📋', name:'soc2-audit-report.pdf', size:'980 KB', date:'2024-05-01' },
      { ico:'📋', name:'cloud-sec-assessment.pdf', size:'1.2 MB', date:'2024-03-10' },
    ]
  },
  exploits: {
    title: '[RESTRICTED] Exploits',
    path: '/home/saroj/exploits [ENCRYPTED]',
    files: [
      { ico:'🔐', name:'[ENCRYPTED]', size:'???', date:'????' },
      { ico:'🔐', name:'[ENCRYPTED]', size:'???', date:'????' },
      { ico:'🔐', name:'[ENCRYPTED]', size:'???', date:'????' },
    ]
  },
  configs: {
    title: 'Config Files',
    path: '/home/saroj/configs',
    files: [
      { ico:'⚙️', name:'.bashrc', size:'3.2 KB', date:'2024-01-01' },
      { ico:'🔧', name:'wazuh.conf', size:'12 KB', date:'2024-01-01' },
      { ico:'🌐', name:'nginx-hardened.conf', size:'8.4 KB', date:'2024-01-01' },
      { ico:'🔑', name:'sshd_config', size:'4.1 KB', date:'2024-01-01' },
      { ico:'🛡️', name:'iptables.rules', size:'2.7 KB', date:'2024-01-01' },
      { ico:'☁️', name:'terraform.tfvars', size:'1.8 KB', date:'2024-01-01' },
      { ico:'🐳', name:'docker-compose.yml', size:'3.3 KB', date:'2024-01-01' },
      { ico:'☸️', name:'k8s-rbac.yaml', size:'5.9 KB', date:'2024-01-01' },
    ]
  },
  certs: {
    title: 'Certifications',
    path: '/home/saroj/certs',
    files: [
      { ico:'🏅', name:'CEH-Practical-v11.pdf', size:'1.2 MB', date:'2022-06-01' },
      { ico:'🏅', name:'CNSS-Certificate.pdf', size:'890 KB', date:'2021-11-01' },
      { ico:'🏅', name:'AWS-Cloud-Practitioner.pdf', size:'1.1 MB', date:'2021-08-01' },
    ]
  }
};

var fileContents = {
  zakipoint: { title:'zakipoint-health.md', body:
    '<div class="exp-block"><div class="exp-title">Security & DevOps Engineer</div><div class="exp-co">Zakipoint Health Pvt. Ltd &mdash; Remote</div><div class="exp-date">May 2021 &ndash; Present</div></div>'
    + '<ul style="margin:10px 0 10px 16px;font-size:11px;color:#8899aa;line-height:2">'
    + '<li><strong style="color:var(--accent)">Security & DevOps Integration:</strong> Implemented vulnerability scanning (Trivy, Snyk) and threat modeling early in the SDLC — shifting security left to catch issues before production.</li>'
    + '<li><strong style="color:var(--accent)">CI/CD Pipeline Security:</strong> Hardened Jenkins, GitHub Actions, and GitLab CI pipelines with secret scanning, SAST/DAST stages, and signed artifact verification.</li>'
    + '<li><strong style="color:var(--accent)">IaC Security:</strong> Used Terraform and Ansible to define secure, compliant, immutable infrastructure — enforcing CIS benchmarks and policy-as-code via OPA and Checkov.</li>'
    + '<li><strong style="color:var(--accent)">Container &amp; Kubernetes Security:</strong> Managed Docker and Kubernetes security including image scanning, RBAC enforcement, network segmentation, and Pod Security Policies.</li>'
    + '<li><strong style="color:var(--accent)">Identity &amp; Access Management (IAM):</strong> Enforced least-privilege access and secret management using HashiCorp Vault and AWS IAM — eliminating hardcoded credentials across all services.</li>'
    + '<li><strong style="color:var(--accent)">Monitoring &amp; Compliance:</strong> Deployed Wazuh SIEM correlating 50K+ events/day across multi-cloud, achieving SOC 2 compliance through automated controls and continuous audit trails.</li></ul>' },
  cryptogen: { title:'cryptogen-nepal.md', body:
    '<div class="exp-block" style="border-color:var(--accent2)"><div class="exp-title">CyberSecurity Engineer</div><div class="exp-co" style="color:var(--accent2)">CryptoGen Nepal &mdash; Kathmandu</div><div class="exp-date">Sept 2019 &ndash; Mar 2021</div></div>'
    + '<ul style="margin:10px 0 10px 16px;font-size:11px;color:#8899aa;line-height:2">'
    + '<li>Conducted 40+ penetration tests on web apps, APIs, internal networks</li>'
    + '<li>Developed custom exploit scripts and scanning tools in Python</li>'
    + '<li>Threat modeling and security architecture reviews for fintech clients</li>'
    + '<li>Implemented IDS reducing mean time to detect by 45%</li>'
    + '<li>Authored vulnerability assessment reports for C-suite</li></ul>' },
  skills_cloud: { title:'cloud-platforms.md', body:
    '<div class="skill-list"><span class="sk">AWS</span><span class="sk">Azure</span><span class="sk">GCP</span><span class="sk">Terraform</span><span class="sk">CloudFormation</span><span class="sk">Ansible</span><span class="sk">Pulumi</span></div>' },
  skills_sec: { title:'security-tools.md', body:
    '<div class="skill-list"><span class="sk">Nmap</span><span class="sk">Metasploit</span><span class="sk">Burp Suite</span><span class="sk">Nikto</span><span class="sk">SQLMap</span><span class="sk">Hashcat</span><span class="sk">Wireshark</span><span class="sk">John</span><span class="sk">Gobuster</span><span class="sk">OWASP ZAP</span></div>' },
  skills_devops: { title:'devops-stack.md', body:
    '<div class="skill-list"><span class="sk">Docker</span><span class="sk">Kubernetes</span><span class="sk">Jenkins</span><span class="sk">GitHub Actions</span><span class="sk">GitLab CI</span><span class="sk">ArgoCD</span><span class="sk">Helm</span></div>' },
  skills_siem: { title:'siem-monitoring.md', body:
    '<div class="skill-list"><span class="sk">Wazuh</span><span class="sk">ELK Stack</span><span class="sk">Splunk</span><span class="sk">Grafana</span><span class="sk">Prometheus</span><span class="sk">Snort</span><span class="sk">Suricata</span></div>' },
  skills_code: { title:'scripting.md', body:
    '<div class="skill-list"><span class="sk">Python</span><span class="sk">Bash</span><span class="sk">Go</span><span class="sk">HCL</span><span class="sk">YAML</span><span class="sk">PowerShell</span></div>' },
  readme: { title:'README.md', body:
    '<p>Security Engineer | DevOps Lead | Ethical Hacker</p><br>'
    + '<p style="color:#8899aa">5+ years securing cloud infrastructure, leading red-team ops, and shipping hardened CI/CD pipelines. Deep interest in low-level systems programming, exploit development, and AI security. Passionate about breaking things to build them better.</p><br>'
    + '<p style="color:var(--green)">&#9679; Available for opportunities</p>' },
};

function showFolderGrid() {
  document.getElementById('fm-grid-view').style.display = 'grid';
  document.getElementById('fm-detail-view').style.display = 'none';
  document.getElementById('fm-path-text').textContent = '/home/saroj';
  document.getElementById('files-title').textContent = 'Files — /home/saroj';
}
function openFolder(name) {
  var fd = folderData[name]; if (!fd) return;
  document.getElementById('fm-grid-view').style.display = 'none';
  var dv = document.getElementById('fm-detail-view');
  dv.style.display = 'flex'; dv.style.flexDirection = 'column';
  document.getElementById('fm-path-text').textContent = fd.path;
  document.getElementById('fc-path-label').textContent = fd.title;
  document.getElementById('files-title').textContent = 'Files — ' + fd.path;
  var fc = document.getElementById('fc-content'); fc.innerHTML = '';
  var list = document.createElement('div'); list.className = 'fc-list';
  fd.files.forEach(function(f){
    var row = document.createElement('div'); row.className = 'fc-file';
    row.innerHTML = '<span class="ff-ico">' + esc(f.ico) + '</span><span class="ff-name">' + esc(f.name) + '</span><span class="ff-size">' + esc(f.size) + '</span><span class="ff-date">' + esc(f.date) + '</span>';
    if (f.content) row.ondblclick = function(){ previewFile(f.content); };
    list.appendChild(row);
  });
  fc.appendChild(list);
}
function previewFile(key) {
  var fc2 = fileContents[key]; if (!fc2) return;
  document.getElementById('fm-grid-view').style.display = 'none';
  var dv = document.getElementById('fm-detail-view');
  dv.style.display = 'flex'; dv.style.flexDirection = 'column';
  document.getElementById('fm-path-text').textContent = '/home/saroj/' + fc2.title;
  document.getElementById('fc-path-label').textContent = fc2.title;
  var fc = document.getElementById('fc-content'); fc.innerHTML = '';
  var prev = document.createElement('div'); prev.className = 'file-preview';
  prev.innerHTML = '<div class="fp-title">' + esc(fc2.title) + '</div>' + fc2.body;
  fc.appendChild(prev);
}

// ── SECURITY LOG ─────────────────────────────────────────
var secEvents = [
  { t:'warn', m:'Port scan detected from 192.168.1.x — blocked by iptables' },
  { t:'ok',   m:'Wazuh: File integrity check passed — 0 changes' },
  { t:'ok',   m:'Fail2ban: Banned IP 10.0.0.42 after 5 failed SSH attempts' },
  { t:'warn', m:'Anomalous outbound traffic — investigated & cleared' },
  { t:'ok',   m:'SSL certificates renewed successfully' },
  { t:'ok',   m:'CVE-2024-3094 checked — NOT vulnerable' },
  { t:'threat',m:'Brute force attempt on /admin — honeypot triggered' },
  { t:'ok',   m:'Vulnerability scan complete — 0 critical findings' },
];
var secIdx = 0;
function addSecLog() {
  var log = document.getElementById('sec-log'), ev = secEvents[secIdx++ % secEvents.length];
  var colors = { ok:'var(--green)', warn:'var(--orange)', threat:'var(--red)' };
  var d = document.createElement('div');
  d.style.cssText = 'color:' + (colors[ev.t]||'var(--text)') + ';border-bottom:1px solid rgba(255,255,255,.04);padding:2px 0';
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + ev.m;
  log.appendChild(d); log.scrollTop = 9999;
  if (log.children.length > 8) log.removeChild(log.firstChild);
}
setInterval(addSecLog, 4000);

// ── TOAST ALERTS ────────────────────────────────────────
var toastQueue = [
  { t:'threat', m:'⚠ Intrusion attempt detected — blocked', d:3500 },
  { t:'ok', m:'✓ Wazuh: Integrity check passed', d:3000 },
  { t:'warn', m:'⚡ High CPU on monitoring agent', d:3000 },
  { t:'info', m:'ℹ CVE-2024-9999 — patch available', d:3500 },
  { t:'ok', m:'✓ SSH login: saroj@192.168.1.1', d:3000 },
  { t:'threat', m:'⚠ SQL injection attempt — sanitized', d:3500 },
  { t:'info', m:'ℹ Nmap scan complete: 3 open ports', d:3000 },
];
var tqi = 0;
function showToast() {
  var q = toastQueue[tqi++ % toastQueue.length];
  var stack = document.getElementById('alert-stack');
  var div = document.createElement('div'); div.className = 'alert-toast ' + q.t;
  div.innerHTML = '<span class="toast-ico">' + (q.t==='threat'?'🚨':q.t==='ok'?'✅':q.t==='warn'?'⚡':'ℹ️') + '</span><span>' + q.m + '</span>';
  stack.appendChild(div);
  setTimeout(function(){ if(div.parentNode) div.parentNode.removeChild(div); }, q.d);
}
setTimeout(function(){ showToast(); setInterval(showToast, 7000); }, 3500);

// ── TERMINAL ────────────────────────────────────────────
var tOut = document.getElementById('term-out'), tIn = document.getElementById('term-in');
var tcmds = [], tcix = -1;
function tadd(txt, cls) {
  var s = document.createElement('span'); s.className = 'tl ' + (cls||'out');
  s.textContent = txt; tOut.appendChild(s);
  var br = document.createElement('br'); tOut.appendChild(br);
  tOut.scrollTop = 9999;
}
var CMDS = {
  whoami: function(){ return [['saroj',''],[' > Name   : Saroj Khadka','dim'],[' > Role   : Security & DevOps Engineer','dim'],[' > Exp    : 5+ Years','dim'],[' > Email  : hellosarojkhadka@gmail.com','dim'],[' > GitHub : github.com/Saroj345','dim'],[' > Blog   : saroj345.github.io/blog','dim'],[' > Certs  : CEH Practical · CNSS · AWS','dim'],[' > Status : AVAILABLE','ok']]; },
  help: function(){ return [['',''],['  AVAILABLE COMMANDS','dim'],['  ─────────────────────────────────────','dim'],['  whoami     —  display identity & contact info','out'],['  skills     —  list technical skills','out'],['  certs      —  show certifications','out'],['  experience —  career timeline','out'],['  contact    —  get contact info','out'],['  nmap       —  run port scan (usage: nmap <target>)','out'],['  scan       —  run vulnerability scan','out'],['  cve        —  query CVE database','out'],['  netstat    —  show open ports','out'],['  ifconfig   —  show network interfaces','out'],['  ps         —  list running processes','out'],['  ls         —  list home directory','out'],['  uptime     —  show system uptime','out'],['  hack       —  run hack simulation','out'],['  banner     —  show ascii art banner','out'],['  clear      —  clear terminal','out'],['  ─────────────────────────────────────','dim'],['','']]; },
  ls: function(){ return [['experience/  skills/  tools/  reports/  configs/  certs/  README.md','out']]; },
  pwd: function(){ return [['/home/saroj','out']]; },
  uptime: function(){ return [['up 5+ years, security hardened, 0 critical vulnerabilities','ok']]; },
  blog: function(){
    openLink('https://saroj345.github.io/blog');
    return [['Opening saroj345.github.io/blog ...','ok'],['> 200 OK · Welcome to my blog','ok'],['> Security insights & DevOps deep-dives','dim']];
  },
  contact: function(){
    return [['',''],['  CONTACT CHANNELS','dim'],['  ─────────────────────────────','dim'],['  EMAIL    : hellosarojkhadka@gmail.com','out'],['  LINKEDIN : linkedin.com/in/sarojkhadka','out'],['  GITHUB   : github.com/Saroj345','out'],['  BLOG     : saroj345.github.io/blog','out'],['  LOCATION : Kathmandu, Nepal 🇳🇵','out'],['  ─────────────────────────────','dim'],['','']];
  },
  experience: function(){
    return [['',''],['  EXPERIENCE','dim'],['  ─────────────────────────────────────────────────','dim'],['  Security & DevOps Engineer @ Zakipoint Health','ok'],['  Duration : 2021 — Present (3+ years)','out'],['  ─────────────────────────────────────────────────','dim'],['  Security Engineer @ CryptoGen Nepal','ok'],['  Duration : 2019 — 2021 (2 years)','out'],['  ─────────────────────────────────────────────────','dim'],['','']];
  },
  skills: function(){ return [['',''],['  SKILL MATRIX','dim'],['  ──────────────────────────────────────────────','dim'],['  CLOUD      : AWS · Azure · GCP · Terraform · CloudFormation','out'],['  SECURITY   : PenTest · VAPT · Red-Team · Threat-Modeling · Zero-Trust','out'],['  AI SEC     : LLM Security · Prompt Injection · Model Hardening · AI Red-Team','out'],['  AUTOMATION : Python · Bash · Ansible · CI/CD · IaC · Scripting Pipelines','out'],['  DEVOPS     : Docker · Kubernetes · Jenkins · GitHub-Actions · ArgoCD','out'],['  SIEM       : Wazuh · ELK · Splunk · Grafana · Prometheus · Snort','out'],['  LOW-LEVEL  : C · Assembly · Memory Exploitation · Buffer Overflows · Reverse Eng','out'],['  EXPLOITS   : CVE Research · PoC Dev · Shellcode · ROP Chains · CTF','out'],['  MISSION    : Critical Systems · High Availability · Fault Tolerance · RTOS · Safety','out'],['  CODE       : Python · Bash · Go · C · HCL · YAML · PowerShell','out'],['  ──────────────────────────────────────────────','dim'],['  [!] Deep interest: low-level systems & exploit development','ok'],['  [!] Exploring: AI/ML security & adversarial attacks','ok'],['  [!] Learning: mission critical systems & high-availability design','ok'],['','']]; },
  certs: function(){ return [['[✓] CEH Practical v11      — EC-Council  2022','ok'],['[✓] CNSS                   — ICSI        2021','ok'],['[✓] AWS Cloud Practitioner — Amazon      2021','ok']]; },
  nmap: function(a){ return [['Starting Nmap 7.94 — https://nmap.org','dim'],['Scanning '+((a&&a[0])||'localhost')+' ...','dim'],['PORT     STATE  SERVICE  VERSION','out'],['22/tcp   open   ssh      OpenSSH 9.3','ok'],['80/tcp   open   http     nginx/1.25.3','out'],['443/tcp  open   https    nginx/1.25.3','ok'],['Nmap done: 1 IP address scanned in 2.14s','dim']]; },
  scan: function(){ return [['[*] Running vulnerability scan...','dim'],['[✓] CVE-2024-1001: NOT VULNERABLE','ok'],['[✓] CVE-2024-2042: NOT VULNERABLE','ok'],['[!] CVE-2023-3817:  PATCHED','out'],['[✓] CVE-2024-9999: NOT VULNERABLE','ok'],['[✓] Scan complete — 0 critical findings','ok']]; },
  cve: function(a){ return [['CVE Database Query: '+(a&&a[0]||'latest'),'dim'],['[HIGH]   CVE-2024-3094 — xz backdoor (patched)','warn'],['[MEDIUM] CVE-2024-1234 — OpenSSL (patched)','out'],['[INFO]   CVE-2024-5678 — nginx log disclosure (patched)','dim']]; },
  netstat: function(){ return [['Proto  Local Address       State','dim'],['tcp    0.0.0.0:22          LISTEN','out'],['tcp    0.0.0.0:443         LISTEN','ok'],['tcp    127.0.0.1:5601      LISTEN','out'],['tcp    127.0.0.1:9200      LISTEN','out']]; },
  ifconfig: function(){ return [['eth0: inet 192.168.1.100  netmask 255.255.255.0','out'],['      RX packets 1,337,420  TX packets 892,445','dim']]; },
  ps: function(){ return [['PID   USER   COMMAND','dim'],['1337  saroj  wazuh-agentd','ok'],['1338  saroj  filebeat','ok'],['1339  saroj  metricbeat','ok'],['1340  root   sshd','out']]; },
  hack: function(){ return [['> Initializing exploit framework...','dim'],['> Loading Metasploit modules...','dim'],['> Target: localhost [CONTROLLED ENVIRONMENT]','out'],['> CVE-2024-DEMO — PoC running...','warn'],['> Session opened: meterpreter x86_64/linux','ok'],['> hashdump: [REDACTED FOR DEMO]','dim'],['> This is a controlled demo. Real pentests require authorization.','dim']]; },
  banner: function(){ return [['  _____  _   _  _____  _____  ___   ___','out'],['  \\__  \\| | | ||  _  || _ || . | / _ \\','out'],['    / / |_| | || | | ||/ \\| |  .`_/ /','out'],['   /_/  \\___/ |_| |_||_|\\_/ |_|\\___|','out'],['',''],['  SAROJ KHADKA — SECURITY ENGINEER','ok'],['  5+ YRS | CEH | AWS | CNSS','dim']]; },
  clear: function(){ tOut.innerHTML=''; return []; },
};
// boot messages
[['┌─────────────────────────────────────────────────┐','sys'],
 ['│   SAROJ-OS Security Terminal v6.1.0-hardened    │','sys'],
 ['│   Kernel: linux-sec | Firewall: ACTIVE          │','sys'],
 ['└─────────────────────────────────────────────────┘','sys'],
 ['Type "help" for commands. Try "nmap", "scan", "hack"','dim'],['','']
].forEach(function(l){ tadd(l[0],l[1]); });

function trun(cmd) {
  var parts = cmd.trim().split(/\s+/), t = parts[0].toLowerCase(), args = parts.slice(1);
  tadd('saroj@saroj-os:~$ ' + cmd, 'inp');
  if (!t) return;
  var fn = CMDS[t];
  if (fn) { (fn(args)||[]).forEach(function(l){ tadd(l[0],l[1]||'out'); }); }
  else { tadd("bash: " + t + ": command not found. Type 'help'.", 'err'); }
  tadd('','');
}
tIn.addEventListener('keydown', function(e){
  if (e.key==='Enter') { var v=tIn.value; if(v.trim()){tcmds.unshift(v);tcix=-1;} trun(v); tIn.value=''; }
  else if (e.key==='ArrowUp') { e.preventDefault(); tcix=Math.min(tcix+1,tcmds.length-1); tIn.value=tcmds[tcix]||''; }
  else if (e.key==='ArrowDown') { e.preventDefault(); tcix=Math.max(tcix-1,-1); tIn.value=tcix===-1?'':tcmds[tcix]||''; }
});


// ── CONTACT HELPERS ─────────────────────────────────────
function ccopy(txt, eid) {
  var el = document.getElementById(eid);
  if (navigator.clipboard) { navigator.clipboard.writeText(txt); }
  else { var t = document.createElement('textarea'); t.value=txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
  if (el) { el.style.display='inline'; setTimeout(function(){ el.style.display='none'; }, 2000); }
}
function openLink(url) {
  // Whitelist only safe protocols — prevent javascript: / data: injection
  if(typeof url !== 'string') return;
  var safe = /^https?:\/\//i;
  if(!safe.test(url)) { console.warn('Blocked unsafe URL:', url); return; }
  var a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer'; // prevent tab-napping
  a.click();
}


// ── VOICE PLAYER ─────────────────────────────────────────
var vpAudio = new Audio('intro.mp3');
var vpPlaying = false;
var vpBars = [];
var vpAnimFrame = null;

// build waveform bars
(function(){
  var wf = document.getElementById('vp-waveform');
  if(!wf) return;
  var barCount = 48;
  // pre-generate random heights for static waveform look
  var heights = [];
  for(var i=0;i<barCount;i++){
    heights.push(4 + Math.random()*20);
  }
  for(var i=0;i<barCount;i++){
    var b = document.createElement('div');
    b.className = 'vp-bar';
    b.style.height = heights[i] + 'px';
    b.dataset.idx = i;
    b.dataset.total = barCount;
    wf.appendChild(b);
    vpBars.push(b);
  }
  // click to seek
  wf.addEventListener('click', function(e){
    var rect = wf.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    if(vpAudio.duration) vpAudio.currentTime = pct * vpAudio.duration;
  });
})();

vpAudio.addEventListener('loadedmetadata', function(){
  vpUpdateTime();
});

vpAudio.addEventListener('timeupdate', function(){
  vpUpdateTime();
  vpUpdateBars();
});

vpAudio.addEventListener('ended', function(){
  vpPlaying = false;
  document.getElementById('vp-play').textContent = '▶';
  vpBars.forEach(function(b){ b.classList.remove('active'); b.style.animation=''; });
});

function vpToggle(){
  if(vpPlaying){
    vpAudio.pause();
    vpPlaying = false;
    document.getElementById('vp-play').textContent = '▶';
    vpBars.forEach(function(b){ b.classList.remove('active'); b.style.animation=''; });
  } else {
    vpAudio.play();
    vpPlaying = true;
    document.getElementById('vp-play').textContent = '⏸';
  }
}

function vpUpdateTime(){
  var el = document.getElementById('vp-time');
  if(!el) return;
  var cur = vpAudio.currentTime||0;
  var dur = vpAudio.duration||0;
  el.textContent = vpFmt(cur) + ' / ' + vpFmt(dur);
}

function vpFmt(s){
  var m = Math.floor(s/60);
  var sec = Math.floor(s%60);
  return m+':'+(sec<10?'0':'')+sec;
}

function vpUpdateBars(){
  if(!vpPlaying || !vpAudio.duration) return;
  var pct = vpAudio.currentTime / vpAudio.duration;
  var activeIdx = Math.floor(pct * vpBars.length);
  vpBars.forEach(function(b, i){
    if(i < activeIdx){
      b.classList.add('active');
      b.style.animation = '';
    } else if(i === activeIdx || i === activeIdx+1){
      b.classList.add('active');
      b.style.animation = 'bar-dance 0.3s ease-in-out infinite';
      b.style.animationDelay = (i%3*0.1)+'s';
    } else {
      b.classList.remove('active');
      b.style.animation = '';
    }
  });
}

// ── LOCK SCREEN ─────────────────────────────────────────
function lockScreen() {
  var lock = document.createElement('div');
  lock.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-family:JetBrains Mono';
  lock.innerHTML = '<div style="font-size:48px;margin-bottom:12px">🔒</div>'
    + '<div style="font-family:Orbitron;font-size:20px;color:var(--accent);letter-spacing:4px;margin-bottom:8px">SAROJ-OS</div>'
    + '<div style="font-size:12px;color:var(--muted);letter-spacing:2px">SCREEN LOCKED — CLICK TO UNLOCK</div>';
  lock.onclick = function(){ document.body.removeChild(lock); };
  document.body.appendChild(lock);
  hideCtx();
}

// 
// ── INIT DESKTOP (after boot) ───────────────────────────
function initDesktop() {
  // ── System boot sequence then desktop reveal ──
  var sbo = document.getElementById('sys-boot');
  sbo.classList.add('booting');

  var bootLines = [
    '[  OK  ] Starting SAROJ-OS kernel...',
    '[  OK  ] Mounting encrypted filesystems...',
    '[  OK  ] Loading iptables firewall rules...',
    '[  OK  ] Wazuh SIEM agent: active',
    '[  OK  ] Threat detection engine: online',
    '[  OK  ] Loading user profile: saroj',
    '[ INIT ] Launching desktop environment...',
    '[  ✓   ] All systems operational.',
  ];

  var lineContainer = document.getElementById('sbo-lines');
  var fill = document.getElementById('sbo-fill');
  var li = 0;

  function nextLine() {
    if(li >= bootLines.length) {
      fill.style.width = '100%';
      setTimeout(revealDesktop, 500);
      return;
    }
    var d = document.createElement('div');
    d.className = 'sbo-line';
    d.textContent = bootLines[li];
    lineContainer.appendChild(d);
    setTimeout(function(){ d.classList.add('vis'); }, 30);
    fill.style.width = Math.round((li+1)/bootLines.length*100) + '%';
    li++;
    setTimeout(nextLine, 180 + Math.random()*120);
  }
  nextLine();

  function revealDesktop() {
    // fade out boot overlay
    sbo.style.transition = 'opacity .6s';
    sbo.style.opacity = '0';
    setTimeout(function(){ sbo.style.display='none'; }, 600);

    // slide taskbar up
    setTimeout(function(){ document.getElementById('taskbar').classList.add('up'); }, 100);

    // drop desktop icons one by one
    var icons = document.querySelectorAll('.desk-icon');
    icons.forEach(function(ic, i){
      setTimeout(function(){ ic.classList.add('landed'); }, 200 + i*80);
    });

    // open about window with entrance animation
    setTimeout(function(){
      openWin('win-about');
      var w = document.getElementById('win-about');
      if(w) w.classList.add('entering');
      setTimeout(function(){ if(w) w.classList.remove('entering'); }, 300);
    }, 600);

    // show welcome notification
    setTimeout(function(){
      var notif = document.getElementById('welcome-notif');
      var now = new Date();
      document.getElementById('wn-sub').textContent =
        'Logged in ' + now.toLocaleTimeString() + ' · All defenses active 🛡️';
      notif.classList.add('show');
      setTimeout(function(){ notif.classList.remove('show'); }, 2000);
    }, 900);

    // show clock widget
    setTimeout(function(){
      document.getElementById('clock-widget').classList.add('show');
      updateClockWidget();
    }, 800);

    // show visitor badge
    setTimeout(function(){
      var vb = document.getElementById('visitor-badge');
      vb.classList.add('show');
      var now = new Date();
      document.getElementById('vb-time').textContent = '⏰ ' + now.toLocaleTimeString();
      document.getElementById('vb-session').textContent = '📅 ' + now.toLocaleDateString();
      startSessionTimer();
    }, 1000);

    // start security log
    addSecLog();

    // random threat toast after 3s
    setTimeout(function(){ showToast(); setInterval(showToast, 9000); }, 3000);

    // start cursor trail
    initCursor();
  }
}

// ── CLOCK WIDGET ────────────────────────────────────────────
var sessionStart = null;
function updateClockWidget() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2,'0');
  var m = String(now.getMinutes()).padStart(2,'0');
  var s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('cw-time').textContent = h+':'+m+':'+s;
  document.getElementById('cw-date').textContent =
    now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) + ' · KTM UTC+5:45';
  if(sessionStart){
    var diff = Math.floor((now-sessionStart)/1000);
    var sm=String(Math.floor(diff/60)).padStart(2,'0'), ss=String(diff%60).padStart(2,'0');
    document.getElementById('cw-uptime').textContent = 'SESSION: '+sm+':'+ss;
  }
  setTimeout(updateClockWidget, 1000);
}

function startSessionTimer() {
  sessionStart = new Date();
}

// ── CURSOR TRAIL ─────────────────────────────────────────────
function initCursor() {
  var dot = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var mx=0, my=0;
  document.addEventListener('mousemove', function(e){
    mx=e.clientX; my=e.clientY;
    dot.style.left = (mx-3)+'px';
    dot.style.top  = (my-3)+'px';
    ring.style.left = mx+'px';
    ring.style.top  = my+'px';
  });
  // click ripple
  document.addEventListener('click', function(e){
    var r = document.createElement('div');
    r.style.cssText = 'position:fixed;left:'+(e.clientX-20)+'px;top:'+(e.clientY-20)+'px;'
      +'width:40px;height:40px;border-radius:50%;border:2px solid #00ff41;'
      +'pointer-events:none;z-index:9999;animation:ring-pulse 0.5s ease forwards;opacity:.8';
    document.body.appendChild(r);
    setTimeout(function(){ if(r.parentNode) r.parentNode.removeChild(r); }, 500);
  });
}
