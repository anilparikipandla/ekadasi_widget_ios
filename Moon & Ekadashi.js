// Moon & Ekadashi • Mandala layout v6 • Hyderabad • Scriptable home-screen widget
// Calendar dates: thetelugucalendar.com/ekadashi/{year}/hyderabad/
// Alternate dates: Drik Panchang's Hyderabad Telugu calendar.
// Offline astronomy is approximate; do not use it to determine a fasting date.

const CALENDAR = [
['2026-01-14','Shattila'],['2026-01-29','Jaya'],['2026-02-13','Vijaya'],['2026-02-27','Amalaki'],['2026-03-15','Papamochani'],['2026-03-29','Kamada'],['2026-04-13','Varuthini'],['2026-04-27','Mohini'],['2026-05-13','Apara'],['2026-05-27','Padmini'],['2026-06-11','Parama'],['2026-06-25','Nirjala'],['2026-07-10','Yogini'],['2026-07-25','Tholi'],['2026-08-09','Kamika'],['2026-08-23','Shravana Putrada','2026-08-24'],['2026-09-07','Aja'],['2026-09-22','Parivartini'],['2026-10-06','Indira'],['2026-10-22','Papankusha'],['2026-11-05','Rama'],['2026-11-20','Prabodhini','2026-11-21'],['2026-12-04','Utpanna'],['2026-12-20','Mokshada'],
['2027-01-03','Saphala'],['2027-01-18','Pausha Putrada','2027-01-19'],['2027-02-02','Shattila'],['2027-02-17','Jaya'],['2027-03-04','Vijaya'],['2027-03-18','Amalaki'],['2027-04-02','Papamochani'],['2027-04-17','Kamada'],['2027-05-02','Varuthini'],['2027-05-16','Mohini'],['2027-06-01','Apara'],['2027-06-14','Nirjala'],['2027-06-30','Yogini'],['2027-07-14','Tholi'],['2027-07-29','Kamika','2027-07-30'],['2027-08-12','Shravana Putrada'],['2027-08-28','Aja'],['2027-09-11','Parivartini'],['2027-09-26','Indira'],['2027-10-11','Papankusha'],['2027-10-25','Rama','2027-10-26'],['2027-11-10','Prabodhini'],['2027-11-24','Utpanna'],['2027-12-09','Mokshada'],['2027-12-23','Saphala']
];
// Sunrise dates independently cross-checked against Panchvani, Hyderabad.
// The default is the primary date; overrides capture repeated and skipped sunrises.
const SUNRISE_OVERRIDES = {
  '2026-05-27':['2026-05-26','2026-05-27'],
  '2026-07-10':[], '2026-11-20':['2026-11-21'],
  '2027-01-18':['2027-01-19'],
  '2027-03-04':['2027-03-03','2027-03-04'],
  '2027-07-29':[]
};
const SUNRISE_DATES = CALENDAR.reduce((all,e)=>{
  const dates=Object.prototype.hasOwnProperty.call(SUNRISE_OVERRIDES,e[0])?SUNRISE_OVERRIDES[e[0]]:[e[0]];
  dates.forEach(date=>all.push([date,e[1],'sunrise',e[0],e[2]||'']));
  return all;
},[]).sort((a,b)=>a[0].localeCompare(b[0]));
const BETWEEN_SUNRISES = [
  ['2026-07-10','Yogini','between','2026-07-10',''],
  ['2027-07-29','Kamika','between','2027-07-29','2027-07-30']
];
const CALENDAR_MARKS = SUNRISE_DATES.concat(BETWEEN_SUNRISES);
// Telugu amanta months by Hyderabad civil calendar day, 2026–2027.
// Source: srinivasapanchangam.com/calendar/{year}; not exact transition instants.
const MASAM_STARTS = [
 ['2026-01-01','Pushya'],['2026-01-19','Magha'],['2026-02-18','Phalguna'],['2026-03-20','Chaitra'],['2026-04-18','Vaisakha'],['2026-05-17','Adhika Jyeshtha'],['2026-06-16','Jyeshtha'],['2026-07-15','Ashadha'],['2026-08-13','Sravana'],['2026-09-12','Bhadrapada'],['2026-10-11','Ashwayuja'],['2026-11-10','Karthika'],['2026-12-09','Margasira'],
 ['2027-01-08','Pushya'],['2027-02-07','Magha'],['2027-03-09','Phalguna'],['2027-04-07','Chaitra'],['2027-05-07','Vaisakha'],['2027-06-05','Jyeshtha'],['2027-07-05','Ashadha'],['2027-08-03','Sravana'],['2027-09-01','Bhadrapada'],['2027-10-01','Ashwayuja'],['2027-10-30','Karthika'],['2027-11-29','Margasira'],['2027-12-28','Pushya']
];
function masamForDay(day) {
  if(day<'2026-01-01'||day>'2027-12-31') return 'Masam unavailable';
  let found=MASAM_STARTS[0][1];for(const item of MASAM_STARTS){if(item[0]>day)break;found=item[1];}return found+' Masam';
}
const RAD = Math.PI / 180;
const norm = n => ((n % 360) + 360) % 360;
const sin = n => Math.sin(n * RAD);
const cos = n => Math.cos(n * RAD);
// Low-precision Sun/Moon orbital elements and principal lunar perturbations.
function phaseAngle(date) {
  const d = date.getTime()/86400000 + 2440587.5 - 2451543.5;
  const w = 282.9404 + 4.70935e-5*d, e = 0.016709 - 1.151e-9*d;
  const ms = norm(356.0470 + 0.9856002585*d);
  const es = ms + (180/Math.PI)*e*sin(ms)*(1+e*cos(ms));
  const sun = norm(Math.atan2(Math.sqrt(1-e*e)*sin(es), cos(es)-e)/RAD + w);
  const N = norm(125.1228 - 0.0529538083*d), wm = norm(318.0634 + 0.1643573223*d);
  const mm = norm(115.3654 + 13.0649929509*d), em = 0.0549;
  const E = mm + (180/Math.PI)*em*sin(mm)*(1+em*cos(mm));
  const v = Math.atan2(Math.sqrt(1-em*em)*sin(E), cos(E)-em)/RAD;
  const u = v+wm, i = 5.1454;
  let moon = norm(Math.atan2(sin(N)*cos(u)+cos(N)*sin(u)*cos(i), cos(N)*cos(u)-sin(N)*sin(u)*cos(i))/RAD);
  const ls = norm(ms+w), lm = norm(N+wm+mm), D = norm(lm-ls), F = norm(lm-N);
  moon += -1.274*sin(mm-2*D)+0.658*sin(2*D)-0.186*sin(ms)-0.059*sin(2*mm-2*D)-0.057*sin(mm-2*D+ms)+0.053*sin(mm+2*D)+0.046*sin(2*D-ms)+0.041*sin(mm-ms)-0.035*sin(D)-0.031*sin(mm+ms)-0.015*sin(2*F-2*D)+0.011*sin(mm-4*D);
  return norm(moon-sun);
}
const names = ['Padyami','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima'];
function tithi(a) { const n=Math.floor(a/12); return (n<15?'Shukla ':'Krishna ')+(n===29?'Amavasya':names[n%15]); }
function phaseName(a) {
  if(a<5 || a>=355) return 'New moon';
  if(a<85) return 'Waxing crescent'; if(a<95) return 'First quarter';
  if(a<175) return 'Waxing gibbous'; if(a<185) return 'Full moon';
  if(a<265) return 'Waning gibbous'; if(a<275) return 'Last quarter';
  return 'Waning crescent';
}
function istDay(date) { return new Date(date.getTime()+19800000).toISOString().slice(0,10); }
function pretty(s) { const [y,m,d]=s.split('-').map(Number); return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}`; }
function moonImage(angle) {
  const ctx=new DrawContext(); ctx.size=new Size(160,160); ctx.opaque=false; ctx.respectScreenScale=true;
  const cx=80, cy=80, r=68, k=Math.cos(angle*RAD), waxing=angle<180;
  ctx.setFillColor(new Color('#2b3036')); ctx.fillEllipse(new Rect(cx-r,cy-r,2*r,2*r));
  ctx.setFillColor(new Color('#f4edda'));
  for(let y=-r;y<=r;y+=1) { const x=Math.sqrt(Math.max(0,r*r-y*y)); const edge=k*x; const left=waxing?edge:-x, right=waxing?x:-edge; ctx.fillRect(new Rect(cx+left,cy+y,Math.max(0,right-left),1.25)); }
  return ctx.getImage();
}
// A flat, curved illustration echoing the selected B design. Its canvas is
// transparent so the surrounding widget can still use dynamic system colors.
function moonArtwork(angle) {
  const c=new DrawContext();c.size=new Size(160,130);c.opaque=false;c.respectScreenScale=true;
  const peach=new Path();peach.move(new Point(20,65));
  peach.addCurve(new Point(150,0),new Point(25,25),new Point(70,0));
  peach.addLine(new Point(160,0));peach.addLine(new Point(160,130));
  peach.addLine(new Point(150,130));peach.addCurve(new Point(20,65),new Point(70,130),new Point(25,105));
  peach.closeSubpath();c.addPath(peach);c.setFillColor(new Color('#ffb7a4'));c.fillPath();
  const navy=new Path();navy.move(new Point(20,65));
  navy.addCurve(new Point(160,12),new Point(35,34),new Point(90,8));
  navy.addLine(new Point(160,118));navy.addCurve(new Point(20,65),new Point(90,122),new Point(35,96));
  navy.closeSubpath();c.addPath(navy);c.setFillColor(new Color('#172f59'));c.fillPath();
  c.drawImageInRect(moonImage(angle),new Rect(72,31,68,68));return c.getImage();
}
// Finds the next 0° or 180° phase boundary using the same approximate model.
function nextLunarEvent(now) {
  let left=now.getTime(), a=phaseAngle(now);
  for(let i=0;i<160;i++) {
    const right=left+6*60*60*1000, b=phaseAngle(new Date(right));
    let target=null;
    if(a<180 && b>=180) target=180;
    else if(a>300 && b<60) target=360;
    if(target!==null) {
      let lo=left, hi=right;
      for(let j=0;j<32;j++) {
        const mid=(lo+hi)/2; let v=phaseAngle(new Date(mid));
        if(target===360 && v<180) v+=360;
        if(v<target) lo=mid; else hi=mid;
      }
      return {kind:target===180?'Pournami':'Amavasya',date:new Date((lo+hi)/2)};
    }
    left=right; a=b;
  }
  return null;
}
// Calendar markers represent approximate astronomical instants, not tithi observances.
function lunarEventsForCalendar(){
  const result=[];let cursor=new Date('2025-12-31T18:30:00Z');
  const end=new Date('2027-12-31T18:30:00Z');
  for(let i=0;i<60;i++){
    const e=nextLunarEvent(cursor);if(!e || e.date>=end)break;
    const day=istDay(e.date);if(day>='2026-01-01')result.push([day,e.kind]);
    cursor=new Date(e.date.getTime()+60*60*1000);
  }
  return result;
}
function phaseShort(a) {
  if(a>=90 && a<175 || a>=185 && a<270) return 'Gibbous';
  if(a>=175 && a<185) return 'Pournami';
  if(a<5 || a>=355) return 'Amavasya';
  return 'Chandrudu';
}
const C = {
  bg: Color.dynamic(new Color('#f4f0e8'), new Color('#171c21')),
  ink: Color.dynamic(new Color('#252b30'), new Color('#f4edda')),
  muted: Color.dynamic(new Color('#687078'), new Color('#b7bcb9')),
  gold: Color.dynamic(new Color('#91601f'), new Color('#dfb97d')),
  line: Color.dynamic(new Color('#d4c9b8'), new Color('#545b59')),
};
function label(stack, value, size, color, bold=false) {
  const t=stack.addText(value); t.font=bold?Font.boldSystemFont(size):Font.systemFont(size);
  t.textColor=color; t.lineLimit=1; t.minimumScaleFactor=0.65; return t;
}
function separator(w) { const line=w.addStack(); line.size=new Size(0,1); line.backgroundColor=C.line; }
function calendarHTML(today) {
  // The calendar runs entirely inside the local web view; no network requests.
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><style>
  :root{color-scheme:light dark;--bg:#f4f0e8;--panel:#fffdf8;--ink:#252b30;--muted:#6e7577;--accent:#986721;--soft:#ece1ce;--line:#ded6ca}
  @media(prefers-color-scheme:dark){:root{--bg:#171c21;--panel:#252c30;--ink:#f4edda;--muted:#adb4b0;--accent:#e1bc80;--soft:#51432f;--line:#414a49}}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:calc(84px + env(safe-area-inset-top, 0px)) 20px 48px}main{max-width:600px;margin:auto}.eyebrow{color:var(--accent);font-size:11px;font-weight:700;letter-spacing:.15em}h1{font-family:Georgia,serif;font-size:34px;font-weight:400;margin:8px 0 5px}.intro{color:var(--muted);font-size:13px;line-height:1.5;margin:0 0 20px}.nav{display:flex;gap:10px;align-items:center;margin:0 0 16px}.nav button{font-size:19px;width:44px;height:42px}.nav .today{font-size:13px;width:auto;padding:0 15px;margin-left:auto}button{font:inherit;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:14px;cursor:pointer;transition:transform .16s ease,background .16s ease}button:active{transform:scale(.91);background:var(--soft)}button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.month{background:var(--panel);border:1px solid var(--line);border-radius:21px;padding:18px;margin-bottom:12px;animation:appear .25s ease}h2{font-family:Georgia,serif;font-size:22px;font-weight:400;margin:0 0 14px}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.weekday{text-align:center;color:var(--muted);font-size:11px;padding:3px 0 7px}.day,.blank{aspect-ratio:1;min-width:0}.day{border:1px solid transparent;background:transparent;border-radius:50%;font-size:14px;position:relative}.day.mark{background:var(--soft);font-weight:700;color:var(--accent)}.day.between{border:1px dashed var(--accent);color:var(--accent)}.day.fullmoon::after,.day.newmoon::after{content:"";position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:6px;height:6px;border:1.5px solid var(--ink);border-radius:50%}.day.fullmoon::after{background:var(--ink)}.day.current{border-color:var(--accent)}.day.selected{box-shadow:0 0 0 2px var(--accent)}.detail{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:17px 18px;margin-top:16px;min-height:93px}.detail strong{display:block;font-size:15px;margin-bottom:5px}.detail p{font-size:13px;line-height:1.5;color:var(--muted);margin:0}.legend{font-size:12px;line-height:1.6;color:var(--muted);margin:16px 2px}.pill{color:var(--accent);font-weight:700}@keyframes appear{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.petal{display:inline-block;color:var(--accent);margin-left:8px;animation:petal-fall 2.5s ease-in-out infinite alternate}@keyframes petal-fall{from{transform:translateY(-3px) rotate(-12deg)}to{transform:translateY(5px) rotate(18deg)}}.flower-layer{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:5}.falling-flower{position:absolute;top:-30px;color:var(--accent);opacity:0;font-size:15px;animation:flower-fall 7s ease-in forwards}.falling-flower:nth-child(1){left:4%;animation-delay:.4s}.falling-flower:nth-child(2){left:9%;animation-delay:2.7s}.falling-flower:nth-child(3){left:15%;animation-delay:5s}.falling-flower:nth-child(4){left:21%;animation-delay:7.3s}@keyframes flower-fall{0%{opacity:0;transform:translateY(0) rotate(0)}8%{opacity:.65}85%{opacity:.65}100%{opacity:.65;transform:translateY(calc(100vh - 25px)) rotate(150deg)}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.flower-layer{display:none}}
  </style></head><body>${SUNRISE_DATES.some(e=>e[0]===today)?'<div class="flower-layer" aria-hidden="true"><span class="falling-flower">✿</span><span class="falling-flower">✿</span><span class="falling-flower">✿</span><span class="falling-flower">✿</span></div>':''}<main><div class="eyebrow">LUNA / HYDERABAD</div><h1>Ekadashi calendar${SUNRISE_DATES.some(e=>e[0]===today)?'<span class="petal" aria-hidden="true">✿</span>':''}</h1><p class="intro">Two months at a glance · Dates in India Standard Time</p><div class="nav"><button id="prev" aria-label="Previous month">‹</button><button id="next" aria-label="Next month">›</button><button id="today" class="today">Today</button></div><div id="months"></div><div class="detail" id="detail" aria-live="polite"><strong>Select a date</strong><p>Tap a highlighted day to see the observance.</p></div><p class="legend"><span class="pill">●</span> Highlight: Ekadashi at sunrise · Dashed circle: between sunrises.<br>Small filled dot: full Moon · Hollow dot: new Moon (astronomical dates, approximate).<br>Data covers 2026–2027. Confirm observance and parana with your panchangam.</p></main><script>
  const events=${JSON.stringify(CALENDAR_MARKS)}, lunar=${JSON.stringify(lunarEventsForCalendar())}, today=${JSON.stringify(today)};
  let base=new Date(today+'T00:00:00Z'); base=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth(),1)); let selected='';
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function key(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')}
  function dateLabel(s){const a=s.split('-').map(Number);return a[2]+' '+months[a[1]-1]+' '+a[0]}
  function detail(s){selected=s;const event=events.find(e=>e[0]===s), moon=lunar.find(e=>e[0]===s), el=document.getElementById('detail');let title=dateLabel(s),notes=[];if(event){title=event[1]+' Ekadashi';notes.push(event[2]==='sunrise'?'Ekadashi is present at Hyderabad sunrise.':'Ekadashi occurs between sunrises; neither sunrise qualifies.');notes.push('Published primary date: '+dateLabel(event[3])+'.');if(event[4])notes.push('Vaishnava calendar: '+dateLabel(event[4])+'.');}if(moon)notes.push('Approximate astronomical '+(moon[1]==='Pournami'?'full Moon':'new Moon')+' on '+dateLabel(s)+' (IST). This is not necessarily the tithi observance date.');if(!event&&!moon)notes.push(s.slice(0,4)<'2026'||s.slice(0,4)>'2027'?'Calendar data is unavailable for this year.':'No marked event for this date.');el.innerHTML='<strong>'+title+'</strong><p>'+notes.join(' ')+'</p>';render()}
  function render(){const target=document.getElementById('months');target.innerHTML='';for(let n=0;n<2;n++){const date=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()+n,1)), y=date.getUTCFullYear(),m=date.getUTCMonth(), section=document.createElement('section');section.className='month';const h=document.createElement('h2');h.textContent=months[m]+' '+y;section.appendChild(h);const grid=document.createElement('div');grid.className='grid';['S','M','T','W','T','F','S'].forEach(x=>{const e=document.createElement('div');e.className='weekday';e.textContent=x;grid.appendChild(e)});for(let i=0;i<date.getUTCDay();i++){const b=document.createElement('div');b.className='blank';grid.appendChild(b)}const last=new Date(Date.UTC(y,m+1,0)).getUTCDate();for(let d=1;d<=last;d++){const s=key(y,m,d), e=events.find(x=>x[0]===s), mEvent=lunar.find(x=>x[0]===s), b=document.createElement('button');b.type='button';b.className='day'+(e&&e[2]==='sunrise'?' mark':'')+(e&&e[2]==='between'?' between':'')+(mEvent?(mEvent[1]==='Pournami'?' fullmoon':' newmoon'):'')+(s===today?' current':'')+(s===selected?' selected':'');b.textContent=d;b.setAttribute('aria-label',dateLabel(s)+(e?', '+e[1]+' Ekadashi'+(e[2]==='between'?', between sunrises':', at sunrise'):'')+(mEvent?(mEvent[1]==='Pournami'?', approximate full Moon':', approximate new Moon'):''));b.onclick=()=>detail(s);grid.appendChild(b)}section.appendChild(grid);target.appendChild(section)}}
  document.getElementById('prev').onclick=()=>{base=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()-1,1));render()};document.getElementById('next').onclick=()=>{base=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth()+1,1));render()};document.getElementById('today').onclick=()=>{const d=new Date(today+'T00:00:00Z');base=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));detail(today)};render();
  </script></body></html>`;
}
// Artwork only is rasterized. Text and background remain native widget elements
// so iOS can render the text sharply and resolve dynamic light/dark colors.
function renderMoonArt(angle) {
  const c=new DrawContext();c.size=new Size(720,318);c.opaque=false;c.respectScreenScale=true;
  const px=x=>x, py=y=>y;
  const color=(hex,alpha)=>new Color(hex,alpha===undefined?1:alpha);
  function circle(x,y,r,hex,alpha,fill){const rect=new Rect(px(x-r),py(y-r),2*r,2*r);if(fill){c.setFillColor(color(hex,alpha));c.fillEllipse(rect);}else{c.setStrokeColor(color(hex,alpha));c.setLineWidth(1);c.strokeEllipse(rect);}}
  // Do not draw mandala lines inside the clear space around the Moon. This is
  // transparent rather than painted in a light-only background color.
  function outside(x,y){return Math.hypot(x-549,y-142)>=75;}
  function poly(points,hex,alpha,width){
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3));
      for(let j=0;j<steps;j++){
        const t=j/steps,u=(j+1)/steps,x1=a[0]+(b[0]-a[0])*t,y1=a[1]+(b[1]-a[1])*t,x2=a[0]+(b[0]-a[0])*u,y2=a[1]+(b[1]-a[1])*u;
        if(outside((x1+x2)/2,(y1+y2)/2)){const path=new Path();path.move(new Point(px(x1),py(y1)));path.addLine(new Point(px(x2),py(y2)));c.addPath(path);c.setStrokeColor(color(hex,alpha));c.setLineWidth(width||1);c.strokePath();}
      }
    }
  }
  const cx=734,cy=145,r=185;
  for(const q of [0.20,0.33,0.56,0.72,0.93,1.0]){const pts=[];for(let i=0;i<=120;i++){const a=2*Math.PI*i/120;pts.push([cx+r*q*Math.cos(a),cy+r*q*Math.sin(a)]);}poly(pts,'#4e9292',.4,1);}
  for(let i=0;i<16;i++){
    const t=2*Math.PI*i/16;
    for(const cfg of [[.35,.58,30],[.22,.35,26]]){const pts=[];for(let j=0;j<cfg[2];j++){const u=j/(cfg[2]-1),rr=r*(cfg[0]+cfg[1]*Math.sin(Math.PI*u)),a=t+(u-.5)*2*Math.PI/16;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}poly(pts,'#4e9292',.4,1);}
    const pts=[[.75,0],[.86,-.08],[.98,0],[.86,.08]].map(q=>[cx+r*q[0]*Math.cos(t+q[1]),cy+r*q[0]*Math.sin(t+q[1])]);
    const tile=new Path();tile.move(new Point(px(pts[0][0]),py(pts[0][1])));for(let j=1;j<pts.length;j++)tile.addLine(new Point(px(pts[j][0]),py(pts[j][1])));tile.closeSubpath();c.addPath(tile);c.setFillColor(color(i%2?'#cd7c4c':'#18696f',.32));c.fillPath();
  }
  const radius=61.2;for(let spread=11;spread>=1;spread--)circle(551,148,radius+spread,'#202e44',.008,true);
  circle(549,142,radius,'#3d475b',1,true);
  const k=Math.cos(angle*RAD),waxing=angle<180;c.setFillColor(color('#f9f0d7'));
  for(let y=-radius;y<=radius;y+=.5){const x=Math.sqrt(Math.max(0,radius*radius-y*y)),edge=k*x,left=waxing?edge:-x,right=waxing?x:-edge;c.fillRect(new Rect(px(549+left),py(142+y),Math.max(0,right-left),.6));}
  circle(549,142,radius,'#b4a68d',1,false);return c.getImage();
}
function buildWidget(now, theme) {
  const today=istDay(now),angle=phaseAngle(now),illum=Math.round((1-cos(angle))*50),paksha=angle<180?'Shukla':'Krishna';
  const hero=tithi(angle).replace(/^(Shukla|Krishna) /,'');
  const supported=today>='2026-01-01'&&today<='2027-12-31';
  const next=supported?SUNRISE_DATES.find(e=>e[0]>=today):null,event=nextLunarEvent(now),special=!!next&&next[0]===today;
  const dynamic=(light,dark)=>Color.dynamic(new Color(light),new Color(dark));
  const ink=dynamic('#182b46','#f7efe0'),sub=dynamic('#796a6a','#c5b9ac'),accent=dynamic('#bc5d46','#edaa93');
  const w=new ListWidget();w.backgroundColor=dynamic('#fff5eb','#1a2230');w.setPadding(0,0,0,0);
  // The edge-to-edge transparent art belongs to a child stack; the native
  // dynamic background remains on its parent and the text stays native.
  const artLayer=w.addStack();artLayer.layoutVertically();artLayer.setPadding(0,0,0,0);
  artLayer.backgroundImage=renderMoonArt(angle);
  // Keep the padding on a separate child, not on the artwork layer.
  const card=artLayer.addStack();card.layoutVertically();card.setPadding(18,24,14,24);
  const body=card.addStack();body.centerAlignContent();
  const content=body.addStack();content.layoutVertically();
  function t(stack,value,size,color,bold){const x=stack.addText(value);x.font=bold?Font.boldSystemFont(size):Font.systemFont(size);x.textColor=color;x.lineLimit=1;x.minimumScaleFactor=.68;return x;}
  t(content,hero,19,ink,true);content.addSpacer(3);
  t(content,paksha+'  ·  '+masamForDay(today),10,sub,false);content.addSpacer(11);
  t(content,illum+'% '+(angle<180?'↑':'↓'),22,ink,true);
  if(special){content.addSpacer(8);t(content,'✿ EKADASHI',8,accent,true);}
  body.addSpacer();
  card.addSpacer();
  const row=card.addStack();row.centerAlignContent();
  const symbol=SFSymbol.named('calendar');if(symbol){const icon=row.addImage(symbol.image);icon.imageSize=new Size(12,12);icon.tintColor=ink;row.addSpacer(3);}
  t(row,pretty(today),12,ink,true);row.addSpacer();
  t(row,event?(event.kind==='Pournami'?'● ':'○ ')+'~'+pretty(istDay(event.date)):'○ —',12,accent,true);row.addSpacer();
  t(row,next?'✿ '+pretty(next[0]):'✿ —',12,accent,true);
  if(special){row.addSpacer(5);t(row,'✿✿',7,accent,false);}
  w.refreshAfterDate=new Date(now.getTime()+30*60*1000);const url=URLScheme.forRunningScript();w.url=url+(url.includes('?')?'&':'?')+'view=calendar';return w;
}
const now=new Date();
if(config.runsInWidget) {
  Script.setWidget(buildWidget(now));
} else {
  let showCalendar=args.queryParameters && args.queryParameters.view==='calendar';
  if(!showCalendar){
    const menu=new Alert();menu.title='Moon & Ekadashi';menu.message='Mandala layout v6';
    menu.addAction('Preview widget');menu.addAction('Preview Ekadashi');menu.addAction('Open calendar');menu.addCancelAction('Cancel');
    const choice=await menu.presentAlert();
    if(choice===0) await buildWidget(now).presentMedium();
    else if(choice===1){
      const previewEntry=SUNRISE_DATES.find(e=>e[0]>=istDay(now)) || SUNRISE_DATES[SUNRISE_DATES.length-1];
      const previewDate=new Date(previewEntry[0]+'T12:00:00+05:30');
      await buildWidget(previewDate).presentMedium();
    }
    else if(choice===2) showCalendar=true;
  }
  if(showCalendar){const view=new WebView();await view.loadHTML(calendarHTML(istDay(now)));await view.present();}
}
Script.complete();
