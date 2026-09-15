= Qualitätsanforderungen <section-quality-scenarios>

== Übersicht der Qualitätsanforderungen

Die Qualitätsziele stehen in Abschnitt 1.2. Übersicht nach ISO-25010-nahen
Kategorien; die Modul-Mindestanforderungen sind in den Zeilen entsprechend markiert:

#table(
  columns: (1.2fr, 3fr),
  table.header[*Kategorie*][*Qualitätsanforderung*],
  [Gebrauchstauglichkeit], [Tracker anlegen und Ereignisse erfassen in wenigen Interaktionen; Dashboard als zentrale Übersicht; responsives Layout, für Mobile und Tablet optimiert (Modul-Anforderung, QS-7).],
  [Erweiterbarkeit], [Neue Tracker-Typen (z. B. Checkliste) sind ohne Änderungen an bestehenden Typen integrierbar (Schema, API, UI).],
  [Zuverlässigkeit / Testbarkeit], [Alle drei Test-Ebenen (Unit, API, E2E) laufen automatisiert in der CI (Modul-Anforderung); fehlerhafte Eingaben werden an der API-Grenze abgewiesen.],
  [Effizienz], [Dashboard mit allen Trackern und Summaries in < 2 s; keine Aggregationen bei jedem Load; Lighthouse-Score ≥ 90 für Mobile und Desktop, Durchschnitt aller Analysen (Modul-Anforderung, QS-6).],
  [Verfügbarkeit], [Ereignis-Erfassung auch ohne Internetverbindung möglich (PWA) – *vorgesehen, V1 nicht umgesetzt*.],
  [Kompatibilität], [Moderne Evergreen-Browser; E2E-Referenzbrowser Chromium; volle Funktionsfähigkeit auf Desktop, Tablet und Smartphone.],
  [Betriebstauglichkeit], [Reproduzierbarer Start des Prod-Bundles: `docker compose up --build` aus dem Repo (Modul-Anforderung, Option 2); Option 1 (öffentliche URL) auf jedem Docker-Host möglich (Abschnitt 7).],
  [Wartbarkeit], [Code-Lesbarkeit und sinnvolle, durchdachte Strukturierung (Modul-Anforderung): feature-basierte Angular-Module, modulare NestJS-Struktur, gemeinsames TypeScript, Prettier + oxlint, Tests als lebende Dokumentation (Abschnitt 5/8).],
)

== Qualitätsszenarien

Kurze Form (Kontext / Stimulus / Reaktion / Metrik):

#table(
  columns: (0.5fr, 1.8fr, 1.8fr, 1.7fr),
  table.header[*ID*][*Stimulus (Quelle, Anstoss)*][*Reaktion des Systems*][*Metrik / Akzeptanz*],
  [QS-1], [Benutzer auf dem Dashboard will einen neuen Tracker anlegen (Gebrauchstauglichkeit)], [Dialog mit Name + Typ; nach Absenden ist der Tracker sichtbar], [≤ 3 Interaktionen bis zum sichtbaren Tracker],
  [QS-2], [Entwickler fügt einen neuen Tracker-Typ hinzu (Erweiterbarkeit)], [Neuer Typ funktioniert (CRUD, Events, Stats); bestehende Typen unverändert], [Änderung beschränkt auf: Typ-Enum, summary/data-Typen, Formular-, Statistik- und Test-Code; keine Änderung bestehender Typ-Code-Pfade],
  [QS-3], [Dashboard wird geöffnet, Instanz hat 50 Tracker (Effizienz)], [Alle Tracker-Karten inkl. Summary gerendert], [First-Render < 2 s; genau 1 API-Call (`GET /tracker`)],
  [QS-4], [Entwickler pusht auf `main` (Testbarkeit)], [CI führt Build, Unit-, API- und E2E-Tests aus], [Fehlschlagender Test blockiert den Merge; alle Ebenen grün],
  [QS-5], [Benutzer ist offline und will ein Ereignis erfassen (Verfügbarkeit)], [PWA erlaubt Erfassung, Synchronisation bei Rückkehr der Verbindung], [*Ziel für V2 – in V1 nicht umgesetzt* (PWA-Architektur vorbereitet, ADR 2/6)],
  [QS-6], [Lighthouse analysiert das Prod-Bundle auf Mobile und Desktop (Effizienz, Modul-Anforderung)], [Scores aller Analysen werden gemittelt], [Lighthouse-Score ≥ 90 auf Mobile *und* Desktop (Durchschnitt aller Analysen)],
  [QS-7], [Benutzer öffnet die Applikation auf einem Smartphone (360 px) oder Tablet (Gebrauchstauglichkeit, Modul-Anforderung)], [Alle Funktionen ohne horizontales Scrollen nutzbar; Layout passt sich an das Gerät an], [Responsives Layout über alle Seiten; keine desktop-gebundene Funktionalität],
)
