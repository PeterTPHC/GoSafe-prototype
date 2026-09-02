# GoSafe – vaste werkwijze

Dit bestand is leidend voor iedere Codex- of ChatGPT-werksessie in deze repository.

## Eén opslag- en publicatieroute

- Browser-testbare prototypes staan uitsluitend in `PeterTPHC/GoSafe-prototype` en worden via GitHub Pages gepubliceerd.
- De live klant-aanvraagstraat (zonder prototypemenu) staat in de backend-repo `GoSafe`, map `web/`, op https://gosafe.zeeroverhenk.nl/. Wijzig die niet in deze prototyperepo.
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
- Gebruikers en profielen in admin: `admin.html#users`
- Admin-login, activatie en herstel: authenticatielaag binnen `admin.html`
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
- Voeg alleen uitleg toe als die nodig is om een keuze veilig te kunnen maken; vermijd introductietekst die de paginatitel of tabel herhaalt.
- Toon tellingen alleen als ze een actie prioriteren, een filterresultaat verduidelijken of een actuele processtatus aangeven.
- Behoud de vaste menugroepen: `Dagelijks werk`, `Bewaking`, `Administratie`, `Inzicht` en `Beheer`.
- Houd processtatussen realtime en zichtbaar zonder refreshknop.
- Communicatie gebruikt dezelfde realtime werkwijze. Onder `Bewaking` toont `E-mails` uitsluitend uitgaande berichten in de tabs `Gepland` en `Verzonden`, zonder refreshknop. Toon bij beide datum en tijd; providerterugmeldingen zijn statussen of events bij het verzonden bericht.
- Op aanvraag- en polisniveau toont de tab `Communicatie` wat is verstuurd en wat klaarstaat. `Hele e-mail` opent een zelfstandig scherm met afzender, ontvanger, taal, onderwerp, volledig opgemaakt bericht, statusverloop en links naar beschikbare bijlagen. Toon een toekomstige bijlage als `Nog niet beschikbaar`.
- `Gelogd` betekent dat GoSafe een bericht of event duurzaam heeft vastgelegd. `Afgeleverd` betekent dat de provider aflevering bij de ontvangende mailserver heeft bevestigd; dit bewijst niet dat de ontvanger de e-mail heeft gelezen.
- `Inhoud en vertalingen` is één generieke vertaalmodule en gebruikt één consistente filterbalk. Maak geen schakelaar tussen e-mail en overige content als aparte beheermodules.
- Overzichtslijsten tonen alleen gegevens die nodig zijn om een record te herkennen of een actie te starten. Laat interne dossiercodes, e-mailadressen en laatste-activiteitkolommen weg als die geen directe keuze ondersteunen.
- Werkvoorraadtaken hebben alleen de statussen `Open` en `Afgerond`; gebruik geen status `Bezig`. Toon daar geen prioriteit, eigenaar of uiterste datum.
- Een aanvraag die vóór indienen niet aan product- of acceptatieregels voldoet, kan niet worden ingediend en verschijnt niet als `Uitval`. Een niet-afgeronde klantflow wordt als `Concept` bewaard. `Ter akkoord` is alleen bedoeld voor een ingediende aanvraag met een afwijkend antwoord in de slotvragen en levert een taak in de werkvoorraad op.
- Menselijke behandeling is een werkvoorraadtaak en geen technisch proces. De tab `Processen` toont alleen duurzame technische orkestratie. Als een hard bounce, complaint of blijvende verzendfout menselijke opvolging nodig heeft, registreert de technische verwerking een open communicatietaak in de werkvoorraad.
- Bedragen in aanvraag- en polisoverzichten staan rechts uitgelijnd.
- Bij het openen van een dossier springt de actieve hoofdnavigatie mee naar `Aanvragen` of `Polissen`, ongeacht vanuit welk overzicht het dossier is geopend.
- Plaats dossierwijzigingen bij het inhoudelijke onderdeel: `Polis wijzigen` bij `Verzekerde items` en `Relatie wijzigen` bij `Verzekeringnemer`; zet deze acties niet dubbel in de dossierkop.
- Noem de verstreken tijd van een proces `Doorlooptijd`, niet `Leeftijd`. Toon bij de dossiertab `Processen` geen telling; de lijst zelf toont de relevante processen.

## Gebruikers en rechten

- Beheer gebruikers en rechten op twee afzonderlijke schermen: `Gebruikers` voor basisgegevens en één toegekend profiel, en `Profielen` voor het toevoegen en bewerken van profielen en hun rechten.
- Profielen zijn configureerbare verzamelingen rechten. De rechtencatalogus kan tijdens de doorontwikkeling worden uitgebreid zonder de gebruikersstructuur te wijzigen.
- `Behandelaar` mag aanvragen, relaties en polissen behandelen en polissen muteren, maar heeft geen productbeheer. `Productbeheerder` mag productinstellingen en wijzigingssets beheren en publiceren, maar mag geen polis of relatie muteren.
- `Gebruikersbeheerder` beheert gebruikers en rechten, maar krijgt daardoor niet automatisch polis- of productrechten. Vermijd één algemene adminrol die alle bedrijfsrechten stilzwijgend combineert.
- Andere basisprofielen zijn `Finance`, `Inhoudbeheerder` en `Alleen lezen`. Geef ieder profiel alleen de schermen en commando's die voor die taak nodig zijn.
- Autorisatie wordt altijd server-side op ieder commando afgedwongen; het verbergen van menu's en knoppen is alleen UX. Leg toekenning, wijziging, blokkering en gebruik van kritieke rechten vast in het activiteitenlog.
- Actieve sessies worden ingetrokken zodra een gebruiker wordt geblokkeerd of een kritisch recht verliest. Productpublicatie en polismutatie vereisen afzonderlijke expliciete permissions en worden nooit uit alleen een schermrol afgeleid.
- Interne admingebruikers en klanten zijn aparte accounttypen met gescheiden loginroutes; een klantaccount kan nooit een adminprofiel krijgen.
- Een admingebruiker krijgt precies één configureerbaar profiel. Profielen zijn beheerbare permissionbundels en de permissioncatalogus kan worden uitgebreid; de combinatie productbeheer/productpublicatie met polis- of relatiewijzigingen blijft verboden.
- Adminauthenticatie loopt via een gespecialiseerde OIDC/OAuth 2.1 identity-provider. GoSafe bewaart geen adminwachtwoorden, wachtwoordhashes of reset-/activatietokens; alleen veilige providerreferenties en audit-events.
- Admin- en klantauthenticatie gebruiken gescheiden clients, routes en audiences. Valideer issuer, audience, nonce, accounttype en status; accepteer nooit een klanttoken op een admin-endpoint.
- TOTP-MFA is verplicht vóór activatie. E-mail en sms zijn geen admin-MFA-factor. Een uitnodiging is eenmalig en 72 uur geldig; een wachtwoordherstellink is eenmalig en 30 minuten geldig.
- Gebruik een BFF-sessie met `HttpOnly`, `Secure` en `SameSite`; bewaar geen tokens in browseropslag. Idle timeout is 30 minuten, absolute timeout 8 uur en access-tokenlooptijd maximaal 15 minuten.
- Kritieke acties vereisen herauthenticatie van maximaal 15 minuten oud: productpublicatie, gebruiker- of profielwijziging, MFA-reset, sessie-intrekking, procesherstel en financiële mutatie.
- De centrale rechtencatalogus gebruikt stabiele `resource.action`-codes: `dossier.read`, `application.review`, `task.manage`, `policy.mutate`, `relation.mutate`, `process.read`, `process.retry`, `communication.read`, `communication.delivery.manage`, `content.manage`, `finance.read`, `finance.manage`, `report.read`, `product.read`, `product.write`, `product.publish`, `user.read`, `user.write`, `profile.read`, `profile.write` en `audit.read`.
- Eerste profielmatrix: `Behandelaar` voor dossier-/aanvraag-/taak-/polis-/relatiebehandeling; `Productbeheerder` alleen voor product lezen/schrijven/publiceren; `Finance` voor dossier- en financieel beheer/rapportage; `Inhoudbeheerder` voor content en communicatielezen; `Alleen lezen` voor dossier/proces/communicatie/rapport; `Gebruikersbeheerder` voor gebruikers, profielen en IAM-audit.
- Autorisatie werkt deny-by-default op ieder backendrequest en controleert permission, resource en functiescheiding. V1-rechten gelden organisatiebreed voor GoSafe Nederland; leg objectcontext al wel vast voor latere scopes.
- Profielwijzigingen verhogen de autorisatieversie en gelden bij het eerstvolgende request. Blokkering of verlies van een kritisch recht trekt sessies direct in. Voorkom dat de laatste actieve gebruiker met `user.write` en `profile.write` wordt geblokkeerd of deze rechten verliest.
- Gebruikers en profielen worden niet hard verwijderd. Een profiel kan alleen inactief worden als er geen gebruikers aan gekoppeld zijn. IAM-mutaties en kritieke allow/deny-beslissingen worden append-only gelogd.
- De uitvoerbare productiecontracten staan in hoofdstuk 15.6 van `GoSafe - Systeemuitwerking` en in de tabbladen Processen, Processtappen, Velden, Regels, API, Datamodel, Schermen en Besluiten van `GoSafe - Functionele specificatie`.

## Productregels en acceptatie

- Scheid codegedefinieerde regeltypen van beheerbare regelinstanties en parameters. De admin biedt nooit vrije code, formules of technische veldpaden.
- Categorieregels v1 zijn `Serienummer verplicht` en `Clausule toevoegen`. Productbrede acceptatiecriteria, vaste veldvalidaties en rekenparameters zijn geen categorieregels.
- De computerregel is één productbreed acceptatiecriterium `computer_ratio`, niet één regel per item. Per product configureert beheer de meetellende eindcategorieën en de maximale verhouding; initieel is deze verhouding `1.00`.
- Bereken `C` als de som van de verzekerde bedragen van computeritems en `O` als de som van de overige actieve items. De state voldoet als `C = 0` of `C <= O × ratio`; `C > 0` zonder overige items voldoet niet. Een incomplete state is niet evalueerbaar.
- Hercontroleer na iedere relevante itemwijziging en bij aanvraag, mutatie, herbasering en prolongatie. In de klantflow mag een concept worden opgeslagen, maar een mislukte of niet-evalueerbare productcontrole blokkeert indienen en maakt geen aanvraagstatus `Uitval`. Bij prolongatie wordt een bestaande afwijking `action_required`.
- Definitieve berekeningen bewaren criteriumtype/-versie, configuratie, subtotalen en uitkomst immutable in de productberekeningssnapshot.

## Prolongatie en mutatie

- Vooraankondiging is een los, automatisch communicatieproces en maakt geen polisversie of financiële boeking.
- De prolongatievoorraad kijkt automatisch vooruit, toetst toekomstige productregels en geplande mutaties en maakt verwachte uitval vóór de prolongatiedag zichtbaar.
- De definitieve prolongatie start automatisch op de laatste dag van de lopende termijn; de nieuwe termijn start de kalenderdag erna. Bijvoorbeeld: geldig tot en met 25 augustus, nieuwe termijn vanaf 26 augustus.
- GoSafe orkestreert en berekent. ANVA verzorgt formele registratie, financiële boeking en incasso; voeg geen GoSafe-incassostap toe aan het prolongatieproces.
- Een mutatie vóór of op het huidige termijn-einde levert na ANVA direct polis en nota op, ook als de ingangsdatum later is. Op de ingangsdatum wordt alleen de voorbereide versie actief.
- Een mutatie ná de komende prolongatie blijft akkoord als delta, krijgt status `Akkoord – wacht op prolongatie`, wordt daarna op de vernieuwde polisversie geherbaseerd en opnieuw gevalideerd. De klant krijgt direct een bevestiging en de stukken pas na prolongatie en ANVA-verwerking.
- Meerdere toekomstige mutaties worden chronologisch toegepast; iedere mutatie gebruikt de uitkomst van de vorige gebeurtenis.
- Het prolongatieoverzicht blijft een compacte operationele lijst met `Einde huidige termijn`, `Nieuwe termijn`, `Polis`, `Premie oud → nieuw` en `Voorcontrole`. Gebruik geen aparte actiekolom of niet-functionele resultaattelling; maak regels met uitval of een andere dossieractie rechtstreeks doorklikbaar. Toon daar ook geen relatie, geplande-mutatiekolom, vooraankondigingskolom of uitleg dat termijnen direct aansluiten.
