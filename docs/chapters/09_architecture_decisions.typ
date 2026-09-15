= Architekturentscheidungen <section-design-decisions>

== ADR 1: Backend als Monolith
*Entscheidung:* Das Backend wird als NestJS-Monolith implementiert (ein
Deployment, interne Modulstruktur nach Fachbereich).

*Begründung:* Die Applikation ist klein (zwei Fachentitäten, ein Benutzer). Ein
Monolith erfüllt alle Qualitätsziele (Abschnitt 1) mit minimalem Betriebsoverhead;
eine verteilte Architektur (Microservices) würde Komplexität ohne Vorteil bringen.

*Konsequenzen:* Ein einziger Deployment-Artefakt; horizontale Skalierung nur monolithisch.
Wachstum wird über die interne Modulstruktur (Tracker/Event) gesteuert.

== ADR 2: Client als SPA
*Entscheidung:* Der Client wird als Single-Page-Applikation (Angular) umgesetzt –
ohne Server-Side Rendering.

*Begründung:* Die Could-Have-Anforderung (Abschnitt 1), die Applikation auch ohne
Internetverbindung nutzen zu können (PWA), schliesst SSR-Ansätze aus. Die SPA gibt
vollständige Kontrolle über UI-State und ermöglicht die clientseitige
Statistikberechnung (ADR 6). Für ein Single-User-Tool ohne Suchmaschinen-Anforderung
bringt SSR keinen Gegenwert.

*Konsequenzen:* Der gesamte UI-State wird clientseitig verwaltet; Offline-Fähigkeit
ist architektonisch vorbereitet (Datenmodelle, API-Client), die PWA-Implementierung
(Service Worker) steht noch aus (Abschnitt 10, QS-5).

== ADR 3: MongoDB statt PostgreSQL
*Entscheidung:* Die Persistenz erfolgt in MongoDB 7 via Mongoose.

*Begründung:*

- *Ökosystem*: Mongoose ist in der NestJS-Welt (Projekt-Ökosystem) eine
  First-Class-Integration, analog zu TypeORM/Prisma für SQL.
- *Dynamik der Tracker*: Tracker sind bewusst typisiert und sollen um weitere
  Typen erweiterbar sein. Die typabhängigen Felder (`summary`, `event.data`)
  passen natürlich in ein Dokument-Modell; neue Typen erfordern keine
  Schema-Migrationen relationaler Tabellen, sondern nur neue
  Typ-Definitionen (Qualitätsziel Erweiterbarkeit).
- *Kurs*: MongoDB wurde im Kurs (Web Programming Lab) behandelt.

*Konsequenzen:* Keine relationalen Integritätsmechanismen (FK-Beziehung
Tracker→Event nur logisch, Kaskade in der Applikation – ADR 5); analytische
Abfragen laufen über die Aggregation-Pipeline; Single-Instance-Betrieb ohne
Replikation (Single-User, unkritisch).

== ADR 4: Caching der Summaries in der Datenbank

*Entscheidung:* Die Summary je Tracker wird denormalisiert in dem Tracker-Dokument
gespeichert und bei jeder Event-Änderung serverseitig neu berechnet
(Voll-Aggregation).

*Begründung:* Das Dashboard zeigt die Summary für *alle* Tracker auf einen Blick.
Ohne Cache müsste bei jedem Dashboard-Load pro Tracker eine
Aggregation über dessen Events laufen. Mit Cache ist es ein einziges `find()` –
das Dashboard bleibt auch bei wachsender Event-Historie schnell (QS-3).

*Konsequenzen:* Denormalisierte Daten; Konsistenz wird durch Neuberechnung bei jeder
Änderung garantiert (self-healing), nicht durch Transaktionen. Write-overhead pro
Event (Voll-Aggregation) – bei Single-User-Grösse vernachlässigbar. Bei sehr grossen
Event-Mengen wäre eine inkrementelle Update-Strategie die natürliche Ausbaustufe.

== ADR 5: Zwei Datenbank-Dokumente (Tracker, Event)

*Entscheidung:* Tracker und Events werden in zwei getrennten Collections persistiert
(`trackers`, `trackerevents`), verknüpft über `trackerId`.

*Begründung:* Events sind die volumenstärkste Entität mit eigenem Zugriffsmuster
(Liste nach Zeitraum, Löschen, Aggregationen) und eigenem Lebenszyklus. Als eigene
Dokumente ermöglichen sie:

- Indexierung auf `trackerId` für schnelle Abfragen,
- zeitbasierte Filterung ohne ganze Tracker-Dokumente zu laden,
- ein kompaktes Tracker-Dokument (nur Referenzdaten + Summary) für das Dashboard.

*Konsequenzen:* Die Verknüpfung ist logisch (kein DB-FK); das Löschen kaskadiert in
der Anwendungslogik (`TrackerService.remove`); Events verlieren ihre Bedeutung, wenn
der Tracker gelöscht wird (garantiert durch die Kaskade).

== ADR 6: Statistiken im Frontend berechnen

*Entscheidung:* Detaillierte Statistiken (Charts, Kennzahlen, Gruppierungen nach
Tag/Kategorie) werden clientseitig aus den im Datumsbereich geladenen Events
berechnet. Nur die Summary (übergreifend über alle Events) ist serverseitig
gecacht (ADR 4).

*Begründung:*

- *Offline-Vorbereitung*: Statistiken ohne API-Aufruf berechenbar zu haben ist die
  Voraussetzung für die Offline-Lösung (PWA, ADR 2) – die Datenbasis (Events +
  Summary) kann lokal vorliegen und alles Ableitbare clientseitig erzeugt werden.
- *Schlanke API*: Keine Statistik-Endpunkte, kein Abstimmen von
  Aggregations-Parametern zwischen den Enden; neue Visualisierungen sind reine
  Frontend-Änderungen.

*Konsequenzen:* Rechenlast und Speicherbedarf im Client bei grossen Event-Mengen
(aktuell unkritisch, da Single-User und Zeitbereich-begrenzt; Gegenmittel wären
Pagination bzw. serverseitige Aggregation). Die Statistik-Logik ist dadurch im
Frontend unit-getestet (`stats.util.spec.ts`).

== ADR 7: Deployment via Docker Compose mit nginx als Entry Point

*Entscheidung:* Produktion, E2E und Entwicklung teilen dieselben Container-Images;
nginx liefert die SPA-Assets und proxyt `/api/*` auf das Backend.

*Begründung:*

- *Reproduzierbarkeit*: Eine Umgebung für alle Zwecke (Dev-Setup, E2E, Produktion)
  auf Docker-Basis; E2E testet exakt das Produktions-Artefakt.
- *Ein Entry Point*: nginx bündelt statische Assets und API-Proxy – kein CORS,
  keine zweite exponierte Schnittstelle, DB nicht vom Host erreichbar.

*Konsequenzen:* Single-Host-Topologie, kein Lastverteiler – passend zum Single-User-Scope.
Der Dev-Server-Proxy (`proxy.conf.json`) spiegelt die nginx-Konfiguration.

== ADR 8: Testing-Strategie (Unit, API, E2E)

*Status:* Angenommen

*Entscheidung:*

- Frontend: Unit-Tests der Components und Services (Vitest + jsdom).
- Backend: API-Tests der REST-Endpunkte (Vitest + supertest) gegen eine
  `mongodb-memory-server` – echter Driver, echte Collections, keine Mocks.
- E2E: Cypress-Tests (Chromium) gegen den kompletten Docker-Stack (Frontend,
  Backend, MongoDB), gestartet und abgerissen von der Test-Suite.

*Begründung:* Die drei Ebenen decken die drei Risikoebenen ab: UI-Logik
(schnell, unit), API-Vertrag inkl. Persistenz (API-Test), Integration über die
technischen Grenzen hinweg (E2E). API-Tests ohne Mocks fangen
Persistenz- und Validierungsfehler, die Unit-Tests des Backends nicht sehen.

*Konsequenzen:* Längere CI-Laufzeit (Docker-Build + E2E); die E2E-Umgebung benötigt
den freien Host-Port 8080. Neue Tracker-Typen müssen auf allen drei Ebenen getestet
werden (QS-4).
