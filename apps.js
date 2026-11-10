/* =====================================================================
   SESTA.CODE Junior – REGISTR MINIAPLIKACÍ
   ---------------------------------------------------------------------
   Tady je jediné místo, kde se miniaplikace připojují k rozcestníku.
   Pořadí v seznamu = pořadí karet na domovské stránce a v horní liště.

   Novou miniaplikaci přidáš takto:
     1. Zkopíruj složku apps/sablona a přejmenuj ji (např. apps/moje-hra).
     2. V jejím index.html nastav data-app="moje-hra".
     3. Přidej sem záznam se stejným id a cestou path: 'apps/moje-hra/'.

   Položky záznamu:
     id      – jednoznačný identifikátor (stejný jako data-app v HTML)
     name    – název v liště a na kartě
     path    – složka miniaplikace vůči kořeni webu, s lomítkem na konci
     desc    – krátký popis procvičované dovednosti (karta na domovské stránce)
     chips   – štítky na kartě; mono: true = štítky v neproporcionálním písmu
     icon    – SVG ikona 38 × 38 (viewBox 0 0 40 40)
     hidden  – true = miniaplikace se nikde nezobrazí (rozpracovaná verze)
   ===================================================================== */
window.SESTA_APPS = [
  {
    id: 'flowchart',
    name: 'Flowchart Puzzle',
    path: 'apps/flowchart/',
    desc: 'Sestav strukturu algoritmu z prázdných bloků vývojového diagramu. Procvičíš sekvenci, rozhodování, opakování a hlavně vnořování struktur do sebe.',
    chips: ['Sekvence', 'Selekce IF', 'Cyklus', 'Vnořování'],
    icon: '<svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="3" width="14" height="7" rx="2" stroke="#79c0ff"/><path d="M20 10v4" stroke="rgba(255,255,255,.6)"/><path d="M20 14l7 5-7 5-7-5z" stroke="#d2a8ff"/><path d="M13 19H7v8M27 19h6v8" stroke="rgba(255,255,255,.6)"/><rect x="2" y="27" width="10" height="6" rx="1.6" stroke="#79c0ff"/><rect x="28" y="27" width="10" height="6" rx="1.6" stroke="#79c0ff"/><path d="M7 33v3h26v-3" stroke="rgba(255,255,255,.6)"/></svg>'
  },
  {
    id: 'symbol-sprint',
    name: 'Symbol Sprint',
    path: 'apps/symbol-sprint/',
    desc: 'Napiš 15 programátorských znaků co nejrychleji. Zapamatuješ si, kde na české klávesnici najdeš závorky, uvozovky, dvojtečku nebo rovnítko.',
    chips: ['( )', '[ ]', '"', ':', '=', '< >'],
    mono: true,
    icon: '<svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="34" height="22" rx="4" stroke="rgba(255,255,255,.6)"/><rect x="8" y="14" width="5" height="5" rx="1.2" stroke="#7ee787"/><rect x="17.5" y="14" width="5" height="5" rx="1.2" stroke="#ffa657"/><rect x="27" y="14" width="5" height="5" rx="1.2" stroke="#7ee787"/><path d="M11 25h18" stroke="#79c0ff"/></svg>'
  },
  {
    id: 'type-detective',
    name: 'Type Detective',
    path: 'apps/type-detective/',
    desc: 'Urči datový typ hodnoty podle toho, jak je zapsaná. Poznáš rozdíl mezi 15 a "15" nebo mezi True a "True".',
    chips: ['Integer', 'String', 'Boolean', 'List'],
    icon: '<svg width="38" height="38" viewBox="0 0 40 40" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="17" r="11" stroke="#79c0ff"/><path d="M25 25l10 10" stroke="#79c0ff"/><path d="M13 12h-1.5v10H13M21 12h1.5v10H21" stroke="#7ee787"/></svg>'
  }
];
