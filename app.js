import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://hsrfoepbcoyouvtobjhx.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcmZvZXBiY295b3V2dG9iamh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTYwMzUsImV4cCI6MjA5NDIzMjAzNX0.10GQQM59H5cm_km4Ru4d5Dz0JRXw4Zz3LU1yaNsoVkA');

// ================= НАЛАШТУВАННЯ — змінюйте тут =================
// price: функція (кількість) => ціна за 1 шт, або null = «за домовленістю»
const MATERIALS = [
  { id:'satin', n:'Атласні', note:'Квіти зі стрічок: об’ємні, з м’яким блиском і складками тканини.', price: q => q >= 25 ? 35 : 40 },
  { id:'soap',  n:'Мильні',  note:'Матові «порцелянові» квіти з тонким ароматом.', price: null /* ← впишіть, напр. q => 50 */ },
  { id:'mix',   n:'Мікс',    note:'Атлас і мило в одному букеті: контраст блиску й матовості.', price: null }
];
// Чим відрізняються (редагуйте текст під себе)
const COMPARE = [
  ['Вигляд',     'Блиск, м’які складки стрічки',      'Матові, ніби порцелянові'],
  ['Дотик',      'Легкі, шовковисті',                 'Гладкі, щільніші'],
  ['Аромат',     'Без запаху',                        'Тонкий мильний аромат'],
  ['Догляд',     'Берегти від вогню й сильного сонця', 'Берегти від води й падінь'],
  ['Ідеально для','Весілля, фотозони, великі букети', 'Подарунків, інтер’єру, акцентів']
];
// p: число = додається до суми, 0 = входить у вартість, null = «уточню окремо»
const TYPES  = [{id:'rose',n:'Троянда',s:1},{id:'peony',n:'Півонія',s:1.22},{id:'chamo',n:'Ромашка',s:.82}];
const COLORS = [['Червоний','#c8102e'],['Бордо','#6d0f2a'],['Пудровий','#e8a0b4'],['Рожевий','#f4a6c0'],['Малиновий','#d6247f'],['Персиковий','#f9a98b'],
  ['Жовтий','#f5c518'],['Кремовий','#f3e2b3'],['Білий','#fbf8f3'],['Бірюзовий','#2aa6b5'],['Лавандовий','#b39ddb'],['Синій','#2a4bd6']];
const GREENS = [
  { n:'Без зелені', p:0 },
  { n:'Евкаліпт',  p:0, c:['#86ab9b','#6a9080','#a9c6b8'] },
  { n:'Листя',     p:0, c:['#3f7a4d','#2f6240','#5a9468'] },
  { n:'Папороть',  p:0, c:['#4f8a55','#3a6f45','#6aa56f'] }
];
const EXTRAS = [
  { n:'Гіпсофіла', ic:'☁️', p:null },
  { n:'Перлини',   ic:'🤍', p:null },
  { n:'Метелики',  ic:'🦋', p:null }
];
const WRAPS = [
  { n:'Без упаковки',        ic:'',   p:0,    ribbon:false },
  { n:'Стрічка-бант',        ic:'🎀', p:0,    ribbon:'Колір стрічки' },
  { n:'Крафт-папір',         ic:'📜', p:null, ribbon:'Колір стрічки' },
  { n:'Подарункова коробка', ic:'🎁', p:null, ribbon:'Колір коробки' },
  { n:'Бокс із солодощами',  ic:'🍫', p:null, ribbon:'Колір коробки' }
];
const RIBBONS = [['Білий','#fbf8f3'],['Рожевий','#f4a6c0'],['Бордо','#6d0f2a'],['Золотий','#d9b36a'],['Чорний','#1a1a1f'],['Лавандовий','#b39ddb']];
const FALLBACK = ['tild3238-6635-4564-b164-646565383031/Flora_1.png','tild3964-3535-4030-b762-353066383963/a57e41cc-540f-4aab-9.jpg',
 'tild6239-6538-4732-a430-386230396236/photo_2025-05-18_11-.jpg','tild6533-3735-4664-a166-663961646332/photo_2025-05-18_11-.jpg',
 'tild6336-6161-4261-a436-363336656135/photo_2025-05-18_11-.jpg','tild3335-6431-4038-b738-353764353634/photo_2025-05-18_11-.jpg',
 'tild6635-3836-4530-b665-323239383337/photo_2025-05-18_11-.jpg','tild3038-3732-4666-b833-353265323332/photo_2025-05-18_11-.jpg',
 'tild3361-6131-4035-a261-623632383831/photo_2025-05-18_11-.jpg','tild3564-6164-4537-b532-653033383435/photo_2025-05-18_11-.jpg',
 'tild6437-3631-4964-a563-343638633131/photo_2025-05-18_11-.jpg','tild3063-6330-4133-a630-343365313364/photo_2025-05-18_11-.jpg']
 .map(p => ({ src:'https://static.tildacdn.ink/'+p, kind:'satin' }));
// ===============================================================

const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const st = { mat:0, types:[0], colors:[3,0], green:1, extras:[0], wrap:2, ribbon:0, qty:11 };
const KIND = { satin:'Атласні', soap:'Мильні' };
document.documentElement.classList.add('js');

// ---------- меню ----------
$('burger').onclick = () => { const o = $('nav').classList.toggle('open'); document.body.classList.toggle('lock', o); };
$('nav').onclick = e => { if(e.target.tagName === 'A'){ $('nav').classList.remove('open'); document.body.classList.remove('lock'); } };

// ---------- кольорові утиліти ----------
const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mix = (h,t,a) => { const A=rgb(h), B=rgb(t); return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*a).toString(16).padStart(2,'0')).join(''); };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed>>>15, 1|seed);
  t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14)>>>0)/4294967296; };

// ---------- SVG-квіти: окремі символи для атласу (s) і мила (o) ----------
const PET = {
  round:'M0 0C-17 -6 -20 -28 0 -36C20 -28 17 -6 0 0Z',
  soft:'M0 0C-19 -8 -23 -27 -9 -35Q0 -39 9 -35C23 -27 19 -8 0 0Z',
  ruffle:'M0 0C-18 -8 -24 -24 -12 -33Q-6 -38 0 -33Q6 -38 12 -33C24 -24 18 -8 0 0Z',
  slim:'M0 0C-5 -10 -6 -30 0 -40C6 -30 5 -10 0 0Z'
};
function ring(n, off, sc, rot, path, soap){
  let s = '';
  for(let i=0;i<n;i++){
    const a = (rot + i*360/n).toFixed(1);
    s += `<g transform="translate(50 50) rotate(${a}) translate(0 ${-off}) scale(${sc})">`
      + `<path d="${path}" fill="var(--m)" stroke="${soap?'var(--l)':'var(--d)'}" stroke-width="${soap?1.7:.9}" stroke-linejoin="round"/>`
      + `<path d="${path}" fill="url(#${soap?'ovo':'ovs'})"/>`
      + (soap ? `<path d="${path}" fill="url(#dots)"/>`
              : `<path d="M0 -3C1 -14 -1 -22 0 -31" stroke="var(--d)" stroke-width=".7" opacity=".4" fill="none"/><ellipse cx="-4" cy="-24" rx="3" ry="8" fill="url(#spec)" transform="rotate(-10 -4 -24)"/>`)
      + `</g>`;
  }
  return s;
}
const center = r => `<circle cx="50" cy="50" r="${r}" fill="var(--m)" stroke="var(--d)" stroke-width=".8"/>`
  + `<path d="M50 50m-1.5 0a1.5 1.5 0 1 1 3 0a3 3 0 1 1-6 0a4.5 4.5 0 1 1 9 0" fill="none" stroke="var(--d)" stroke-width="1.1" stroke-linecap="round"/>`;
function symbol(type, soap){
  const sh = `<circle cx="50" cy="54" r="40" fill="#000" opacity=".16"/>`;
  const gloss = soap ? '' : `<ellipse cx="36" cy="33" rx="20" ry="10" fill="url(#spec)" opacity=".55" transform="rotate(-32 36 33)"/>`;
  let body;
  if(type==='rose')  body = ring(6,14,.9,0,soap?PET.soft:PET.round,soap)+ring(6,10,.75,30,soap?PET.soft:PET.round,soap)+ring(5,6,.55,12,PET.round,soap)+ring(4,3,.38,40,PET.round,soap)+center(6.5);
  if(type==='peony') body = ring(9,16,.85,0,PET.ruffle,soap)+ring(8,12,.72,20,PET.ruffle,soap)+ring(7,8,.58,10,PET.ruffle,soap)+ring(6,5,.44,35,PET.soft,soap)+ring(5,2,.3,0,PET.soft,soap)+center(4);
  if(type==='chamo') body = ring(15,8,.97,0,PET.slim,soap)+ring(15,7,.8,12,PET.slim,soap)
      + `<circle cx="50" cy="50" r="11" fill="#f2b705" stroke="#b98a00" stroke-width="1"/><circle cx="50" cy="50" r="11" fill="url(#dots)"/>`
      + (soap ? '' : `<circle cx="46" cy="46" r="4" fill="url(#spec)"/>`);
  return `<symbol id="f-${type}-${soap?'o':'s'}" viewBox="0 0 100 100">${sh}${body}${gloss}</symbol>`;
}
$('defs').innerHTML = `<defs>
  <linearGradient id="ovs" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".42"/></linearGradient>
  <linearGradient id="ovo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".14"/></linearGradient>
  <radialGradient id="spec"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#fff" opacity=".28"/><circle cx="3" cy="3" r=".55" fill="#000" opacity=".13"/></pattern>
  ${TYPES.map(t => symbol(t.id,false)+symbol(t.id,true)).join('')}
</defs>`;

const tone = c => `--m:${c};--l:${mix(c,'#ffffff',.32)};--d:${mix(c,'#000000',.34)}`;
const useF = (type, soap, c, x, y, s, rot=0) =>
  `<use href="#f-${type}-${soap?'o':'s'}" x="${(x-s/2).toFixed(1)}" y="${(y-s/2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" style="${tone(c)}"/>`;

// ---------- зелень ----------
const leafP = 'M0 0C-11 -12 -10 -40 0 -62C10 -40 11 -12 0 0Z';
function green(kind, x, y, rot, L, cols){
  const [c1,c2,c3] = cols;
  let g = `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">`;
  if(kind===1){
    g += `<path d="M0 0L0 ${-L}" stroke="#6b8a78" stroke-width="2.4" stroke-linecap="round"/>`;
    for(let k=1;k<=5;k++){ const yy=-L*k/5.4;
      g += `<ellipse cx="-9" cy="${yy.toFixed(1)}" rx="9" ry="11" fill="${k%2?c1:c2}" transform="rotate(-28 -9 ${yy.toFixed(1)})"/>`
         + `<ellipse cx="9" cy="${(yy-L*.07).toFixed(1)}" rx="9" ry="11" fill="${k%2?c2:c1}" transform="rotate(28 9 ${(yy-L*.07).toFixed(1)})"/>`; }
    g += `<ellipse cx="0" cy="${-L-8}" rx="8" ry="10" fill="${c3}"/>`;
  } else if(kind===2){
    g += `<path d="${leafP}" transform="scale(${(L/62).toFixed(2)})" fill="${c1}"/>`
       + `<path d="${leafP}" transform="rotate(-26) scale(${(L/80).toFixed(2)})" fill="${c2}"/>`
       + `<path d="${leafP}" transform="rotate(26) scale(${(L/80).toFixed(2)})" fill="${c3}"/>`
       + `<path d="M0 0L0 ${-L*.8}" stroke="rgba(255,255,255,.3)" stroke-width="1.3"/>`;
  } else {
    g += `<path d="M0 0L0 ${-L}" stroke="${c2}" stroke-width="2" stroke-linecap="round"/>`;
    for(let k=1;k<=9;k++){ const yy=-L*k/10, w=15*(1-k/13);
      g += `<path d="M0 ${yy.toFixed(1)}L${-w.toFixed(1)} ${(yy-w*.6).toFixed(1)}M0 ${yy.toFixed(1)}L${w.toFixed(1)} ${(yy-w*.6).toFixed(1)}" stroke="${k%2?c1:c3}" stroke-width="3.2" stroke-linecap="round"/>`; }
  }
  return g + '</g>';
}

// ---------- бант, метелик ----------
function bow(x, y, c, k=1){
  const d = mix(c,'#000000',.28), l = mix(c,'#ffffff',.4);
  return `<g transform="translate(${x} ${y}) scale(${k})">`
   + `<path d="M-4 4L-34 52L-18 47L-8 60Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>`
   + `<path d="M4 4L34 52L18 47L8 60Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/>`
   + `<path d="M0 0C-18 -28-62 -24-54 3C-50 22-14 14 0 0Z" fill="${c}" stroke="${d}" stroke-width="1.2"/>`
   + `<path d="M0 0C18 -28 62 -24 54 3C50 22 14 14 0 0Z" fill="${c}" stroke="${d}" stroke-width="1.2"/>`
   + `<path d="M-12 -4C-28 -16-42 -12-44 -2" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`
   + `<path d="M12 -4C28 -16 42 -12 44 -2" fill="none" stroke="${l}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`
   + `<circle r="9" fill="${c}" stroke="${d}" stroke-width="1.2"/><circle cx="-2" cy="-2" r="3" fill="${l}" opacity=".8"/></g>`;
}
function butterfly(x, y, s, c, rot){
  const wing = `<path d="M0 0C-8 -24-32 -28-32 -10C-32 3-12 7 0 0Z" fill="${c}" stroke="${mix(c,'#000000',.3)}" stroke-width="1"/><path d="M0 0C-6 14-22 26-18 11C-16 5-8 2 0 0Z" fill="${mix(c,'#ffffff',.2)}" stroke="${mix(c,'#000000',.3)}" stroke-width="1"/><circle cx="-17" cy="-12" r="3.4" fill="#fff" opacity=".6"/>`;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})">${wing}<g transform="scale(-1 1)">${wing}</g><path d="M0 -4L0 10" stroke="#2a1a20" stroke-width="2.2" stroke-linecap="round"/></g>`;
}

// ---------- збірка букета ----------
function bouquet(S){
  const rnd = rng(11);
  const n = S.qty, shown = Math.min(n, 80);
  const boxy = S.wrap >= 3, w = WRAPS[S.wrap];
  const R = clamp(30 + 28*Math.sqrt(shown), 50, 150);
  const cx = 200, cy = 185 + (boxy ? 44 : 0);
  const base = clamp(R*2.2/Math.sqrt(shown), 30, 105);
  const rc = RIBBONS[S.ribbon][1];
  const GA = Math.PI*(3-Math.sqrt(5));

  const fl = [];
  for(let i=0;i<shown;i++){
    const r = shown>1 ? Math.sqrt((i+.5)/shown)*R : 0, a = i*GA, k = R ? r/R : 0;
    fl.push({ i, r, x:cx + r*Math.cos(a), y:cy + r*Math.sin(a)*.78 + k*k*16 });
  }
  fl.sort((a,b) => b.r - a.r);

  let back = '', front = '';
  // ---- упаковка: задня частина ----
  const ty = cy + R*.35, th = clamp(R*.95+25, 80, 165);
  if(S.wrap <= 1){
    for(let j=0;j<9;j++){
      const x0 = cx + (rnd()-.5)*R*.9, x1 = cx + (rnd()-.5)*22;
      back += `<path d="M${x0.toFixed(1)} ${(cy+R*.4).toFixed(1)}Q${((x0+x1)/2).toFixed(1)} 400 ${x1.toFixed(1)} ${470+rnd()*8|0}" stroke="${j%2?'#4b7a4c':'#5b8b57'}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
    }
    if(S.wrap===1) front += `<path d="M${cx-24} 378q24 10 48 0v13q-24 10-48 0z" fill="${rc}" stroke="${mix(rc,'#000000',.25)}" stroke-width="1"/>` + bow(cx, 386, rc, .9);
  } else if(S.wrap===2){
    back += `<path d="M${cx-th} ${ty-12}Q${cx-th/2} ${ty+8} ${cx} ${ty-4}Q${cx+th/2} ${ty+8} ${cx+th} ${ty-12}L${cx+16} 488L${cx-16} 488Z" fill="#c4a073"/>`
         + `<path d="M${cx-th*.55} ${ty}L${cx-10} 486M${cx+th*.5} ${ty}L${cx+10} 486" stroke="#a37f52" stroke-width="1.4" opacity=".6"/>`;
    const by = ty + (486-ty)*.5, bw = th + (16-th)*.5;
    front += `<path d="M${cx-th*.92} ${ty+10}Q${cx} ${ty+64} ${cx+th*.92} ${ty+10}L${cx+14} 488L${cx-14} 488Z" fill="#dcbd91"/>`
          + `<path d="M${cx-th*.6} ${ty+22}L${cx-8} 480M${cx+th*.6} ${ty+22}L${cx+8} 480M${cx} ${ty+40}L${cx} 486" stroke="#b08a5b" stroke-width="1.3" opacity=".55"/>`
          + `<path d="M${cx-bw} ${by}Q${cx} ${by+14} ${cx+bw} ${by}v12Q${cx} ${by+26} ${cx-bw} ${by+12}z" fill="${rc}" stroke="${mix(rc,'#000000',.25)}" stroke-width="1"/>` + bow(cx, by+14, rc, .95);
  } else {
    const hw = clamp(R*.9+30, 95, 135), bt = 322, bc = rc, bd = mix(bc,'#000000',.16), bl = mix(bc,'#ffffff',.3);
    front += `<rect x="${cx-hw}" y="${bt+28}" width="${hw*2}" height="140" rx="16" fill="${bc}" stroke="${bd}" stroke-width="1.2"/>`
          + `<rect x="${cx-hw}" y="${bt+28}" width="${hw*2}" height="140" rx="16" fill="url(#shadeBox)"/>`
          + `<rect x="${cx-hw-7}" y="${bt}" width="${hw*2+14}" height="38" rx="12" fill="${bl}" stroke="${bd}" stroke-width="1.2"/>`
          + `<rect x="${cx-hw-7}" y="${bt+28}" width="${hw*2+14}" height="10" fill="rgba(0,0,0,.14)"/>`;
    if(S.wrap===4){
      front += `<rect x="${cx-hw+22}" y="${bt+66}" width="${hw*2-44}" height="74" rx="12" fill="#2a1510"/>`;
      const cols = ['#5a2f1f','#d9b36a','#7b3f28','#e8c28a','#4a2418'];
      const cnt = Math.max(3, Math.floor((hw*2-60)/32));
      for(let j=0;j<cnt;j++){ const x = cx - (cnt-1)*16 + j*32;
        front += `<circle cx="${x}" cy="${bt+103}" r="14" fill="${cols[j%5]}"/><circle cx="${x-4}" cy="${bt+98}" r="4.5" fill="#fff" opacity=".35"/>`; }
    } else {
      front += `<path d="M${cx-hw+14} ${bt+58}Q${cx} ${bt+70} ${cx+hw-14} ${bt+58}" stroke="${bd}" stroke-width="1.4" fill="none" opacity=".5"/>`;
      front += bow(cx, bt+38, bc==='#fbf8f3' ? '#d9b36a' : '#fbf8f3', .55);
    }
  }

  // ---- зелень (за квітами) ----
  let gr = '';
  if(S.green){
    const cnt = clamp(Math.round(7 + shown*.22), 8, 18);
    for(let j=0;j<cnt;j++){
      const a = -Math.PI*1.12 + j/(cnt-1)*Math.PI*1.24 + (rnd()-.5)*.12;
      gr += green(S.green, cx + Math.cos(a)*R*.88, cy + Math.sin(a)*R*.69 + 8, a*180/Math.PI + 90, 48 + rnd()*38, GREENS[S.green].c);
    }
  }

  // ---- квіти ----
  let fh = '';
  for(const f of fl){
    const t = TYPES[f.i < S.types.length ? S.types[f.i] : S.types[Math.floor(rnd()*S.types.length)]];
    const c = COLORS[f.i < S.colors.length ? S.colors[f.i] : S.colors[Math.floor(rnd()*S.colors.length)]][1];
    const soap = S.mat===1 || (S.mat===2 && f.i%2===1);
    fh += useF(t.id, soap, c, f.x, f.y, base*t.s*(.94+rnd()*.12), rnd()*360);
  }

  // ---- доповнення (поверх) ----
  let ex = '';
  if(S.extras.includes(0)){
    const cnt = clamp(shown+8, 12, 34);
    for(let j=0;j<cnt;j++){
      const a = rnd()*Math.PI*2, k = .72 + rnd()*.42;
      if(Math.sin(a) > .75) continue;
      const px = cx + Math.cos(a)*R*k, py = cy + Math.sin(a)*R*.78*k;
      for(let m=0;m<6;m++) ex += `<circle cx="${(px+(rnd()-.5)*22).toFixed(1)}" cy="${(py+(rnd()-.5)*22).toFixed(1)}" r="${(2+rnd()*1.8).toFixed(1)}" fill="#fff" stroke="rgba(60,20,40,.12)" stroke-width=".6"/>`;
    }
  }
  if(S.extras.includes(1)){
    const cnt = clamp(Math.round(shown/2), 3, 14);
    for(let j=0;j<cnt;j++){
      const a = rnd()*Math.PI*2, k = Math.sqrt(rnd())*.9, px = cx + Math.cos(a)*R*k, py = cy + Math.sin(a)*R*.78*k + 6;
      ex += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.8" fill="#f6f1ea" stroke="#d3c8ba" stroke-width=".8"/><circle cx="${(px-1.5).toFixed(1)}" cy="${(py-1.6).toFixed(1)}" r="1.6" fill="#fff"/>`;
    }
  }
  if(S.extras.includes(2)){
    const bc = mix(COLORS[S.colors[0]][1],'#ffffff',.25);
    [[-2.35,1.02,-28,.9],[-.8,.95,26,.75]].forEach(([a,k,rot,s]) => {
      ex += butterfly(cx + Math.cos(a)*R*k, cy + Math.sin(a)*R*.78*k, s, bc, rot); });
  }

  return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Схема букета">
    <defs><linearGradient id="shadeBox" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
    <ellipse cx="200" cy="492" rx="${boxy?125:70}" ry="8" fill="rgba(60,20,40,.2)"/>
    <g class="sway">${back}${gr}${fh}${ex}${front}</g></svg>`;
}

// ---------- інтерфейс конструктора ----------
const thumb = (type, soap, c) => `<svg viewBox="0 0 100 100">${useF(type, soap, c, 50, 50, 100)}</svg>`;
const priceOf = i => MATERIALS[i].price ? MATERIALS[i].price(st.qty) : null;

$('cmp').innerHTML = `<table><thead><tr><th></th><th>Атласні</th><th>Мильні</th></tr></thead><tbody>${
  COMPARE.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
$('quick').innerHTML = [5,11,25,51,101].map(n=>`<button type="button" class="chip" data-q="${n}">${n} шт</button>`).join('');
$('wraps').innerHTML = WRAPS.map((w,i)=>`<button type="button" class="chip" data-i="${i}">${w.ic?w.ic+' ':''}${w.n}</button>`).join('');
$('greens').innerHTML = GREENS.map((g,i)=>`<button type="button" class="chip" data-i="${i}">${g.n}</button>`).join('');
$('extras').innerHTML = EXTRAS.map((g,i)=>`<button type="button" class="chip" data-i="${i}">${g.ic} ${g.n}</button>`).join('');
$('colors').innerHTML = COLORS.map(([n,c],i)=>`<button type="button" class="sw" title="${n}" aria-label="${n}" data-i="${i}" style="background:${c}"></button>`).join('');
$('ribbons').innerHTML = RIBBONS.map(([n,c],i)=>`<button type="button" class="sw sm" title="${n}" aria-label="${n}" data-i="${i}" style="background:${c}"></button>`).join('');

const toggle = (arr, i, max, min=1) => { const k = arr.indexOf(i);
  if(k>=0){ if(arr.length>min) arr.splice(k,1); } else { arr.push(i); if(arr.length>max) arr.shift(); } };
const on = (sel, f) => document.querySelectorAll(sel).forEach((c,i) => c.classList.toggle('on', f(i)));

$('mats').onclick   = e => { const b=e.target.closest('[data-i]'); if(b){ st.mat=+b.dataset.i; draw(); } };
$('types').onclick  = e => { const b=e.target.closest('[data-i]'); if(b){ toggle(st.types,+b.dataset.i,3); draw(); } };
$('colors').onclick = e => { const b=e.target.closest('[data-i]'); if(b){ toggle(st.colors,+b.dataset.i,4); draw(); } };
$('greens').onclick = e => { const b=e.target.closest('[data-i]'); if(b){ st.green=+b.dataset.i; draw(); } };
$('extras').onclick = e => { const b=e.target.closest('[data-i]'); if(b){ toggle(st.extras,+b.dataset.i,3,0); draw(); } };
$('wraps').onclick  = e => { const b=e.target.closest('[data-i]'); if(b){ st.wrap=+b.dataset.i; draw(); } };
$('ribbons').onclick= e => { const b=e.target.closest('[data-i]'); if(b){ st.ribbon=+b.dataset.i; draw(); } };
$('quick').onclick  = e => { const b=e.target.closest('[data-q]'); if(b){ st.qty=+b.dataset.q; draw(); } };
$('minus').onclick  = () => { st.qty=Math.max(1,st.qty-1); draw(); };
$('plus').onclick   = () => { st.qty=Math.min(200,st.qty+1); draw(); };
$('qty').oninput    = e => { st.qty=clamp(+e.target.value||1,1,200); draw(false); };

function summary(){
  const w = WRAPS[st.wrap];
  return [
    ['Матеріал', MATERIALS[st.mat].n],
    ['Квіти', st.types.map(i=>TYPES[i].n).join(', ')],
    ['Кольори', st.colors.map(i=>COLORS[i][0]).join(', ')],
    ['Кількість', st.qty+' шт'],
    ['Зелень', GREENS[st.green].n],
    ['Доповнення', st.extras.length ? st.extras.map(i=>EXTRAS[i].n).join(', ') : 'без доповнень'],
    ['Оформлення', w.n + (w.ribbon ? ' · '+RIBBONS[st.ribbon][0].toLowerCase() : '')]
  ];
}
function money(){
  const unit = priceOf(st.mat);
  const adds = [WRAPS[st.wrap], GREENS[st.green], ...st.extras.map(i=>EXTRAS[i])];
  const known = adds.reduce((s,a)=>s+(a.p||0),0), unknown = adds.some(a=>a.p===null);
  return { unit, unknown, total: unit ? unit*st.qty + known : null };
}

function draw(syncQty = true){
  const m = MATERIALS[st.mat], c0 = COLORS[st.colors[0]][1], w = WRAPS[st.wrap];
  // матеріал (картки з мініатюрами)
  $('mats').innerHTML = MATERIALS.map((x,i)=>{
    const p = priceOf(i);
    const th = i===2 ? `<svg viewBox="0 0 100 100">${useF('rose',false,c0,34,52,66)}${useF('rose',true,c0,68,48,66)}</svg>` : thumb('rose', i===1, c0);
    return `<button type="button" class="card ${i===st.mat?'on':''}" data-i="${i}"><span class="th">${th}</span><b>${x.n}</b><small>${p?p+' грн/шт':'ціну уточню'}</small></button>`;
  }).join('');
  $('types').innerHTML = TYPES.map((t,i)=>`<button type="button" class="card ${st.types.includes(i)?'on':''}" data-i="${i}"><span class="th">${thumb(t.id, st.mat===1, c0)}</span><b>${t.n}</b></button>`).join('');
  document.querySelectorAll('#colors .sw').forEach((c,i)=>c.classList.toggle('on', st.colors.includes(i)));
  document.querySelectorAll('#ribbons .sw').forEach((c,i)=>c.classList.toggle('on', i===st.ribbon));
  on('#greens .chip', i=>i===st.green); on('#extras .chip', i=>st.extras.includes(i)); on('#wraps .chip', i=>i===st.wrap);
  on('#quick .chip', i=>[5,11,25,51,101][i]===st.qty);
  $('matNote').textContent = m.note;
  $('colorNames').textContent = 'Обрано: ' + st.colors.map(i=>COLORS[i][0]).join(' · ');
  $('ribbonRow').hidden = !w.ribbon; if(w.ribbon) $('ribbonLbl').textContent = w.ribbon + ': ' + RIBBONS[st.ribbon][0];
  if(syncQty) $('qty').value = st.qty;
  $('qtyNote').textContent = st.qty>80 ? `На схемі показано 80 з ${st.qty} квіток` : '';

  const { unit, unknown, total } = money(), tot = $('total');
  if(unit){
    tot.textContent = total.toLocaleString('uk-UA') + ' грн'; tot.className = '';
    $('unit').textContent = `${st.qty} шт × ${unit} грн` + (unknown ? ' · упаковка й доповнення — окремо' : '') + ' · остаточну ціну погодимо';
    $('dockTotal').textContent = total.toLocaleString('uk-UA') + ' грн';
  } else {
    tot.textContent = 'ціна за домовленістю'; tot.className = 'txt';
    $('unit').textContent = 'Напишу вам вартість після підтвердження деталей';
    $('dockTotal').textContent = 'за домовленістю';
  }
  $('pvMeta').textContent = `${MATERIALS[st.mat].n} · ${st.qty} шт`;
  $('sum').innerHTML = summary().map(([k,v])=>`<li><span>${k}</span><b>${v}</b></li>`).join('');

  const stage = $('stage'); stage.innerHTML = bouquet(st);
}
draw();

// ---------- плашка зі сумою на мобільному ----------
const seen = { b:false, f:false };
const dockUpd = () => $('dock').classList.toggle('show', seen.b && !seen.f);
new IntersectionObserver(es => { seen.b = es[0].isIntersecting; dockUpd(); }, { rootMargin:'-20% 0px -10% 0px' }).observe($('builder'));
new IntersectionObserver(es => { seen.f = es[0].isIntersecting; dockUpd(); }).observe($('orderForm'));
$('dockBtn').onclick = () => $('orderForm').scrollIntoView({ behavior:'smooth', block:'center' });

// ---------- поява при скролі + шапка ----------
const io = new IntersectionObserver(es => es.forEach(x => { if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold:.12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));
const hdr = document.querySelector('.header');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive:true });

// ---------- галерея: Supabase → photos.json → Tilda ----------
async function loadPhotos(){
  try { const { data } = await supabase.from('gallery').select('image_url,kind').order('sort',{ascending:true}).order('id',{ascending:false});
        if(data?.length) return data.map(r=>({src:r.image_url, kind:r.kind})); } catch(e){}
  try { const r = await fetch('photos.json'); const j = await r.json(); if(j.length) return [...j, ...FALLBACK]; } catch(e){}
  return FALLBACK;
}
let photos = [], filter = 'all';
function renderGallery(){
  const list = photos.map((p,i)=>({...p,i:i+1})).filter(p=>filter==='all'||p.kind===filter);
  $('masonry').innerHTML = list.map(p=>`<div class="shot"><img src="${p.src}" loading="lazy" alt="Робота ${p.i}" data-z="${p.src}"><button data-w="${p.i}">Хочу такий ✿</button></div>`).join('');
  const kinds = [...new Set(photos.map(p=>p.kind).filter(Boolean))];
  $('filters').innerHTML = kinds.length>1 ? ['all',...kinds].map(k=>`<button type="button" class="chip ${k===filter?'on':''}" data-f="${k}">${k==='all'?'Усі':KIND[k]||k}</button>`).join('') : '';
}
$('filters').onclick = e => { const b=e.target.closest('[data-f]'); if(b){ filter=b.dataset.f; renderGallery(); } };
$('masonry').onclick = e => {
  const w = e.target.closest('[data-w]');
  if(w){ $('message').value = `Хочу схожий букет, як на фото №${w.dataset.w} в галереї. `; $('orderForm').scrollIntoView({behavior:'smooth',block:'center'}); setTimeout(()=>$('message').focus({preventScroll:true}),500); return; }
  const z = e.target.dataset.z; if(!z) return;
  const box = document.createElement('div'); box.className='lightbox'; box.innerHTML=`<img src="${z}" alt="">`;
  const close = () => { box.remove(); removeEventListener('keydown', esc); }, esc = ev => ev.key==='Escape' && close();
  box.onclick = close; addEventListener('keydown', esc); document.body.append(box);
};
loadPhotos().then(p => { photos = p; renderGallery(); });

// ---------- замовлення ----------
$('orderForm').onsubmit = async e => {
  e.preventDefault();
  const say = (t,c='') => { $('status').textContent=t; $('status').className='status '+c; };
  const name=$('name').value.trim(), contact=$('contact').value.trim();
  if($('website').value) return;
  if(!name||!contact) return say('Вкажіть ім’я та контакт 🙏','err');
  $('send').disabled = true; say('Надсилаю…');
  const { total } = money(), w = WRAPS[st.wrap];
  const flower = `${MATERIALS[st.mat].n} · ${st.types.map(i=>TYPES[i].n).join(' + ')}`
    + (st.green ? ` · зелень: ${GREENS[st.green].n}` : '')
    + (st.extras.length ? ` · дод.: ${st.extras.map(i=>EXTRAS[i].n).join(', ')}` : '');
  const { error } = await supabase.from('flower_orders').insert([{
    name, contact, message:$('message').value.trim(),
    flower, colors:st.colors.map(i=>COLORS[i][0]),
    qty:st.qty, wrap:w.n + (w.ribbon ? ` (${RIBBONS[st.ribbon][0].toLowerCase()})` : ''), total }]);
  $('send').disabled = false;
  if(error){ console.error(error); return say('Не вдалося надіслати. Напишіть у Telegram: @0505263729','err'); }
  e.target.reset(); say('Дякую! Замовлення отримано — скоро напишу вам 💐','ok');
};
