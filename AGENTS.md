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
