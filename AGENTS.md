# GoSafe – vaste werkwijze

Dit bestand is leidend voor iedere Codex- of ChatGPT-werksessie in deze repository.

## Eén opslag- en publicatieroute

- Browser-testbare prototypes staan uitsluitend in `PeterTPHC/GoSafe-prototype` en worden via GitHub Pages gepubliceerd.
- Projectdocumentatie staat uitsluitend in de bestaande Google Drive-map `GoSafe`.
- Maak geen tweede repository, ChatGPT Site, los Word-document of andere publicatieroute, tenzij de gebruiker dat uitdrukkelijk vraagt.
- Is de gewenste bestemming niet duidelijk, vraag dit voordat er een nieuw bestand of kanaal wordt aangemaakt.

## Bestaande ingangen

- Klantflow: `index.html`
- Admin/polisdeel: `admin.html`
- Realtime procesmonitor in admin: `admin.html#processes`
- Prolongatievoorraad in admin: `admin.html#renewals`
- Vaste doorverwijzing: `process-monitor.html`
- Gedeelde assets: `assets/`

## Werkwijze per wijziging

1. Lees eerst dit bestand en inspecteer de actuele `main`-branch.
2. Raadpleeg waar nodig de actuele documentatie in de Drive-map `GoSafe`.
3. Werk bestaande pagina's bij of voeg alleen de expliciet gevraagde zelfstandige pagina toe.
4. Publiceer op `main` in deze repository.
5. Controleer de werkende GitHub Pages-URL in een browser voordat de wijziging als klaar wordt gemeld.
6. Werk relevante documentatie in de bestaande Drive-documenten bij; maak geen lokale documentkopieën.

## Procesmonitoring

- De globale procesmonitor gebruikt exact dezelfde admin-shell, navigatie en componenten als `admin.html`.
- In ieder aanvraag- en polisdossier staat een tab `Processen` met de voortgang op dossierniveau.
- Processtatussen worden realtime bijgewerkt; voeg geen handmatige refreshknop toe.
- Functioneel uitgangspunt: initiële API-snapshot, daarna status-events via SSE of WebSocket, inclusief automatische reconnect en zichtbaar signaal als de verbinding niet actueel is.

## Admin UX

- Ontwerp de admin als operationele werkomgeving: toon eerst dossiers, uitzonderingen en benodigde acties.
- Gebruik overal dezelfde admin-shell, navigatie, paginakoppen, kaarten, tabellen, statussen en acties.
- Voeg alleen uitleg toe als die nodig is om een keuze veilig te kunnen maken; vermijd introductietekst die de paginatitel of tabel herhaalt.
- Toon tellingen alleen als ze een actie prioriteren, een filterresultaat verduidelijken of een actuele processtatus aangeven.
- Behoud de vaste menugroepen: `Dagelijks werk`, `Bewaking`, `Administratie`, `Inzicht` en `Beheer`.
- Houd processtatussen realtime en zichtbaar zonder refreshknop.

## Prolongatie en mutatie

- Vooraankondiging is een los, automatisch communicatieproces en maakt geen polisversie of financiële boeking.
- De prolongatievoorraad kijkt automatisch vooruit, toetst toekomstige productregels en geplande mutaties en maakt verwachte uitval vóór de prolongatiedag zichtbaar.
- De definitieve prolongatie start automatisch op de laatste dag van de lopende termijn; de nieuwe termijn start de kalenderdag erna. Bijvoorbeeld: geldig tot en met 25 augustus, nieuwe termijn vanaf 26 augustus.
- GoSafe orkestreert en berekent. ANVA verzorgt formele registratie, financiële boeking en incasso; voeg geen GoSafe-incassostap toe aan het prolongatieproces.
- Een mutatie vóór of op het huidige termijn-einde levert na ANVA direct polis en nota op, ook als de ingangsdatum later is. Op de ingangsdatum wordt alleen de voorbereide versie actief.
- Een mutatie ná de komende prolongatie blijft akkoord als delta, krijgt status `Akkoord – wacht op prolongatie`, wordt daarna op de vernieuwde polisversie geherbaseerd en opnieuw gevalideerd. De klant krijgt direct een bevestiging en de stukken pas na prolongatie en ANVA-verwerking.
- Meerdere toekomstige mutaties worden chronologisch toegepast; iedere mutatie gebruikt de uitkomst van de vorige gebeurtenis.
