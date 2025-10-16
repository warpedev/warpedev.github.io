# Ferie.no

Statisk oversikt over neste skoleferier og fridager per fylke. Siden leser data fra `data/ferier-2025.json` og presenterer tidslinje, uke-nummer og hvor mange uker som gjenstår.

## Oppdatere datoer
1. Rediger `data/ferier-2025.json`. Strukturen er `{ "fylke": { "Navn på ferie": ["YYYY-MM-DD", "YYYY-MM-DD"], ... } }`.
2. Bruk ISO-format (åååå-mm-dd). Startdato skal være første fridag, sluttdato siste fridag.
3. Legg inn alle fylker du vil dekke. Feltnavn kan være små bokstaver (`"vestland"`).
4. Lagre filen og åpne `index.html` lokalt i nettleser for å kontrollere at tidslinjen viser riktige datoer.

## Lokal testing
- Åpne `index.html` direkte fra filsystemet i nettleser. All logikk kjører i klienten.
- Bruk DevTools → Console for å se eventuelle meldinger fra `app.js`.

## Årsskifte
- Kopier `data/ferier-2025.json` til en ny fil, f.eks. `data/ferier-2026.json`.
- Legg til det nye året i konstanten `YEARS` i `app.js`, og oppdater `YEAR_LABELS` med en lesbar label (eks. `2026: "2025–2026"`).
- Husk å oppdatere teksten i `index.html` dersom du legger til flere kontroll-elementer.

## Videreutvikling
- Legg inn ekstra metadata (f.eks. "Fridager" vs. "Planleggingsdager") som egne felt i JSON og vis dem i kortene.
- Vurder egen `README`-seksjon for kildehenvisninger per fylke.
