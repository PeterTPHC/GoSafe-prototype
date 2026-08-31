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
- Realtime communicatiebeheer in admin: `admin.html#communications`
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
- `P11 Inkomende e-mail en reply` verifieert en dedupliceert provider-events, verwerkt MIME en bijlagen veilig, koppelt via een opaque reply-token en maakt bij een inhoudelijke reply een taak. Een orphan of ambigue reply gaat altijd naar `action_required`.
- Berichttypen, variabelen, bijlagenbeleid en bezorgbeleid zijn codegedefinieerd. De admin beheert alleen inhoudsversies; gepubliceerde versies zijn immutable.
- Exacte bodies en bijlagen staan in beveiligde communicatierecords. Het algemene activiteitenlog bevat alleen een veilige samenvatting en referenties, nooit raw bodies, PDF/base64, geheimen of onnodige persoonsgegevens.
- Vrijgavevolgorde: blokkerende bedrijfschecks → ANVA-akkoord → PDF valid/final in dossier → transactionele e-mail. Technisch voorbereiden mag, maar geen documentafgifte of klantmail vóór de vrijgavepoort.
- ANVA verzorgt formele registratie, financiële boeking en incasso. GoSafe ontvangt statussen en start geen eigen incassoproces.

## Admin UX

- Ontwerp de admin als operationele werkomgeving: toon eerst dossiers, uitzonderingen en benodigde acties.
- Gebruik overal dezelfde admin-shell, navigatie, paginakoppen, kaarten, tabellen, statussen en acties.
- Voeg alleen uitleg toe als die nodig is om een keuze veilig te kunnen maken; vermijd introductietekst die de paginatitel of tabel herhaalt.
- Toon tellingen alleen als ze een actie prioriteren, een filterresultaat verduidelijken of een actuele processtatus aangeven.
- Behoud de vaste menugroepen: `Dagelijks werk`, `Bewaking`, `Administratie`, `Inzicht` en `Beheer`.
- Houd processtatussen realtime en zichtbaar zonder refreshknop.
- Communicatie gebruikt dezelfde realtime werkwijze. De admin toont operationeel `Wachtrij`, `Berichten` en `Templates`, zonder refreshknop.
- Overzichtslijsten tonen alleen gegevens die nodig zijn om een record te herkennen of een actie te starten. Laat interne dossiercodes, e-mailadressen en laatste-activiteitkolommen weg als die geen directe keuze ondersteunen.
- Werkvoorraadtaken hebben alleen de statussen `Open` en `Afgerond`; gebruik geen status `Bezig`. Toon daar geen prioriteit, eigenaar of uiterste datum.
- Een aanvraag die vóór indienen niet aan product- of acceptatieregels voldoet, kan niet worden ingediend en verschijnt niet als `Uitval`. Een niet-afgeronde klantflow wordt als `Concept` bewaard. `Ter akkoord` is alleen bedoeld voor een ingediende aanvraag met een afwijkend antwoord in de slotvragen en levert een taak in de werkvoorraad op.
- Menselijke behandeling is een werkvoorraadtaak en geen technisch proces. De tab `Processen` toont alleen duurzame technische orkestratie. Als een bounce of inkomende reply menselijke opvolging nodig heeft, registreert de technische verwerking een open communicatietaak in de werkvoorraad en rondt het technische proces na succesvolle routering af.
- Bedragen in aanvraag- en polisoverzichten staan rechts uitgelijnd.
- Bij het openen van een dossier springt de actieve hoofdnavigatie mee naar `Aanvragen` of `Polissen`, ongeacht vanuit welk overzicht het dossier is geopend.
- Plaats dossierwijzigingen bij het inhoudelijke onderdeel: `Polis wijzigen` bij `Verzekerde items` en `Relatie wijzigen` bij `Verzekeringnemer`; zet deze acties niet dubbel in de dossierkop.
- Noem de verstreken tijd van een proces `Doorlooptijd`, niet `Leeftijd`. Toon bij de dossiertab `Processen` geen telling; de lijst zelf toont de relevante processen.

## Prolongatie en mutatie

- Vooraankondiging is een los, automatisch communicatieproces en maakt geen polisversie of financiële boeking.
- De prolongatievoorraad kijkt automatisch vooruit, toetst toekomstige productregels en geplande mutaties en maakt verwachte uitval vóór de prolongatiedag zichtbaar.
- De definitieve prolongatie start automatisch op de laatste dag van de lopende termijn; de nieuwe termijn start de kalenderdag erna. Bijvoorbeeld: geldig tot en met 25 augustus, nieuwe termijn vanaf 26 augustus.
- GoSafe orkestreert en berekent. ANVA verzorgt formele registratie, financiële boeking en incasso; voeg geen GoSafe-incassostap toe aan het prolongatieproces.
- Een mutatie vóór of op het huidige termijn-einde levert na ANVA direct polis en nota op, ook als de ingangsdatum later is. Op de ingangsdatum wordt alleen de voorbereide versie actief.
- Een mutatie ná de komende prolongatie blijft akkoord als delta, krijgt status `Akkoord – wacht op prolongatie`, wordt daarna op de vernieuwde polisversie geherbaseerd en opnieuw gevalideerd. De klant krijgt direct een bevestiging en de stukken pas na prolongatie en ANVA-verwerking.
- Meerdere toekomstige mutaties worden chronologisch toegepast; iedere mutatie gebruikt de uitkomst van de vorige gebeurtenis.
- Het prolongatieoverzicht blijft een compacte operationele lijst met `Einde huidige termijn`, `Nieuwe termijn`, `Polis`, `Premie oud → nieuw` en `Voorcontrole`. Gebruik geen aparte actiekolom of niet-functionele resultaattelling; maak regels met uitval of een andere dossieractie rechtstreeks doorklikbaar. Toon daar ook geen relatie, geplande-mutatiekolom, vooraankondigingskolom of uitleg dat termijnen direct aansluiten.
