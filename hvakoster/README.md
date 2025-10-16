# HvaKoster.no

Folkeforankret prissøk bygget som statisk klientside. `app.js` laster `data/items.json`, gjør enkel tekstmatching og viser resultater i kort.

## Legge til priser
1. Åpne `data/items.json`.
2. Legg inn et nytt objekt på formatet:
   ```json
   {
     "q": "Hva koster X?",
     "answer": "Kort svar med pris og eventuell range",
     "source": "Kilde eller sted",
     "updated": "YYYY-MM-DD"
   }
   ```
3. Hold svarene korte og konkrete. Bruk ISO-dato for feltet `updated`.
4. Lagre filen og last `index.html` i nettleser for å verifisere at kortet kommer opp og søket finner posten.

## Lokalt søk
- Åpne `index.html` fra filsystemet. Søkeboksen reagerer fortløpende.
- Resultatlisten viser topp 6 poster sortert etter dato når feltet er tomt.
- Console logger feil dersom `items.json` ikke kan hentes.

## Forbedringer
- Vurder å legge til feltet `range` eller `notes` i JSON og juster `app.js` for å vise dem.
- Kan utvides med enkel strengmatching for synonymer (eks. "strøm" vs. "kraft") eller mer avansert vekting.
- Legg inn `providers.json` for affiliate-lenker dersom du får partnere.
