# warpedev.github.io

Warpedev er et lettvekts-univers av mikrosider og verktøy levert fra én GitHub
Pages-instans. Huben (`index.html`) lister alle prosjektene, mens hver mikroside
ligger i en egen mappe (`/ferie`, `/hvakoster`, …) uten build-steg.

## Struktur

```
/assets/            – delte stiler, ikoner og hjelpefunksjoner
/data/              – hub-data (projects.json)
/public/projects.json – manifest for nivå-3 produkter (brukes til kortene)
/ferie/             – Neste ferie og fridager per fylke
/hvakoster/         – Folkeforankret prissøk
/scripts/           – Hubens JavaScript (laster data/projects.json)
/styles/            – Hubens egne stiler
index.html          – Hub-forsiden
```

Maler for nye mikrosider følger samme oppsett: `index.html`, `styles.css`,
`app.js`, og en `data/`-mappe etter behov. Bruk delte tokens fra
`assets/styles/base.css` og utils fra `assets/scripts/utils.js` for å holde
design og logikk konsistent.

## Publisering

1. Commit og push til `main`.
2. GitHub Pages er konfigurert til å serve `main`-grenen fra rotmappen.
3. Nye mikrosider blir tilgjengelige på `https://warpedev.github.io/<mappe>/`.

## Oppdatere prosjektlisten

`data/projects.json` brukes av huben for å rendere kortene. Oppdater filen med
`url`, `meta` og eventuelt `status: "upcoming"` når nye mikrosider kommer til.
`public/projects.json` holder manifestet for produkter på nivå 3 (Spontis,
CodeFront, Growr) og styrer lenker/«sist oppdatert»-info i kortene.

## Validering

Kjør `node scripts/validate.js` for å sjekke at alle JSON-filer følger forventet
struktur (feriedatoer, prisdata og prosjektlisten).

## Neste steg

- Bygg videre på de delte komponentene (varianter av hero/nav/footers, listekort).
- Dokumenter nye mikrosider i egne README-er, og lenk dem i huben.
- Legg til datasett for kommende år (f.eks. `ferier-2026.json`) og vurder kildehenvisninger i JSON.
- Vurder skript/UI for å oppdatere `public/projects.json` uten håndredigering.
- Utforsk enkel feed-cache (HN, Reddit, Tek.no) og internship-kilder.
