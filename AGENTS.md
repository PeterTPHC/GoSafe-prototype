# GoSafe – vaste werkwijze

Dit bestand is leidend voor iedere Codex- of ChatGPT-werksessie in deze repository.

## Eén opslag- en publicatieroute

- Browser-testbare prototypes staan uitsluitend in `PeterTPHC/GoSafe-prototype` en worden via GitHub Pages gepubliceerd.
- Voor prototypewijzigingen is doorlopend toestemming gegeven om direct naar de publieke `main`-branch te publiceren, inclusief de bestaande voorbeelddata; vraag hiervoor niet opnieuw om bevestiging.
- Projectdocumentatie staat uitsluitend in de bestaande Google Drive-map `GoSafe`.
- Maak geen tweede repository, ChatGPT Site, los Word-document of andere publicatieroute, tenzij de gebruiker dat uitdrukkelijk vraagt.
- Is de gewenste bestemming niet duidelijk, vraag dit voordat er een nieuw bestand of kanaal wordt aangemaakt.

## Bestaande ingangen

- Klantflow: `index.html`
- Admin/polisdeel: `admin.html`
- Realtime procesmonitor in admin: `admin.html#processes`
- Uitgaande e-mailbewaking in admin: `admin.html#communications`
- Generiek inhoud- en vertaalbeheer in admin: `admin.html#content`
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
- Toon in proceslijsten hoofdprocessen zoals `Nieuwe polis`, `Mutatie`, `Prolongatie`, `Royement` en later `Import`. Documentgeneratie, transactionele communicatie, ANVA-registratie en vergelijkbare technische orkestratie zijn stappen of kindprocessen binnen zo'n hoofdproces en staan niet als losse gelijkwaardige procesregels in het dossier.
- Iedere polis heeft minimaal één herkomstproces: `Nieuwe polis` voor een digitaal gesloten polis of later `Import` voor een gemigreerde polis. Een proces krijgt status `Actief` zodra de uitvoering is gestart en blijft actief zolang nog een stap openstaat, ook wanneer die stap wacht op een toekomstige interne activering. Gebruik `Gepland` alleen voor een proces dat nog niet is gestart. Sorteer actieve en andere niet-afgeronde processen vóór afgeronde processen.
- Processtatussen worden realtime bijgewerkt; voeg geen handmatige refreshknop toe.
- Functioneel uitgangspunt: initiële API-snapshot, daarna status-events via SSE of WebSocket, inclusief automatische reconnect en zichtbaar signaal als de verbinding niet actueel is.
- Gebruik voor hoofd- en kindprocessen dezelfde duurzame statussen: `requested`, `running`, `waiting_dependency`, `waiting_external`, `retry_scheduled`, `action_required`, `completed`, `cancelled` en `compensated`.
- Een domeinwijziging en het bijbehorende outbox-event worden atomair opgeslagen. Externe callbacks en webhooks worden geauthenticeerd en via een deduplicerende inbox verwerkt.
- Bij een onbekende externe uitkomst wordt eerst op correlation ID of idempotency key gereconcilieerd; stuur niet blind opnieuw.
- Handmatig herstel verloopt via gecontroleerde commando's met actor en reden. Wijzig technische processtatussen niet rechtstreeks.

## Documenten en communicatie

- `P09 Documentgeneratie (PDF)` gebruikt een externe renderdienst. GoSafe bevriest bron- en templateversie, valideert het resultaat en slaat iedere afgegeven versie immutable op.
- `P10 Transactionele communicatie` bevriest template, ontvanger, inhoud en exacte bijlagen en logt provideracceptatie, aflevering, bounce, klacht en fout afzonderlijk.
- `P10` is afgerond zodra de provider het bericht met message ID accepteert. Delivery, bounce en complaint blijven als append-only events doorlopen; een `delivery_required`-policy kan alsnog een gerichte actie maken.
- Inhoudelijke inkomende klantmail, replies en operationele mailboxafhandeling vallen buiten scope. Alleen providerterugmeldingen op uitgaande e-mail, zoals acceptatie, aflevering, soft/hard bounce, complaint en failed, worden verwerkt en aan het uitgaande bericht gekoppeld.
- Aanvraag en polis bewaren een communicatietaal. Bij het klaarzetten van een e-mail bevriest GoSafe de gebruikte taal, geadresseerde, afzender, inhoudssnapshot, bijlagen en het geplande verzendmoment.
- Berichttypen, variabelen, bijlagenbeleid en bezorgbeleid zijn codegedefinieerd. De adminmodule `Inhoud en vertalingen` beheert generieke systeemtekst per taal. Een beheerder kan optioneel een concept bewaren of de actieve tekst direct vervangen; toon geen versienummers of functionele planning. Technisch blijft de exact gebruikte inhoudssnapshot immutable bewaard.
- Exacte bodies en bijlagen staan in beveiligde communicatierecords. Het algemene activiteitenlog bevat alleen een veilige samenvatting en referenties, nooit raw bodies, PDF/base64, geheimen of onnodige persoonsgegevens.
- Vrijgavevolgorde: blokkerende bedrijfschecks → ANVA-akkoord → PDF valid/final in dossier → transactionele e-mail. Technisch voorbereiden mag, maar geen documentafgifte of klantmail vóór de vrijgavepoort.
- ANVA verzorgt formele registratie, financiële boeking en incasso. GoSafe ontvangt statussen en start geen eigen incassoproces.

## Admin UX

- Ontwerp de admin als operationele werkomgeving: toon eerst dossiers, uitzonderingen en benodigde acties.
- Gebruik overal dezelfde admin-shell, navigatie, paginakoppen, kaarten, tabellen, statussen en acties.
- Voeg alleen uitleg toe als die nodig is om een keuze veilig te kunnen maken; vermijd i