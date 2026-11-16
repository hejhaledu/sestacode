/* =====================================================================
   SestaCode – sdílená kostra v1.1 (vychází z CabiNet 1.2)
   Hlavička (logo, nabídka aplikací, ikony), patička, Nastavení,
   klávesové zkratky, soubory (obálka .json), oznámení se „Vrátit“,
   karty v levém panelu, tažení levého sloupce, hodiny na rozcestníku.
   Rozdíly proti CabiNetu:
     – žádný tisk, PDF, zkušební režim, kontrola před tiskem ani statistika,
     – v hlavičce jen ikony, které aplikace opravdu má (varianta B),
     – výsledky a rozpracovaná práce jen v paměti panelu (sessionStorage),
     – výchozí je tmavý režim, texty v tykání.
   Aplikace volá:  SESTA.init({...})  – viz README.md
   ===================================================================== */
(function(){
'use strict';
const S = window.SESTA = window.SESTA || {};
const doc = document;
const memory = () => { const m = {}; return { getItem:k => k in m ? m[k] : null, setItem:(k,v) => { m[k] = String(v); }, removeItem:k => { delete m[k]; } }; };
const ss = (() => { try { sessionStorage.setItem('_t','1'); sessionStorage.removeItem('_t'); return sessionStorage; } catch(e){ return memory(); } })();
const ls = (() => { try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return localStorage; } catch(e){ return ss; } })();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREFIX = 'scode:';                 // klíče v prohlížeči (odlišné od CabiNetu na stejné doméně)
const THEME_KEY = 'sestacode-rezim';   // od verze 1.1 (všechny aplikace začínají v tmavém režimu)

/* ---------- ikony (styl Lucide) ---------- */
const P = {
  new:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 18v-6M9 15h6"/>',
  open:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  save:'<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  gear:'<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  chev:'<path d="m6 9 6 6 6-6"/>',
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  flow:'<rect x="8" y="2" width="8" height="5" rx="1.2"/><path d="M12 7v2.5"/><path d="m12 9.5 4 3-4 3-4-3z"/><path d="M8 12.5H4.5V17M16 12.5h3.5V17"/><rect x="2" y="17" width="5" height="4" rx="1"/><rect x="17" y="17" width="5" height="4" rx="1"/>',
  keys:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h.01M12 13h.01M16 13h.01M7 16h10"/>',
  types:'<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
  python:'<path d="m4 17 6-6-6-6M12 19h8"/>',
  keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4M7 16h10"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkc:'<circle cx="12" cy="12" r="10"/><path d="m8 12.5 3 3 5-6"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  copy:'<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>',
  trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  focus:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
  plus:'<path d="M5 12h14M12 5v14"/>',
  minus:'<path d="M5 12h14"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  drag:'<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>'
};
const icon = (n, cls='s-i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;
S.icon = icon;
/* ---------- systém: Windows / Mac (zkratky a nápovědy kláves se přizpůsobí) ---------- */
const isMac = /Mac|iPhone|iPad/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '');
const MOD = isMac ? '⌘' : 'Ctrl';
S.isMac = isMac; S.platform = isMac ? 'mac' : 'win'; S.MOD = MOD; S.ALT = isMac ? 'Option' : 'Alt';
/* zápis zkratky pro aktuální systém: „Ctrl+Z“ → „⌘+Z“, „Alt+N“ → „Option+N“, „Ctrl+Y“ → „⌘+Shift+Z“ */
const keyLabel = s => !isMac ? String(s) : String(s).replace(/Ctrl\+Y/g, '⌘+Shift+Z').replace(/Ctrl/g, '⌘').replace(/\bAlt\b/g, 'Option').replace(/\bDelete\b/g, 'Delete ⌫');
S.keyLabel = keyLabel;

/* ---------- stav kostry ---------- */
let C = null;               // konfigurace aplikace
let A = null;               // záznam aplikace z apps.js
const K = id => PREFIX + (C ? C.app : 'hub') + ':' + id;
const st = {
  get dirty(){ return ss.getItem(K('dirty')) === '1'; },
  set dirty(v){ v ? ss.setItem(K('dirty'),'1') : ss.removeItem(K('dirty')); },
  get saved(){ return ss.getItem(K('saved')); },
  set saved(v){ ss.setItem(K('saved'), v); }
};
let leaving = false;
const $ = s => doc.querySelector(s);

/* ---------- paměť aplikace: jen do zavření panelu prohlížeče ---------- */
S.store = {
  get(key, def){ try { const v = ss.getItem(K('d:' + key)); return v === null ? def : JSON.parse(v); } catch(e){ return def; } },
  set(key, val){ try { ss.setItem(K('d:' + key), JSON.stringify(val)); return true; } catch(e){ return false; } },
  remove(key){ ss.removeItem(K('d:' + key)); }
};

/* ---------- motiv (výchozí tmavý) ---------- */
function theme(){ return doc.documentElement.dataset.theme === 'light' ? 'light' : 'dark'; }
function setTheme(t){
  doc.documentElement.dataset.theme = t;
  try { ls.setItem(THEME_KEY, t); } catch(e){}
  const b = $('#sTheme'); if (b){ b.innerHTML = icon(t==='dark'?'sun':'moon'); b.dataset.tip = t==='dark' ? 'Světlý režim' : 'Tmavý režim'; b.setAttribute('aria-label', b.dataset.tip); }
  C && C.onTheme && C.onTheme(t);
}
S.setTheme = setTheme; S.theme = theme;

/* ---------- pomocné prvky ---------- */
function el(html){ const t = doc.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
S.esc = esc; S.el = el;

/* oznámení */
function toast(msg, o={}){
  let box = $('.s-toasts'); if (!box){ box = el('<div class="s-toasts" role="status" aria-live="polite"></div>'); doc.body.appendChild(box); }
  const kind = o.kind || '';
  const t = el(`<div class="s-toast ${kind}">${icon(kind==='err'?'alert':kind==='ok'?'check':'info')}<span>${esc(msg)}</span></div>`);
  if (o.action){ const b = el(`<button type="button">${esc(o.action.label)}</button>`); b.onclick = () => { o.action.run(); t.remove(); }; t.appendChild(b); }
  box.appendChild(t);
  setTimeout(() => t.remove(), o.time || (o.action ? 6000 : 3200));
}
S.toast = toast;

/* okno */
function modal({title, body, buttons=[], wide=false, onOpen, onClose}){
  const bg = el(`<div class="s-modal-bg"><div class="s-modal ${wide?'wide':''}" role="dialog" aria-modal="true"><div class="s-modal-h"><span></span><button class="s-x" type="button" aria-label="Zavřít">${icon('x')}</button></div><div class="s-modal-b"></div><div class="s-modal-f"></div></div></div>`);
  bg.querySelector('.s-modal-h span').textContent = title;
  const b = bg.querySelector('.s-modal-b'); if (typeof body === 'string') b.innerHTML = body; else if (body) b.appendChild(body);
  const f = bg.querySelector('.s-modal-f');
  let closed = false;
  const close = () => { if (closed) return; closed = true; bg.remove(); doc.removeEventListener('keydown', key, true); onClose && onClose(); };
  const key = e => {
    if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Enter' && !/BUTTON|INPUT|TEXTAREA/.test((doc.activeElement||{}).tagName||'')){ const p = f.querySelector('.pri'); if (p){ e.preventDefault(); e.stopPropagation(); p.click(); } }
  };
  if (!buttons.length) f.remove();
  for (const btn of buttons){
    const x = el(`<button type="button" class="s-btn ${btn.kind||''}">${esc(btn.label)}</button>`);
    x.onclick = () => { const r = btn.run && btn.run(bg); if (r !== false) close(); };
    f.appendChild(x);
  }
  bg.querySelector('.s-x').onclick = close;
  bg.addEventListener('mousedown', e => { if (e.target === bg) close(); });
  doc.addEventListener('keydown', key, true);
  doc.body.appendChild(bg);
  onOpen && onOpen(bg);
  const pri = f && f.querySelector('.pri'); (pri || bg.querySelector('.s-x')).focus();
  return {close, el:bg};
}
S.modal = modal;
S.modalOpen = () => !!doc.querySelector('.s-modal-bg');
/* potvrzení – vrací Promise<boolean> */
S.confirm = ({title, text, ok='Potvrdit', cancel='Zrušit', danger=false}) => new Promise(res => {
  let done = false;
  modal({ title, body:`<p>${esc(text)}</p>`, onClose:() => { if (!done) res(false); },
    buttons:[{label:cancel, run:() => { done = true; res(false); }}, {label:ok, kind: danger ? 'pri danger-pri' : 'pri', run:() => { done = true; res(true); }}] });
});

/* bublina */
let tipEl, tipT, tipFor;
function tipShow(t){
  if (!tipEl){ tipEl = el('<div class="s-tip" role="tooltip"></div>'); doc.body.appendChild(tipEl); }
  const k = t.dataset.key;
  tipEl.innerHTML = esc(t.dataset.tip) + (k ? `<kbd>${esc(keyLabel(k))}</kbd>` : '');
  const r = t.getBoundingClientRect(); tipEl.style.left = '0px'; tipEl.style.top = '0px'; tipEl.classList.add('show');
  const w = tipEl.offsetWidth;
  tipEl.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width/2 - w/2)) + 'px';
  tipEl.style.top = (r.bottom + 8) + 'px';
}
function tipHide(){ clearTimeout(tipT); tipFor = null; tipEl && tipEl.classList.remove('show'); }
doc.addEventListener('pointerover', e => {
  const t = e.target.closest && e.target.closest('[data-tip]');
  if (t === tipFor) return; tipHide(); if (!t || e.pointerType === 'touch') return;
  tipFor = t; tipT = setTimeout(() => tipShow(t), 400);
});
doc.addEventListener('pointerdown', tipHide, true);
doc.addEventListener('scroll', tipHide, true);

/* nabídky – otevírají se kliknutím, otevřená je vždy jen jedna */
let openMenu = null;
function closeMenus(){ if (openMenu){ openMenu.classList.remove('open'); openMenu.parentElement && openMenu.parentElement.classList.remove('open'); openMenu = null; } }
function toggleMenu(m, anchor){
  if (openMenu === m){ closeMenus(); return; }
  closeMenus(); openMenu = m; m.classList.add('open');
  if (anchor){
    const r = anchor.getBoundingClientRect(), mw = m.offsetWidth;
    m.style.position = 'fixed'; m.style.top = (r.bottom + 6) + 'px';
    m.style.left = Math.max(8, Math.min(innerWidth - mw - 8, r.right - mw)) + 'px';
  }
}
doc.addEventListener('mousedown', e => { if (openMenu && !openMenu.contains(e.target) && !e.target.closest('[data-menu]') && !e.target.closest('.s-brand')) closeMenus(); });
S.closeMenus = closeMenus;
function fillMenu(m, items){
  items.forEach((it,i) => { if (typeof it === 'object') it._i = i; });
  m.innerHTML = items.map(it => {
    if (it === '-') return '<div class="s-mhr"></div>';
    if (it.head) return `<div class="s-mh">${esc(it.head)}</div>`;
    return `<button type="button" class="s-mi ${it.danger?'danger':''} ${it.on?'on':''}" ${it.disabled?'disabled':''} data-i="${it._i}">${icon(it.icon||'info')}<span>${esc(it.label)}</span>${it.key?`<span class="s-k">${esc(it.key)}</span>`:''}</button>`;
  }).join('');
  m.querySelectorAll('.s-mi').forEach(b => b.onclick = () => { closeMenus(); const it = items[+b.dataset.i]; it.run && it.run(); });
}

/* ---------- soubory ---------- */
function wrap(data, title){
  return { sestacode: C.app, verze: (A && A.version) || '1.0', vytvoreno: new Date().toISOString().slice(0,19), nazev: title || '', data };
}
function identify(o){
  if (!o || typeof o !== 'object') return null;
  if (o.sestacode && o.data) return { app:o.sestacode, data:o.data, title:o.nazev||'' };
  if (C && C.legacy){ const d = C.legacy(o); if (d) return { app:C.app, data:d, title:'' }; }
  return null;
}
const ascii = s => String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9.\-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
function fileName(parts, ext){
  const app = ascii((A ? A.name : S.brand.name)).toUpperCase();
  return [app, ...parts.map(ascii).filter(Boolean)].join('_') + '.' + ext;
}
const today = () => { const d = new Date(), p = n => String(n).padStart(2,'0'); return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate()); };
function download(blob, name){
  const a = doc.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  doc.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
S.download = download; S.fileName = fileName; S.today = today; S.ascii = ascii;

function receive(text, name){
  let o; try { o = JSON.parse(text); } catch(e){ toast('Soubor nejde přečíst. Vyber soubor .json uložený ve SestaCode.', {kind:'err'}); return; }
  const id = identify(o);
  if (!id){ toast('Tento soubor nepatří do SestaCode.', {kind:'err'}); return; }
  if (id.app !== C.app){
    const tgt = S.apps.find(a => a.id === id.app);
    if (!tgt){ toast('Soubor patří do aplikace, která tu není.', {kind:'err'}); return; }
    modal({ title:'Soubor z jiné aplikace',
      body:`<p>Soubor <b>${esc(name)}</b> patří do aplikace <b>${esc(tgt.name)}</b>. Otevřít ho tam?</p>`,
      buttons:[{label:'Zrušit'}, {label:`Otevřít v ${tgt.name}`, kind:'pri', run:() => {
        ss.setItem(PREFIX + 'incoming', JSON.stringify({app:id.app, data:id.data, name}));
        go(C.root + tgt.path);
      }}]});
    return;
  }
  try { C.load(id.data, {name, title:id.title}); }
  catch(e){ toast('Soubor nejde otevřít: ' + e.message, {kind:'err'}); return; }
  st.dirty = false; st.saved = 'Otevřeno ' + name; refresh();
  toast('Otevřeno: ' + name, {kind:'ok'});
}
function pickFile(){
  let inp = $('#sFile');
  if (!inp){ inp = el('<input type="file" id="sFile" accept=".json,application/json" hidden>'); doc.body.appendChild(inp);
    inp.onchange = async () => { const f = inp.files[0]; inp.value = ''; if (f) receive(await f.text(), f.name); }; }
  inp.click();
}

/* ---------- akce v hlavičce ---------- */
function guard(proceed){
  if (!st.dirty || !C.serialize) return proceed();
  modal({ title:'Máš neuložené změny', body:'<p>Rozpracovanou práci nemáš uloženou do souboru. Co s ní?</p>',
    buttons:[{label:'Zrušit'}, {label:'Zahodit', kind:'danger', run:proceed}, {label:'Uložit a pokračovat', kind:'pri', run:() => { if (doSave()) setTimeout(proceed, 50); }}]});
}
function doNew(){
  if (!C.actions.new) return;
  guard(() => { C.actions.new(); st.dirty = false; ss.removeItem(K('saved')); refresh(); });
}
function doOpen(){ if (C.load) guard(pickFile); }
function doSave(){
  if (!C.serialize) return false;
  const data = C.serialize(), title = C.title ? C.title() : '';
  const name = fileName(C.fileParts ? C.fileParts() : [title, today()], 'json');
  download(new Blob([JSON.stringify(wrap(data, title), null, 2)], {type:'application/json'}), name);
  st.dirty = false; const d = new Date(); st.saved = 'Uloženo ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
  refresh(); toast('Uloženo: ' + name, {kind:'ok'});
  return true;
}
function doExport(i=0){ const v = C.actions.export && C.actions.export[i]; if (v) v.run(); }

/* ---------- změny a stav v podtitulku ---------- */
function changed(){ if (!st.dirty){ st.dirty = true; refresh(); } }
S.changed = changed;
function refresh(){
  if (!C) return;
  const sub = $('#sSub'); if (sub){
    const parts = [A.desc]; const ctx = C.subtitle && C.subtitle(); if (ctx) parts.push(ctx);
    let stHtml = '';
    if (C.serialize){
      if (st.dirty) stHtml = '<span class="s-state dirty">Neuloženo</span>';
      else if (st.saved) stHtml = `<span class="s-state">${esc(st.saved)}</span>`;
    }
    sub.innerHTML = parts.map(esc).join(' · ') + (stHtml ? ' · ' + stHtml : '');
  }
  const dot = $('#sSaveDot'); if (dot) dot.hidden = !st.dirty;
}
S.refresh = refresh;

/* ---------- navigace ---------- */
function go(url){ leaving = true; location.href = url; }
S.go = go;
addEventListener('beforeunload', e => { if (!leaving && C && C.serialize && st.dirty){ e.preventDefault(); e.returnValue = ''; } });

/* ---------- přehled zkratek ---------- */
function shortcuts(){
  const common = [];
  if (C.actions.new) common.push(['Nový', S.ALT + '+N']);
  if (C.load) common.push(['Otevřít', MOD + '+O']);
  if (C.serialize) common.push(['Uložit', MOD + '+S']);
  common.push(['Zavřít nabídku nebo okno', 'Esc'], ['Přehled zkratek', '?']);
  const row = ([l,k]) => `<span>${esc(l)}</span><span>${keyLabel(k).split(' / ').map(x=>`<kbd>${esc(x)}</kbd>`).join(' ')}</span>`;
  let h = '<div class="s-keys"><h4>Společné</h4>' + common.map(row).join('');
  if (C.shortcuts && C.shortcuts.length) h += `<h4>V této aplikaci</h4>` + C.shortcuts.map(s => row([s.label, s.keys])).join('');
  modal({ title:'Klávesové zkratky', body:h + '</div>' });
}
S.shortcuts = () => shortcuts();

/* ---------- vykreslení hlavičky ---------- */
function header(){
  const isHub = C.app === 'hub';
  const rec = A, AC = C.actions || {};
  const files = !isHub && (AC.new || C.load || C.serialize);
  const exp = (!isHub && AC.export) || [];
  const h = el(`<header class="s-header">
    <div class="s-brand">
      <button type="button" class="s-tile" aria-label="Rozcestník ${esc(S.brand.name)}" data-tip="${isHub?esc(S.brand.name):'Rozcestník'}">${icon(isHub?'code':rec.icon)}</button>
      <div style="min-width:0">
        <div class="s-title"><span class="s-pre">${esc(S.brand.name)}</span>${isHub?'':` <span class="s-sl s-pre">/</span> ${esc(rec.name)}`} <span class="s-ver">${esc(rec.version)}</span></div>
        <div class="s-sub" id="sSub"></div>
      </div>
      <div class="s-menu s-appmenu" id="sAppMenu" role="menu"></div>
    </div>
    <nav class="s-actions" aria-label="Akce"></nav>
  </header>`);
  const act = h.querySelector('.s-actions');
  let html = '';
  if (files){
    html += `<button type="button" class="s-ib" id="sNew" data-tip="Nový" data-key="${S.ALT}+N" aria-label="Nový" ${AC.new?'':'disabled'}>${icon('new')}</button>
      <button type="button" class="s-ib" id="sOpen" data-tip="Otevřít" data-key="${MOD}+O" aria-label="Otevřít" ${C.load?'':'disabled'}>${icon('open')}</button>
      <button type="button" class="s-ib" id="sSave" data-tip="Uložit" data-key="${MOD}+S" aria-label="Uložit" ${C.serialize?'':'disabled'}>${icon('save')}<span class="s-dot" id="sSaveDot" hidden></span></button>
      <span class="s-sep"></span>`;
  }
  exp.forEach((x, i) => { html += `<button type="button" class="s-ib" data-exp="${i}" data-tip="${esc(x.label)}" ${x.key?`data-key="${esc(x.key)}"`:''} aria-label="${esc(x.label)}">${icon(x.icon || 'image')}</button>`; });
  if (exp.length) html += '<span class="s-sep"></span>';
  if (!isHub) html += `<button type="button" class="s-ib" id="sSet" data-menu data-tip="Nastavení" aria-label="Nastavení">${icon('gear')}</button><div class="s-menu" id="sSetMenu" role="menu"></div>`;
  html += `<button type="button" class="s-ib" id="sTheme"></button>`;
  act.innerHTML = html;
  doc.body.prepend(el('<div class="s-stripe"></div>'));
  doc.querySelector('.s-stripe').after(h);

  /* nabídka aplikací – najetím, klik na logo = rozcestník */
  const brand = h.querySelector('.s-brand'), am = h.querySelector('#sAppMenu');
  const groups = S.groups || [{id:null, name:'Aplikace'}];
  const apps = S.apps.filter(a => !a.hidden);
  am.innerHTML = `<a class="s-am" href="${C.root}" data-nav><span class="s-at home">${icon('home')}</span><span><b>Rozcestník</b><small>Hlavní stránka ${esc(S.brand.name)}</small></span>${isHub?'<span class="s-lbl">otevřeno</span>':''}</a>` +
    groups.map(g => {
      const list = apps.filter(a => !g.id || a.group === g.id); if (!list.length) return '';
      return `<div class="s-mhr"></div><div class="s-mh">${esc(g.name)}${g.note ? ' · ' + esc(g.note) : ''}</div>` + list.map(a => a.id === C.app
        ? `<div class="s-am cur"><span class="s-at">${icon(a.icon)}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span><span class="s-lbl">otevřeno</span></div>`
        : `<a class="s-am" href="${C.root + a.path}" data-nav><span class="s-at">${icon(a.icon)}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span></a>`).join('');
    }).join('');
  if (isHub) am.querySelector('.s-am').classList.add('cur');
  am.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); go(a.getAttribute('href')); }));
  let ot, ct;
  const openAM = () => { clearTimeout(ct); if (openMenu === am) return; ot = setTimeout(() => { closeMenus(); openMenu = am; am.classList.add('open'); brand.classList.add('open'); }, 150); };
  const closeAM = () => { clearTimeout(ot); ct = setTimeout(() => { if (openMenu === am) closeMenus(); }, 300); };
  brand.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') openAM(); });
  brand.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') closeAM(); });
  h.querySelector('.s-tile').addEventListener('click', () => { if (!isHub) go(C.root); else closeMenus(); });

  /* motiv */
  h.querySelector('#sTheme').onclick = () => setTheme(theme() === 'dark' ? 'light' : 'dark');
  setTheme(theme());
  if (isHub) return;

  if (files){
    h.querySelector('#sNew').onclick = doNew;
    h.querySelector('#sOpen').onclick = doOpen;
    h.querySelector('#sSave').onclick = doSave;
  }
  h.querySelectorAll('[data-exp]').forEach(b => b.onclick = () => doExport(+b.dataset.exp));
  const sm = h.querySelector('#sSetMenu');
  h.querySelector('#sSet').onclick = e => { buildSettings(sm); toggleMenu(sm, e.currentTarget); };
}

/* Nastavení – Klávesové zkratky, nastavení aplikace, nebezpečné akce dole */
function buildSettings(m){
  const items = [{label:'Klávesové zkratky', icon:'keyboard', key:'?', run:shortcuts}];
  const own = (C.settings && C.settings()) || [];
  if (own.length) items.push('-', ...own);
  const danger = (C.danger && C.danger()) || [];
  if (danger.length) items.push('-', ...danger.map(d => ({...d, danger:true})));
  fillMenu(m, items);
}

/* ---------- patička, lišta pro malé obrazovky, přetažení souboru ---------- */
function footer(){
  const r = A, isHub = C.app === 'hub';
  doc.body.appendChild(el(`<footer class="s-footer"><span><b>${esc(isHub ? S.brand.name : r.name.toUpperCase())}</b> · ${esc(r.year)} · verze ${esc(r.version)} · Created by Martin Hejhal.</span></footer>`));
}
function pcBar(){
  const small = innerWidth < 1024 || matchMedia('(pointer: coarse)').matches;
  if (!small || ss.getItem(PREFIX + 'pc-ok')) return;
  const b = el(`<div class="s-bar phone">${icon('monitor')}<span class="s-grow">SestaCode je určený pro počítač s myší a klávesnicí. Na menší nebo dotykové obrazovce nemusí vše fungovat.</span><button type="button" class="s-x" aria-label="Zavřít">${icon('x')}</button></div>`);
  b.querySelector('button').onclick = () => { ss.setItem(PREFIX + 'pc-ok','1'); b.remove(); dispatchEvent(new Event('resize')); };
  $('.s-header').after(b);
}
function dropZone(){
  if (!C.load) return;
  const z = el('<div class="s-drop">Pusť soubor sem</div>'); doc.body.appendChild(z);
  let n = 0;
  const hasFile = e => [...(e.dataTransfer && e.dataTransfer.types || [])].includes('Files');
  addEventListener('dragenter', e => { if (!hasFile(e)) return; n++; z.classList.add('show'); });
  addEventListener('dragleave', e => { if (!hasFile(e)) return; if (--n <= 0){ n = 0; z.classList.remove('show'); } });
  addEventListener('dragover', e => { if (hasFile(e)) e.preventDefault(); });
  addEventListener('drop', async e => {
    if (!hasFile(e)) return; e.preventDefault(); n = 0; z.classList.remove('show');
    const f = e.dataTransfer.files[0]; if (!f) return;
    const text = await f.text();
    guard(() => receive(text, f.name));
  });
}

/* ---------- tažení levého sloupce ---------- */
function resizer(){
  if (!C.panel) return;
  const panel = typeof C.panel === 'string' ? $(C.panel) : C.panel; if (!panel) return;
  const host = panel.parentElement; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const key = PREFIX + 'panel:' + C.app, MIN = 300, root = doc.documentElement;
  const max = () => Math.max(MIN, Math.round(innerWidth * 0.6));
  const apply = w => { w = Math.round(Math.min(max(), Math.max(MIN, w))); root.style.setProperty('--s-panel', w + 'px'); return w; };
  try { const v = +ls.getItem(key); if (v) apply(v); } catch(e){}
  const h = el('<div class="s-resizer" role="separator" aria-orientation="vertical" aria-label="Šířka levého sloupce" title="Tažením změníš šířku sloupce, dvojklikem vrátíš výchozí"></div>');
  host.appendChild(h);
  const place = () => { h.style.left = (panel.getBoundingClientRect().right - host.getBoundingClientRect().left) + 'px'; };
  place(); addEventListener('resize', place); new ResizeObserver(place).observe(panel);
  let x0, w0, raf;
  h.addEventListener('pointerdown', e => { e.preventDefault(); h.setPointerCapture(e.pointerId); x0 = e.clientX; w0 = panel.getBoundingClientRect().width; h.classList.add('drag'); doc.body.classList.add('s-resizing'); });
  h.addEventListener('pointermove', e => { if (!h.classList.contains('drag')) return; apply(w0 + e.clientX - x0); cancelAnimationFrame(raf); raf = requestAnimationFrame(() => dispatchEvent(new Event('resize'))); });
  const end = () => { if (!h.classList.contains('drag')) return; h.classList.remove('drag'); doc.body.classList.remove('s-resizing'); try { ls.setItem(key, Math.round(panel.getBoundingClientRect().width)); } catch(e){} dispatchEvent(new Event('resize')); };
  h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
  h.addEventListener('dblclick', () => { root.style.removeProperty('--s-panel'); try { ls.removeItem(key); } catch(e){} dispatchEvent(new Event('resize')); });
}

/* ---------- karty v levém panelu: po otevření je rozbalená jen první ---------- */
S.cards = function(root){
  (typeof root === 'string' ? $(root) : root).querySelectorAll('.c-card').forEach((c, i) => {
    const h = c.querySelector('.c-card-h');
    if (!h.querySelector('.c-chev')) h.insertAdjacentHTML('beforeend', icon('chev', 's-i c-chev'));
    c.classList.toggle('closed', i > 0);
    h.setAttribute('aria-expanded', String(i === 0));
    h.onclick = () => { const cl = c.classList.toggle('closed'); h.setAttribute('aria-expanded', String(!cl)); };
  });
};
S.openCard = function(c, open = true){ c = typeof c === 'string' ? $(c) : c; if (!c) return; c.classList.toggle('closed', !open); const h = c.querySelector('.c-card-h'); h && h.setAttribute('aria-expanded', String(open)); };

/* ---------- hodiny v hlavičce rozcestníku ---------- */
function clock(){
  const box = el('<span class="s-clock" aria-live="off"></span>');
  $('.s-actions').prepend(box);
  const tick = () => {
    const d = new Date();
    box.textContent = d.toLocaleTimeString('cs-CZ', {hour:'numeric', minute:'2-digit'}) + ' · ' + d.toLocaleDateString('cs-CZ', {weekday:'short', day:'numeric', month:'numeric', year:'numeric'});
    S.onMinute && S.onMinute(d);
    setTimeout(tick, 60000 - d.getSeconds() * 1000 - d.getMilliseconds() + 50);
  };
  tick();
}

/* ---------- klávesy ---------- */
function keys(e){
  const typing = /INPUT|TEXTAREA|SELECT/.test((doc.activeElement||{}).tagName||'') || (doc.activeElement && doc.activeElement.isContentEditable);
  const mod = e.ctrlKey || e.metaKey, k = (e.key||'').toLowerCase();
  if (e.key === 'Escape' && openMenu){ closeMenus(); e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (C.app === 'hub' || doc.querySelector('.s-modal-bg')) return;
  if (mod && !e.altKey && !e.shiftKey && k === 's' && C.serialize){ e.preventDefault(); e.stopImmediatePropagation(); doSave(); return; }
  if (typing) return;
  if (mod && !e.altKey && k === 'o' && C.load){ e.preventDefault(); e.stopImmediatePropagation(); doOpen(); return; }
  if (e.altKey && !mod && e.code === 'KeyN' && C.actions.new){ e.preventDefault(); e.stopImmediatePropagation(); doNew(); return; }
  if (e.key === '?' && (!C.helpKey || C.helpKey())){ e.preventDefault(); e.stopImmediatePropagation(); shortcuts(); }
}

/* ---------- start ---------- */
S.init = function(cfg){
  C = Object.assign({ actions:{} }, cfg);
  C.root = C.root ?? '../';
  A = C.app === 'hub' ? { id:'hub', name:S.brand.name, icon:'code', version:S.brand.version, year:S.brand.year, desc:S.brand.tagline } : S.apps.find(a => a.id === C.app);
  if (!A) throw new Error('Aplikace ' + C.app + ' není v shared/apps.js');
  doc.body.classList.add('sesta');
  doc.body.classList.add(isMac ? 'is-mac' : 'is-win');
  S.icons(doc);
  /* klávesy napsané přímo v HTML (<kbd>Ctrl</kbd>) se na Macu přepíšou */
  if (isMac) doc.querySelectorAll('kbd').forEach(k => { if (k.textContent === 'Ctrl') k.textContent = '⌘'; else if (k.textContent === 'Alt') k.textContent = 'Option'; });
  header(); footer(); pcBar(); dropZone(); resizer();
  if (C.app === 'hub' && C.clock) clock();
  addEventListener('keydown', keys, true);
  addEventListener('resize', tipHide);
  if (C.app !== 'hub'){
    const inc = ss.getItem(PREFIX + 'incoming');
    if (inc){ ss.removeItem(PREFIX + 'incoming'); try { const o = JSON.parse(inc); if (o.app === C.app){ C.load(o.data, {name:o.name}); st.dirty = false; st.saved = 'Otevřeno ' + o.name; toast('Otevřeno: ' + o.name, {kind:'ok'}); } } catch(e){ toast('Soubor nejde otevřít.', {kind:'err'}); } }
  }
  refresh();
  return S;
};

/* ---------- společné pomůcky pro výsledky ---------- */
/* čas MM:SS, volitelně s desetinami MM:SS,d */
S.fmtTime = (ms, tenths) => {
  ms = Math.max(0, ms || 0);
  const t = Math.floor(ms / 100), s = Math.floor(t / 10), m = Math.floor(s / 60);
  const base = String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  return tenths ? base + ',' + (t % 10) : base;
};
/* kruhový ukazatel procent; barva jako CSS hodnota, např. 'var(--ok)' */
S.ring = (pct, color) => {
  const C = 2 * Math.PI * 44;
  return `<div class="c-ring"><svg width="100%" height="100%" viewBox="0 0 110 110"><circle cx="55" cy="55" r="44" fill="none" style="stroke:var(--bg-subtle)" stroke-width="10"/>` +
    `<circle class="c-arc" cx="55" cy="55" r="44" fill="none" style="stroke:${color};transition:stroke-dashoffset 1s ease-out" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-target="${(C * (1 - pct / 100)).toFixed(1)}"/></svg>` +
    `<div class="pct">${pct} %</div></div>`;
};
S.animateRings = root => requestAnimationFrame(() => requestAnimationFrame(() => root.querySelectorAll('.c-arc').forEach(a => { a.style.strokeDashoffset = a.dataset.target; })));
/* <i data-i="název"></i> v HTML se nahradí ikonou */
S.icons = root => root.querySelectorAll('i[data-i]').forEach(e => { e.outerHTML = icon(e.dataset.i, 's-i' + (e.className ? ' ' + e.className : '')); });
S.markSaved = () => { st.dirty = false; refresh(); };
})();
