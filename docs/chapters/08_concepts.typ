= Querschnittliche Konzepte <section-concepts>


=== Datenmodell

Zwei Dokumente bilden das gesamte Fachmodell (Details: ADR 4, ADR 5):

```mermaid
erDiagram
  TRACKERS {
    ObjectId _id PK
    string name
    string type "counter | category"
    object summary "typabhängig, cached"
  }
  TRACKEREVENTS {
    ObjectId _id PK
    ObjectId trackerId FK "indexiert"
    date timestamp
    object data "typabhängig"
  }
  TRACKERS ||--o{ TRACKEREVENTS : "enthält"
```

Die typabhängigen Felder sind bewusst flexibel gespeichert (Mongoose `Mixed`/`Map`) und
werden an der API-Grenze validiert:

#table(
  columns: (1.2fr, 1.2fr, 2fr),
  table.header[][*Counter*][*Category*],
  [`tracker.summary`], [`{ sum: number }`], [`[{ category: string, amount: number }]`],
  [`event.data`], [`{ delta: number }`], [`{ category: string, amount: number }`],
)

== Summary-Caching (Denormalisierung)

Die Summary ist die einzige serverseitig vorgehaltene Statistik. Sie wird in dem
Tracker-Dokument mitgeführt und bei *jeder* Event-Änderung (Anlegen, Löschen) per
Voll-Aggregation über die Events des Trackers neu berechnet und gespeichert.

- *Voll-Aggregation statt inkrementeller Update*: robust gegen Daten, die ausserhalb
  des Anwendungspaths entstehen (z. B. manuelle DB-Korrekturen); Aufwand ist bei
  Single-User-Grösse vernachlässigbar.
- *Keine Transaktion* zwischen Event-Write und Summary-Update: im Fehlerfall
  inkonsistent, heilt sich aber bei der nächsten Änderung (Abschnitt 11).

== Validierung

Validierung erfolgt an beiden Enden:

- *Backend (autoritativ)*: globaler `ValidationPipe` (`whitelist: true`) mit
  class-validator-DTOs an jedem Endpunkt; zusätzlich validiert der `EventController`
  die typabhängigen Event-Daten gegen den konkreten Tracker-Typ.
- *Frontend (komfort)*: Reactive Forms mit eigenen Validatoren (z. B.
  `requiredTrimmed`), ungültige Formulare werden nicht abgeschickt.

```mermaid
flowchart LR
  R["HTTP-Request"] --> V1["ValidationPipe (DTO, whitelist)"]
  V1 --> V2{"Event-Data?"}
  V2 -- ja --> V3["Typ-Validierung\n(CounterEventDto / CategoryEventDto)"]
  V2 -- nein --> S["Service"]
  V3 --> S
  V1 -. "Fehler" .-> E400["400 Bad Request"]
  V3 -. "Fehler" .-> E400
```

== Testing-Strategie

#table(
  columns: (0.7fr, 2fr, 2.2fr, 0.8fr),
  table.header[*Ebene*][*Gegenstand*][*Tooling*][*Ort*],
  [Unit], [Frontend-Components, Services, `stats.util`], [Vitest + jsdom], [`frontend/`],
  [API],
  [REST-Endpunkte (CRUD Tracker, Events, Validierung, Summary)],
  [Vitest + supertest + mongodb-memory-server],
  [`backend/test/`],

  [E2E], [User Journeys über die UI am kompletten Stack], [Cypress (Chromium) + Docker Compose], [`e2e/`],
)

Details: ADR 8. Die API-Tests nutzen einen echten MongoDB-Driver gegen eine
in-Memory-Instanz, d. h. ohne Mocks; die E2E-Tests fahren dafür exakt denselben
Docker-Stack hoch wie die Produktion.

== CI/CD (GitHub Actions)

```mermaid
flowchart LR
  PM["Push → main"] --> FJ["Job frontend\npnpm build + Vitest"]
  PM --> BJ["Job backend\npnpm build + API-Tests (in-Memory-Mongo)"]
  FJ --> EJ["Job e2e-test\nCypress + Docker-Stack"]
  BJ --> EJ
  PD["Push → docs/**"] --> TJ["Job docs\nTypst compile → PDF"]
  TJ --> REL["GitHub Release (Tag: latest)"]
```
