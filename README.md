# SestaCode 1.1 – procvičování programování

Rozcestník a aplikace pro žáky ZŠ Šestajovice. Vzhled a kostra vychází z CabiNetu, barva značky je zelená. Běží jako statický web na GitHub Pages, bez serveru. Jediná aplikace s databází je Aréna (Firebase, viz níže).

## Struktura

```
index.html                 rozcestník (časová osa hodin, karty všech aplikací)
shared/
  sesta.css                jediný zdroj vzhledu (barvy, písmo, hlavička, karty, lišta, plocha)
  sesta-shell.js           společné chování (hlavička, nabídka aplikací, Nastavení, zkratky, soubory, oznámení)
  apps.js                  seznam aplikací, rozvrh hodin
  fonts/                   Inter (rozhraní) a JetBrains Mono (kód), licence OFL
  logo-skoly.png           logo školy
flowchart/index.html       Flowchart Puzzle – vývojové diagramy
symbol-sprint/index.html   Symbol Sprint – programátorské znaky na klávesnici
type-detective/index.html  Type Detective – datové typy
python/index.html          Python – procvičování Pythonu (dříve SestaCode(Python))
arena/index.html           Aréna – programátorská hra pro třídu (tabule + telefony, Firebase)
sablona/index.html         šablona pro novou aplikaci (není v seznamu aplikací)
```

## Nahrání na GitHub Pages

1. Obsah této složky nahraj do kořene repozitáře.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Při každé změně ve `shared/` zvyš číslo `?v=…` (aktuálně `?v=1.1.1`) u odkazů na sdílené soubory ve všech stránkách, aby prohlížeče nenačítaly starou verzi.

Aplikace je potřeba zkoušet přes webový server (GitHub Pages nebo `python3 -m http.server`), ne dvojklikem na soubor.

## Jak přidat novou aplikaci

1. Zkopíruj složku `sablona` a přejmenuj ji (malá písmena, bez diakritiky).
2. Přidej záznam do `shared/apps.js` (id, název, složka, ikona, popisy, verze).
3. V nové stránce nastav `app:` v `SESTA.init` na stejné id a smaž řádek, kterým se šablona registruje sama.

Pro soubory `.json` předej v `SESTA.init` funkce `serialize`, `load` a `actions.new`. V hlavičce se pak objeví tlačítka Nový, Otevřít a Uložit. Pro export předej `actions.export`.

## Ukládání

- Výsledky, rekordy, vybraná lekce a rozpracovaný diagram se drží jen v paměti panelu prohlížeče (`sessionStorage`). Zavřením prohlížeče se smažou, takže na sdíleném počítači nic nezůstane.
- Trvale jde uložit jen diagram, a to do souboru `.json` (obálka `{"sestacode": "flowchart", "verze", "vytvoreno", "nazev", "data"}`). Starší soubory ze SESTA.CODE Junior jdou otevřít také.
- V `localStorage` je jen zvolený režim (`sestacode-rezim`, výchozí tmavý) a šířka levého sloupce. Klíče mají předponu `scode:` / `sestacode-`, aby se nepletly s CabiNetem na stejné doméně github.io.

## Windows a Mac

Kostra pozná systém (`SESTA.isMac`, `SESTA.platform`). Zkratky v bublinách a v přehledu zkratek se na Macu ukazují s ⌘ a Option (`SESTA.keyLabel`), `<kbd>Ctrl</kbd>` v textu stránky se přepíše na ⌘. Symbol Sprint má nápovědu kláves zvlášť pro Windows a pro Mac a v kartě Nápověda kláves jde systém přepnout ručně.

## Aréna

Programátorská hra pro celou třídu ve složce `arena/` (verze aplikace 4.2). Na rozdíl od ostatních aplikací nepoužívá `sesta-shell.js`: má vlastní tři obrazovky (vstup žáka s trenažérem, editor programu pro mobil, Správa pro tabuli). Ze SestaCode přebírá barvy, písmo ze `shared/fonts` a klíče s předponou `scode:arena:`; logo vede na rozcestník.

- Adresa: `…/arena/`, učitel přes odkaz Správa dole (heslo `informatika`). Ukázkový režim bez internetu: `…/arena/?demo=1`.
- Data: Firebase projekt `sestacode-arena` (Firestore europe-west3, anonymní přihlášení, autorizovaná doména `hejhaledu.github.io`). Knihovny Firebase 10.12.2 (gstatic) a qrcode-generator 1.4.4 (jsdelivr) se načítají z CDN.
- Ukládání: iniciály žáka jen v `sessionStorage` (na sdíleném PC se nemíchají), v `localStorage` jen data ukázkového režimu a zvolený režim.
