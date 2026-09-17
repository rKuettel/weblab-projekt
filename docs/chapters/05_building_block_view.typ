#import "@preview/merman:0.3.0": mermaid
= Bausteinsicht <section-building-block-view>

== Whitebox Gesamtsystem

#mermaid(
  "
flowchart TB
  subgraph FE[\"Angular-SPA\"]
    FT[\"Feature trackers\"]
    COMP[\"components (shared)\"]
  end
  subgraph BE[\"NestJS REST API\"]
    CTRL[\"Controller\"]
    SVC[\"Services\"]
  end
  DB[(\"MongoDB\")]
  FT -- \"HTTP/JSON (/api/*)\" --> CTRL
  FT --> COMP
  CTRL --> SVC
  SVC --> DB
",
  width: 100%,
)

#table(
  columns: (1fr, 2.5fr),
  table.header[*Baustein*][*Verantwortung*],
  [Angular-SPA], [Darstellung, Navigation, Formulare, clientseitige Statistikberechnung ],

  [NestJS REST API], [Validierung, Business Logic, Verwaltung der Daten],

  [MongoDB], [Persistenz],
)

== Ebene 2

=== Whitebox Backend (NestJS)

#mermaid(
  "
flowchart TB
  APP[\"AppModule\\nConfigModule, \\nMongooseModule (DB-Verbindung)\"]
  subgraph TM[\"TrackerModule\"]
    TC[\"TrackerController\\nGET/POST/PATCH/DELETE /tracker\"]
    TS[\"TrackerService\"]
    TSC[\"TrackerSchema\"]
  end
  subgraph EM[\"EventModule\"]
    EC[\"EventController\\nGET/POST/DELETE /tracker/:id/event\"]
    ES[\"EventService\"]
    ESC[\"TrackerEventSchema\"]
  end
  APP --> TM
  TM --> EM
  TC --> TS
  EC --> ES
  EC --> TS
  TS --> TSC
  ES --> ESC
  TS --> ESC
  ES --> TSC
",
  width: 100%,
)

Schichtprinzip: #text(weight: "bold")[Controller → Service → Mongoose-Model].

- *Controller*: validieren die Payload.
- *Services*: Business Logic.
- *Schemas*: Mongoose-Modelle für `Tracker` und `TrackerEvent`.


Beide Module registrieren *beide* Schemas: `TrackerService`, da beim Löschen eines Trackers auch alle zugehörigen Events gelöscht werden müssen, und `EventService`, da ein Event immer einem Tracker zugeordnet ist und beim Hinzufügen oder Löschen eines Events die `summary` auf dem Tracker aktualisiert werden muss. Dies ist an sich eine Unschönheit (Abschnitt 11).

=== Whitebox Frontend (Angular)

#mermaid(
  "
flowchart TB
  APP[\"app\"]
  CFG[\"config\"]
  subgraph FT[\"features/trackers\"]
    subgraph SMART[\"smart\"]
      DASH[\"tracker-dashboard\"]
      DETAIL[\"tracker-detail\"]
    end
    subgraph DUMB[\"dumb\"]
      STATS[\"stats\"]
    end
    API[\"services\"]
  end
  subgraph COMP[\"components (geteilte UI)\"]
    CHARTS[\"charts\"]
  end
  SVC[\"global services\"]
  APP ---> CFG
  APP --\"router-outlet:\\n '/'\"--> DASH
  APP --\"router-outlet:\\n '/tracker/:id'\"--> DETAIL
  DASH --> DUMB
  DASH --> API
  DETAIL --> STATS
  DETAIL --> DUMB
  DETAIL --> API
  STATS --> CHARTS
  DASH --> COMP
",
  width: 100%,
)

Strukturprinzipien:

- *Feature-orientierte Organisation*: `features/trackers` enthält alles, was zum Tracker Feature
  gehört.
- *Smart/Dumb-Grenze*: Smart-Components (Dashboard, Detail) besitzen die Datenflüsse
  (Signale via `httpResource` aus den API-Clienten) und orchestrieren Dialoge und Tabs.
  Dumb-Components nehmen nur Inputs und emittieren Events. Dadurch sind sie wiederverwendbar und einfacher wartbar.
- *Geteilte UI-Elemente*: Komponenten ohne Fachbezug liegen in `components`. Könnten von unterschiedlichen Featuren verwendet werden.
- *Globale Services*: Generelle Services wie z. B. Theme-Switcher oder Custom-Validation. Haben ebenfalls keinen Fachbezug und könnten somit von unterschiedlichen Featuren verwendet werden.

