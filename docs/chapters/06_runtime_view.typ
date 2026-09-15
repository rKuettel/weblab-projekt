= Laufzeitsicht <section-runtime-view>

== Szenario: Dashboard laden

Das Dashboard zeigt alle Tracker mit ihrer  `summary` an . Es werden nur die
Tracker-Dokumente geladen, es findet keine Event-Aggregation statt.
Pro Tracker wird auf dem UI eine Karte angezeigt.

```mermaid
sequenceDiagram
    participant B as Browser (Angular-SPA)
    participant C as Tracker Controller
    participant S as Tracker Service
    participant M as MongoDB
    B->>C: GET /api/tracker
    C->>S: findAll()
    S->>M: find() auf Collection trackers
    M-->>S: Tracker-Dokumente
    S-->>C: Tracker-Dokumente
    C-->>B: 200 TrackerDto[]
```

== Szenario: Ereignis erfassen

Die Summary wird mit der Event-Erfassung neu berechnet und zusammen mit dem
aktuellen Tracker zurückgegeben.  Das Frontend muss dafür keine zweite Anfrage stellen.

```mermaid
sequenceDiagram
    participant B as Browser
    participant EC as EventController
    participant ES as EventService
    participant M as MongoDB
    B->>EC: POST /api/tracker/{id}/event
    EC->>EC: ValidationPipe (DTO) + Validierung gegen Tracker-Typ
    EC->>ES: create(tracker, dto)
    ES->>M: Event in Collection trackerevents schreiben
    ES->>M: Aggregation über alle Events des Trackers
    ES->>M: tracker.summary mit neuem Wert aktualisieren
    ES-->>EC: aktualisierter Tracker
    EC-->>B: 200 TrackerDto (aktualisierte Summary)
```
== Szenario: Statistiken anzeigen

Detaillierte Statistiken werden clientseitig berechnet (ADR 6): Das Frontend lädt die
Events im gewählten Datumsbereich und leitet daraus Charts und Kennzahlen ab
(`stats.util`: Gruppierung nach Tag/Kategorie, Summation, Lückenbefüllung).

```mermaid
sequenceDiagram
    participant B as Browser
    participant C as tracker-detail
    participant A as EventController
    participant ES as EventService
    participant M as MongoDB
    B->>C: Datumsbereich wählen (Default: letzter Zeitraum)
    C->>A: GET /api/tracker/{id}/event?from&to
    A->>ES: findInRange(trackerId, from, to)
    ES->>M: Abfrage auf events collection
    M-->>ES: Event-Dokumente
    ES-->>A: Event-Dokumente
    A-->>C: TrackerEventDto[]
    C->>C: Berechnung von Statiskigen mittels `stats.util`
    C-->>B: Charts (ECharts) + Kennzahlen rendern
```

== Szenario: Tracker löschen

Das Löschen eines Trackers kaskadiert auf dessen Events (anwendungsseitig, ADR 5).

```mermaid
sequenceDiagram
    participant B as Browser
    participant TC as TrackerController
    participant TS as TrackerService
    participant M as MongoDB
    B->>TC: DELETE /api/tracker/{id}
    TC->>TS: remove(id)
    TS->>M: Tracker löschen
    TS->>M: deleteMany Events mit trackerId
    TS-->>TC: ok
    TC-->>B: 200
```

== Fehler- und Ausnahmeszenarien

#table(
  columns: (2.2fr, 1.8fr),
  table.header[*Situation*][*Verhalten*],
  [Unbekannte Tracker-/Event-ID], [`NotFoundException` → HTTP 404],
  [Event-Daten passen nicht zum Tracker-Typ (z. B. `category` bei Counter)],
  [`BadRequestException` → HTTP 400 mit Fehlermeldung],

  [Ungültige Tracker-/Event-Daten (z. B. fehlendes `name`, negatives Delta)],
  [Globaler `ValidationPipe` (class-validator) → HTTP 400],
)
