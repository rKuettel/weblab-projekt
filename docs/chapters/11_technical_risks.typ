= Risiken und technische Schulden <section-technical-risks>

#table(
  columns: (1.8fr, 1.4fr, 2fr),
  table.header[*Risiko / technische Schulden*][*Eintritt / Auswirkung*][*Massnahme / Status*],
  [Summary-Drift: Event-Write und Summary-Update sind zwei Operationen ohne Transaktion], [niedrig / mittel: bei Abbruch dazwischen inkonsistente Summary], [Self-healing durch Voll-Aggregation bei jeder Änderung; Ausbaustufe: MongoDB-Transaktion oder inkrementelle Updates],
  [Keine Authentifizierung (Single-User)], [mittel / mittel: exponierte Instanz wäre für Dritte les- und schreibbar], [Bewusste Scope-Entscheidung (Won't Have); Instanz nicht öffentlich exponieren; Multi-User als klarer Nachfolger],
  [Clientseitige Statistik bei grosser Event-Menge (keine Pagination)], [niedrig / mittel: UI-Ruckler/Speicher bei tausenden Events im Zeitbereich], [Single-User-Grösse unkritisch; Gegenmittel: Pagination bzw. serverseitige Aggregation (API-Ausbaustufe)],
  [Duplizierte Typdefinitionen (Frontend `tracker.types` / Backend DTOs)], [mittel / mittel: Drift zwischen API- und Client-Modell], [Beide Enden werden von API- und E2E-Tests gegeneinander geprüft; Ausbaustufe: gemeinsames Schema-Paket (z. B. via `pnpm`-Workspace)],
  [E2E-Tests hängen an Docker und dem freien Host-Port 8080], [mittel / niedrig: lokale Testausführung scheitert], [Dokumentation in `e2e/README.md`; in CI dedizierte Runner ohne Port-Konflikte],
  [MongoDB Single-Instance ohne Backup-Konzept], [niedrig / mittel: Datenverlust bei Instanz-Fehler], [Single-User, unkritische Daten; bei Bedarf Volume-Backup ergänzen],
  [PWA/Offline (Could-Have) nicht umgesetzt], [– / –: Offline-Erfassung fehlt in V1], [Architektur vorbereitet (ADR 2/6); Service Worker als klarer nächster Schritt],
  [i18n: nur `en` ausgeliefert (Fallback `en`)], [niedrig / niedrig: keine zweite Sprache], [Mechanik (ngx-translate) vorhanden, weitere Sprachdateien trivial ergänzbar],
  [Lighthouse-Score ≥ 90 (Modul-Mindestanforderung) bei neuen Features gefährdet], [mittel / mittel: schwere Dependencies (Charts, i18n) oder wachsendes Bundle können den Score senken], [Lighthouse-Run (Mobile + Desktop) vor Releases; Dependencies und Bundle-Grösse bewusst im Blick behalten (Abschnitt 10, QS-6)],
)
