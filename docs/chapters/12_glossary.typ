= Glossar <section-glossary>

#table(
  columns: (1fr, 3fr),
  table.header[*Begriff*][*Definition*],
  [Tracker], [Grundlegende Einheit der Applikation: ein benannter, typisierter Zähler, für den Ereignisse erfasst werden (z. B. «Kaffee»).],
  [Tracker-Typ], [Art eines Trackers; in V1: `counter` (einfacher Zähler) und `category` (Zähler mit Kategorien). Bestimmt das Format von `summary` und `event.data`.],
  [Ereignis (Event)], [Ein erfasster, zeitgestempelter Eintrag an einem Tracker; die Daten sind typabhängig (`delta` bzw. `category` + `amount`).],
  [Summary], [Aggregierter Wert eines Trackers (Counter: Summe; Category: Summen pro Kategorie). Ist gecacht in dem Tracker-Dokument (ADR 4).],
  [Dashboard], [Startseite der SPA; zeigt alle Tracker als Karten mit ihrer Summary.],
  [Detailseite], [Ansicht eines einzelnen Trackers mit Tabs für Statistiken und Event-Liste, inkl. Datumsbereichs-Filter.],
  [Smart Component], [Angular-Routen-Component, die Datenflüsse besitzt (Signale, API-Calls) und orchestriert (z. B. `tracker-dashboard`).],
  [Dumb Component], [Reine Präsentations-Component mit Inputs/Events, ohne eigene Datenquelle (z. B. `tracker-card`).],
  [SPA], [Single-Page-Applikation: die UI wird einmal geladen und clientseitig gerendert/aktualisiert.],
  [PWA], [Progressive Web App: Web-App mit Offline-Fähigkeit (Service Worker, Caching) – für Track Thing vorgesehen, in V1 nicht umgesetzt.],
  [ADR], [Architecture Decision Record: dokumentierte, begründete Architekturentscheidung (Abschnitt 9).],
  [Reverse-Proxy], [nginx leitet Requests an `/api/*` an das Backend weiter, ohne dass der Browser das Backend direkt kennt.],
  [API-Test], [Test auf Endpunkt-Ebene: REST-Vertrag inkl. Persistenz gegen eine in-Memory-MongoDB (supertest, mongodb-memory-server).],
  [E2E-Test], [End-to-End-Test über die UI (Cypress) am kompletten Docker-Stack.],
  [Voll-Aggregation], [Neuberechnung der Summary als Aggregation über *alle* Events eines Trackers (statt inkrementeller Updates).],
  [Lighthouse], [Google-Analyse-Tool für Web-Applikationen (u. a. Performance, Accessibility, Best Practices, SEO). Modul-Mindestanforderung: Score ≥ 90 für Mobile und Desktop (Durchschnitt aller Analysen).],
)
