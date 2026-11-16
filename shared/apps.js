/* =====================================================================
   SestaCode – seznam aplikací
   Jediné místo, kde se aplikace registrují. Odtud se plní rozcestník,
   nabídka aplikací u loga a patička.
   Novou aplikaci stačí přidat sem (a její složku do repozitáře).
   Položky:
     id      – název složky a identifikátor (malá písmena, bez diakritiky)
     name    – název v hlavičce a na rozcestníku
     path    – složka aplikace, s lomítkem na konci
     icon    – název ikony ze shared/sesta-shell.js (flow, keys, types, python, code…)
     group   – skupina na rozcestníku (id ze SESTA.groups)
     desc    – krátký popis (nabídka aplikací, podtitulek v hlavičce)
     long    – delší popis na kartě rozcestníku
     version, year – verze a rok vydání (hlavička a patička)
     hidden  – true = aplikace se nikde nezobrazí (rozpracovaná)
   ===================================================================== */
window.SESTA = window.SESTA || {};
SESTA.brand = {
  name: 'SestaCode',
  version: '1.1',
  year: 2026,
  tagline: 'Procvičování programování',
  school: 'Základní škola Šestajovice, okres Praha-východ',
  author: 'Martin Hejhal'
};
/* Rozvrh vyučovacích hodin pro časovou osu na rozcestníku */
SESTA.bells = [
  ['8:00','8:45'], ['8:55','9:40'], ['10:00','10:45'], ['10:55','11:40'], ['11:50','12:35'],
  ['12:45','13:30'], ['13:40','14:25'], ['14:35','15:20'], ['15:30','16:15']
];
/* Skupiny aplikací na rozcestníku */
SESTA.groups = [
  { id: 'junior', name: 'Junior', note: '5.–6. ročník' },
  { id: 'python', name: 'Python', note: '8.–9. ročník' }
];
SESTA.apps = [
  {
    id: 'flowchart', name: 'Flowchart Puzzle', path: 'flowchart/', icon: 'flow', group: 'junior',
    desc: 'Vývojové diagramy',
    long: 'Sestav strukturu algoritmu z prázdných bloků: sekvence, podmínka a cyklus. Hlavně vnořování struktur do sebe.',
    version: '1.1', year: 2026
  },
  {
    id: 'symbol-sprint', name: 'Symbol Sprint', path: 'symbol-sprint/', icon: 'keys', group: 'junior',
    desc: 'Programátorské znaky na klávesnici',
    long: 'Napiš 15 programátorských znaků co nejrychleji. Naučíš se, kde na české klávesnici najdeš závorky, uvozovky nebo rovnítko.',
    version: '1.1', year: 2026
  },
  {
    id: 'type-detective', name: 'Type Detective', path: 'type-detective/', icon: 'types', group: 'junior',
    desc: 'Datové typy',
    long: 'Urči datový typ hodnoty podle zápisu: Integer, String, Boolean, List. Poznáš rozdíl mezi 15 a "15".',
    version: '1.1', year: 2026
  },
  {
    id: 'python', name: 'Python', path: 'python/', icon: 'python', group: 'python',
    desc: 'Procvičování Pythonu',
    long: 'Čtyři lekce: výstup, vstup, podmínka IF a cyklus FOR. Kolo 10 úloh, chyby si na konci zopakuješ.',
    version: '1.1', year: 2026
  }
];
