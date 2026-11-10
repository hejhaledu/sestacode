/* =====================================================================
   SESTA.CODE Junior – SPOLEČNÉ JÁDRO (sdílí ho rozcestník i všechny miniaplikace)
   ---------------------------------------------------------------------
   Obsahuje:
     helpers          – $, esc, clamp, shuffle, sample
     Storage          – bezpečné ukládání do localStorage (bez něj aplikace běží dál)
     Settings         – uživatelská nastavení
     UI               – potvrzovací okno, hlášky, formát času, stahování souborů, kruhový graf
     start(options)   – připojí horní lištu, okna a směrování klávesnice
   Použití v miniaplikaci:
     <body data-root="../../" data-app="moje-id">
     <script src="../../apps.js"></script>
     <script src="../../shared/sesta-core.js"></script>
     SestaCore.start({ init(){…}, onKey(e){…}, onBlur(){…} });
   ===================================================================== */
(function(){
  'use strict';

  /* ---------- Pomocné funkce ---------- */
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  function shuffle(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function sample(a,k){ return shuffle(a).slice(0,k); }

  /* ---------- Storage – všechny klíče mají předponu, aby se nepletly s jinými weby na stejné doméně ---------- */
  const Storage = (() => {
    const P = 'sestajr_';
    let ok = false;
    try { localStorage.setItem(P+'test','1'); localStorage.removeItem(P+'test'); ok = true; } catch(e){ ok = false; }
    return {
      available: () => ok,
      get(key, fallback){
        if(!ok) return fallback;
        try { const v = localStorage.getItem(P+key); return v === null ? fallback : JSON.parse(v); } catch(e){ return fallback; }
      },
      set(key, value){
        if(!ok) return false;
        try { localStorage.setItem(P+key, JSON.stringify(value)); return true; } catch(e){ return false; }
      }
    };
  })();

  /* ---------- Uživatelská nastavení (jeden objekt pro všechny miniaplikace) ---------- */
  const Settings = (() => {
    const s = Object.assign({}, Storage.get('settings', {}) || {});
    return { get: (k, def) => (k in s ? s[k] : def), set(k, v){ s[k] = v; Storage.set('settings', s); } };
  })();

  /* ---------- UI komponenty ---------- */
  const UI = (() => {
    function fmtTime(ms, tenths){
      ms = Math.max(0, ms || 0);
      const t = Math.floor(ms/100), s = Math.floor(t/10), m = Math.floor(s/60);
      const base = String(m).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
      return tenths ? base + ',' + (t%10) : base;
    }
    let toastTimer = null;
    function toast(msg, kind){
      const el = $('toast'); if(!el) return;
      el.textContent = msg; el.className = 'toast show ' + (kind || '');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.className = 'toast'; }, 2800);
    }
    let resolver = null;
    function confirm({ title, text, ok = 'Potvrdit', cancel = 'Zrušit', danger = false }){
      if(resolver) closeModal(false);
      return new Promise(res => {
        resolver = res;
        $('mTitle').textContent = title; $('mText').textContent = text;
        $('mYes').textContent = ok; $('mNo').textContent = cancel;
        $('mYes').className = 'btn ' + (danger ? 'danger' : 'pri');
        $('modal').hidden = false; $('mYes').focus();
      });
    }
    function closeModal(v){ $('modal').hidden = true; const r = resolver; resolver = null; if(r) r(v); }
    const modalOpen = () => ($('modal') && !$('modal').hidden) || ($('mobileNote') && !$('mobileNote').hidden);
    function modalKey(e){
      if(!$('mobileNote').hidden){ if(e.key === 'Enter' || e.key === 'Escape'){ e.preventDefault(); $('mobileOk').click(); } return; }
      if(e.key === 'Escape'){ e.preventDefault(); closeModal(false); }
      else if(e.key === 'Enter'){ e.preventDefault(); closeModal(true); }
    }
    function download(name, blob){
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }
    function stamp(){ const d = new Date(), p = n => String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes()); }
    function dateCz(iso){ try{ const d = new Date(iso); return d.getDate()+'. '+(d.getMonth()+1)+'. '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }catch(e){ return ''; } }
    function ring(pct, color){
      const C = 2*Math.PI*52;
      return '<div class="ring"><svg width="100%" height="100%" viewBox="0 0 130 130"><circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="11"/>' +
        '<circle class="arc" cx="65" cy="65" r="52" fill="none" stroke="'+color+'" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+C.toFixed(1)+'" data-target="'+(C*(1-pct/100)).toFixed(1)+'" style="transition:stroke-dashoffset 1s ease-out"/></svg>' +
        '<div class="pct">'+pct+' %</div></div>';
    }
    function animateRings(root){ requestAnimationFrame(() => requestAnimationFrame(() => root.querySelectorAll('.arc').forEach(a => a.style.strokeDashoffset = a.dataset.target))); }
    return { fmtTime, toast, confirm, closeModal, modalOpen, modalKey, download, stamp, dateCz, ring, animateRings };
  })();

  /* ---------- Registr miniaplikací (apps.js) ---------- */
  const apps = () => (window.SESTA_APPS || []).filter(a => a && a.id && a.path && !a.hidden);
  const root = () => (document.body.dataset.root || '');
  const appUrl = a => root() + a.path + 'index.html';
  const homeUrl = () => root() + 'index.html';
  // Krátký text pod kartou na domovské stránce (např. nejlepší čas). Miniaplikace ho nastaví sama.
  const setMeta = (id, text) => Storage.set('meta_' + id, String(text));
  const getMeta = id => Storage.get('meta_' + id, '');

  /* ---------- Horní lišta ---------- */
  const MAX_TABS = 4;   // při více miniaplikacích se lišta přepne na rozbalovací nabídku
  const HOME_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>';
  function mountHeader(current){
    const h = $('sestaHeader'); if(!h) return;
    const list = apps();
    const tab = (a, i) => '<a class="tab' + (a.id === current ? ' on' : '') + '" href="' + esc(appUrl(a)) + '"' + (a.id === current ? ' aria-current="page"' : '') + '><b>' + (i + 1) + '</b>' + esc(a.name) + '</a>';
    let nav;
    if(list.length <= MAX_TABS){
      nav = '<nav class="tabs" aria-label="Miniaplikace">' + list.map(tab).join('') + '</nav>';
    } else {
      const ci = list.findIndex(a => a.id === current);
      nav = '<nav class="tabs" aria-label="Miniaplikace">' + (ci >= 0 ? tab(list[ci], ci) : '') +
        '<div class="appmenu"><button class="tab" id="appMenuBtn" aria-haspopup="true" aria-expanded="false">Všechny aplikace ▾</button>' +
        '<div class="menu" id="appMenu" hidden>' + list.map((a, i) => '<a href="' + esc(appUrl(a)) + '"' + (a.id === current ? ' class="on"' : '') + '><b>' + (i + 1) + '</b>' + esc(a.name) + '</a>').join('') + '</div></div></nav>';
    }
    h.innerHTML =
      '<a class="brand" href="' + esc(homeUrl()) + '" title="Domovská stránka"><span class="logo"><span class="a">SESTA</span><span class="b">.</span><span class="c2">CODE</span></span><span class="jr">JUNIOR</span></a>' +
      '<div class="hright">' + nav +
      '<a class="homebtn' + (current === 'home' ? ' on' : '') + '" href="' + esc(homeUrl()) + '" aria-label="Návrat na domovskou stránku">' + HOME_ICON + '<span>Domů</span></a></div>';
    const btn = $('appMenuBtn');
    if(btn){
      const menu = $('appMenu');
      btn.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); };
      document.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); });
    }
  }

  /* ---------- Společná okna (vloží se do každé stránky) ---------- */
  function mountOverlays(){
    const wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>' +
      '<div class="overlay" id="modal" hidden><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle"><h3 id="mTitle"></h3><p id="mText"></p>' +
        '<div class="btnrow"><button class="btn sec" id="mNo">Zrušit</button><button class="btn pri" id="mYes">Potvrdit</button></div></div></div>' +
      '<div class="overlay" id="mobileNote" hidden><div class="modal"><h3>Aplikace je pro počítač</h3><p>SESTA.CODE Junior je optimalizovaná pro počítač s Windows, myší a klávesnicí (Chrome nebo Edge). Na malé nebo dotykové obrazovce nemusí vše fungovat.</p>' +
        '<div class="btnrow"><button class="btn pri" id="mobileOk">Rozumím, pokračovat</button></div></div></div>';
    while(wrap.firstChild) document.body.appendChild(wrap.firstChild);
    $('mYes').onclick = () => UI.closeModal(true);
    $('mNo').onclick = () => UI.closeModal(false);
    $('modal').addEventListener('pointerdown', e => { if(e.target.id === 'modal') UI.closeModal(false); });
    $('mobileOk').onclick = () => { $('mobileNote').hidden = true; try{ sessionStorage.setItem('sestajr_mobile_ok','1'); }catch(e){} };
    let dismissed = false; try{ dismissed = sessionStorage.getItem('sestajr_mobile_ok') === '1'; }catch(e){}
    if(!dismissed && (window.matchMedia('(pointer: coarse)').matches || Math.min(screen.width, window.innerWidth) < 900)) $('mobileNote').hidden = false;
  }

  /* ---------- Start stránky ----------
     options.init()     – spustí se po připojení lišty a oken
     options.onKey(e)   – klávesy (nevolá se, když je otevřené okno)
     options.onBlur()   – okno přestalo být aktivní / stránka se opouští (pozastavení časomíry) */
  function start(options = {}){
    const id = document.body.dataset.app || 'home';
    mountHeader(id);
    mountOverlays();
    document.addEventListener('keydown', e => {
      if(UI.modalOpen()){ UI.modalKey(e); return; }
      if(options.onKey) options.onKey(e);
    });
    const blur = () => { if(options.onBlur) options.onBlur(); };
    window.addEventListener('blur', blur);
    window.addEventListener('pagehide', blur);
    document.addEventListener('visibilitychange', () => { if(document.hidden) blur(); });
    if(options.init) options.init();
  }

  window.SestaCore = { $, esc, clamp, shuffle, sample, Storage, Settings, UI, apps, appUrl, homeUrl, setMeta, getMeta, start };
})();
