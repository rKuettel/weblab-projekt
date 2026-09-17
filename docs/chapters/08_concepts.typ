#import "@preview/merman:0.3.0": mermaid
= Querschnittliche Konzepte <section-concepts>


== Datenmodell

Auf der Datenbank existieren zwei verschiedene Dokumente.
Diese sind Logisch miteinander über die `trackerId` verknüpft.

#align(center)[
  #mermaid(
    "
erDiagram
  TRACKERS {
    ObjectId _id PK
    string name
    string type \"'counter' | 'category'\"
    object summary \"typabhängig\"
  }
  TRACKEREVENTS {
    ObjectId _id PK
    ObjectId trackerId FK \"indexiert\"
    date timestamp
    object data \"typabhängig\"
  }
  TRACKERS ||--o{ TRACKEREVENTS : \"enthält\"
",
    width: 40%,
  )
]


Die typabhängigen Felder `summary` und `data` sind bewusst flexibel gespeichert (Mongoose `Mixed`/`Map`) und
werden an der API-Grenze validiert:

#table(
  columns: (1.2fr, 1.2fr, 2fr),
  table.header[*Tracker Typ*][*Counter*][*Category*],
  table.hline(stroke: 2pt),
  [`tracker.summary`], [`{ sum: number }`], [`[{ category: string, amount: number }]`],
  [`event.data`], [`{ delta: number }`], [`{ category: string, amount: number }`],
)


== Validierung

*Backend*:\
globaler `ValidationPipe` (`whitelist: true`) mit class-validator-DTOs an jedem Endpunkt.
Zusätzlich validiert der `EventController` die typabhängigen Event-Daten gegen den konkreten Tracker-Typ.

*Frontend:*\
Reactive Forms mit eigenen Validatoren (z. B. `requiredTrimmed`), ungültige Formulare werden nicht abgeschickt.

== Testing-Strategie

#table(
  columns: (0.7fr, 2fr, 2.2fr),
  table.header[*Ebene*][*Was*][*Tooling*],
  [Unit], [Frontend-Components, Services], [Vitest + jsdom],
  [API], [REST-Endpunkte], [Vitest + supertest + mongodb-memory-server],
  [E2E], [User Journeys über die UI am kompletten Stack], [Cypress (Chromium) + Docker Compose],
)

Die API-Tests nutzen einen echten MongoDB-Driver gegen eine
in-Memory-Instanz, d. h. ohne Mocks. Die E2E-Tests fahren dafür exakt denselben
Docker-Stack hoch wie die Produktion.

== CI/CD (GitHub Actions)

#mermaid(
  "
flowchart LR
  PM[\"Push → main\"] --> FJ[\"Job frontend\\npnpm build + Vitest\"]
  PM --> BJ[\"Job backend\\npnpm build + API-Tests (in-Memory-Mongo)\"]
  FJ --> EJ[\"Job e2e-test\\nCypress + Docker-Stack\"]
  BJ --> EJ
  PD[\"Push → docs/**\"] --> TJ[\"Job docs\\nTypst compile → PDF\"]
  TJ --> REL[\"GitHub Release (Tag: latest)\"]
",
  width: 100%,
)
