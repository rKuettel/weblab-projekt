= Architekturentscheidungen <section-design-decisions>

== ADR 1: Backend als Monolith
*Entscheidung:* Das Backend wird als NestJS-Monolith implementiert, also als ein Deployment mit internen Modulen.

*Begründung:* Die Applikation ist klein. Ein Monolith erfüllt alle Qualitätsziele mit minimalem Betriebsoverhead;
eine verteilte Architektur (Microservices) würde Komplexität ohne Vorteil bringen.

*Konsequenzen:* Ein einziges Deployment-Artefakt. Horizontale Skalierung nur monolithisch.

== ADR 2: Client als SPA
*Entscheidung:* Der Client wird als Single-Page-Applikation (Angular) umgesetzt.

*Begründung:* Aufgrund der Could-Have-Anforderung, die Applikation auch ohne
Internetverbindung nutzen zu können (PWA), schliessen sich SSR-Ansätze aus.

*Konsequenzen:* Der gesamte UI-State wird clientseitig verwaltet.

== ADR 3: MongoDB statt PostgreSQL
*Entscheidung:* Die Persistenz erfolgt in MongoDB via Mongoose.

*Begründung:*
Tracker sind bewusst typisiert und sollen um weitere
Typen erweiterbar sein. Die typabhängigen Felder (`summary`, `event.data`)
passen natürlich in ein Dokument-Modell. Neue Typen erfordern keine
Schema-Migrationen relationaler Tabellen, sondern nur neue
Typ-Definitionen.


*Konsequenzen:* Die FK-Beziehung zwischen Tracker und Event ist nur logisch, wodurch Kaskaden bei Löschungen manuell umgesetzt werden müssen.

== ADR 4: Zwei Datenbank-Dokumente (Tracker, Event)

*Entscheidung:* Tracker und Events werden in zwei getrennten Collections persistiert
(`trackers`, `trackerevents`), und logisch über `trackerId` verknüpft.

*Begründung:* MongoDB limitiert die Grösse eines Dokuments (16 MB).
Indem Events als einzelne Dokumente gespeichert werden, wird diese Limitierung umgangen.
Ausserdem können so Events zeitbasiert gefiltert werden, ohne ein ganzes Tracker-Dokument zu laden.
Zum Schluss bleiben die Tracker-Dokumente schlank, wodurch die Abfrage aller Tracker schnell bleibt.

*Konsequenzen:* Die Verknüpfung ist logisch.
Somit muss z.B beim Löschen eines Trackers die dazugehörenden Ereignisse manuell mitgelöscht werden.

== ADR 5: Caching der Summaries in der Datenbank

*Entscheidung:* Die Summary je Tracker wird denormalisiert in dem Tracker-Dokument
gespeichert und bei jeder Event-Änderung serverseitig neu berechnet

*Begründung:* Das Dashboard zeigt die Summary für *alle* Tracker auf einen Blick.
Ohne Cache müsste bei jedem Dashboard-Load pro Tracker eine
Aggregation über dessen Events laufen. Mit Cache ist es ein einziges `find()` –
das Dashboard bleibt auch bei wachsender Event-Historie und Trackern schnell (Qualitätsziel Performance, Abschnitt 1.2).

*Konsequenzen:* Denormalisierte Daten, Konsistenz wird durch Neuberechnung bei jeder
Änderung garantiert (self-healing). Write-overhead pro Event.

== ADR 6: Statistiken im Frontend berechnen

*Entscheidung:* Detaillierte Statistiken (Charts, Kennzahlen, Gruppierungen nach
Tag/Kategorie) werden clientseitig aus den im Datumsbereich geladenen Events
berechnet. Nur die Summary (übergreifend über alle Events) ist serverseitig
gecacht (ADR 5).

*Begründung:* Statistiken ohne API-Aufruf berechenbar zu haben ist die
Voraussetzung für die Offline-Lösung.
Würde das Backend die Statistiken ebenfalls anbieten, müsste die Logik bei der Erweiterung zur Offline-Verfügbarkeit im Client dupliziert werden.

*Konsequenzen:* Erhöhte Rechenlast und Speicherbedarf im Client bei grossen Event-Mengen.

== ADR 7: ECharts für Charts

*Entscheidung:* Die Charts in der Tracker-Detailansicht (Balken-, Kreis- und
Kalender-Heatmap-Diagramme) werden mit ECharts gerendert, angebunden über den
Angular-Wrapper `ngx-echarts`.

*Begründung:* `ngx-echarts` ist kompatibel mit Angular 22 und deckt die
benötigten Diagrammtypen ab. Alternativen wie z.B. ng-charts sind (stand September 2026) noch nicht mit Angular 22 kompatibel.

*Konsequenzen:* Die Chart-Bibliothek verschlechtert den Performance Lighthouse-Score,
besonders auf mobilen Geräten.

