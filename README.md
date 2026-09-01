# GoSafe prototype

Werkprototype voor de GoSafe aanvraag-, Mijn GoSafe- en adminomgeving.

## Browsermockups

- `index.html` – klantflow (mockup met prototypemenu; backup)
- Live aanvraagstraat zonder menu: https://gosafe.zeeroverhenk.nl/ (backend-repo `web/`)
- `admin.html` – admin- en polisomgeving
- `admin.html#processes` – realtime procesmonitor binnen de adminomgeving
- `admin.html#communications` – uitgaande e-mails: gepland, verzonden, providerstatus en volledige berichtweergave
- `admin.html#content` – generieke inhoud en vertalingen per taal
- `admin.html#users` – admingebruikers, profielen en rechten
- Admin-login, activatie en herstel – authenticatielaag binnen `admin.html`
- `admin.html#renewals` – realtime prolongatievoorraad, voorcontrole en uitzonderingen
- `process-monitor.html` – vaste doorverwijzing naar de procesmonitor in de adminomgeving

Lees voor iedere wijziging eerst `AGENTS.md`. Daar staat de vaste projectwerkwijze voor opslag, publicatie en overdracht tussen chats.

## Productiebriefing admin

De uitvoerbare functionele en technische contracten staan in [GoSafe - Systeemuitwerking](https://docs.google.com/document/d/1CmwJY-9MKhPa0YIJVnbIzlipiAKg2-2VYQSe1R03Xv4/edit) en [GoSafe - Functionele specificatie](https://docs.google.com/spreadsheets/d/1lc7dIf9cbF0up90fPeWvbX0l-z-J7izC_rvi1yRmUHw/edit). Hoofdstuk 15.6 en de P07/IAM-regels zijn leidend voor adminauthenticatie, sessies, rechten en API-handhaving.
