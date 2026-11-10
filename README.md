# SESTA.CODE Junior

Rozcestník výukových miniaplikací pro 5.–6. ročník ZŠ Šestajovice. Funguje offline i na GitHub Pages, bez serveru a bez externích knihoven.

## Struktura

```
index.html                    rozcestník (domovská stránka), karty se sestaví z apps.js
apps.js                       registr miniaplikací – jediné místo, kde se miniaplikace připojují
shared/sesta.css              společný design (barvy, panely, tlačítka, horní lišta)
shared/sesta-core.js          společné jádro (horní lišta, ukládání, okna, hlášky, formát času)
apps/flowchart/index.html     Flowchart Puzzle
apps/symbol-sprint/index.html Symbol Sprint
apps/type-detective/index.html Type Detective
apps/sablona/index.html      šablona pro novou miniaplikaci (není v registru)
```

Každá miniaplikace je samostatná stránka, kterou jde otevřít i přímo. Úprava jedné miniaplikace nezasahuje do ostatních.

## Přidání nové miniaplikace

1. Zkopíruj složku `apps/sablona` a přejmenuj ji, např. na `apps/moje-hra`.
2. V jejím `index.html` přepiš `data-app="sablona"` na `data-app="moje-hra"`.
3. Do `apps.js` přidej záznam s `id: 'moje-hra'` a `path: 'apps/moje-hra/'`.

Miniaplikace se pak sama objeví na domovské stránce i v horní liště. Při víc než čtyřech miniaplikacích se lišta přepne na rozbalovací nabídku „Všechny aplikace“. Rozpracovanou miniaplikaci skryješ položkou `hidden: true`.

## Zveřejnění na GitHub Pages

1. Nahraj obsah této složky do kořene repozitáře.
2. Settings → Pages → Source: *Deploy from a branch*, větev `main`, složka `/ (root)`.

## Ukládání

Data se ukládají do localStorage prohlížeče s předponou `sestajr_` (diagram, nejlepší časy, výsledky, nastavení). Všechny stránky GitHub Pages jednoho účtu sdílejí stejnou doménu, předpona proto brání kolizím s jinými projekty.
