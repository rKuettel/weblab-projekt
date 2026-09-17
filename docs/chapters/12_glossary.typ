= Glossar <section-glossary>

#table(
  columns: (1fr, 3fr),
  table.header[*Begriff*][*Definition*],
  [SPA], [Single-Page-Applikation: die UI wird einmal geladen und clientseitig gerendert/aktualisiert.],
  [PWA],
  [Progressive Web App: Web-App mit Offline-Fähigkeit (Service Worker, Caching) – für Track Thing vorgesehen, in V1 nicht umgesetzt.],

  [ADR], [Architecture Decision Record: dokumentierte, begründete Architekturentscheidung (Abschnitt 9).],
  [Reverse-Proxy],
  [nginx leitet Requests an `/api/*` an das Backend weiter, ohne dass der Browser das Backend direkt kennt.],

  [Lighthouse],
  [Google-Analyse-Tool für Web-Applikationen (u. a. Performance, Accessibility, Best Practices, SEO). Modul-Mindestanforderung: Score ≥ 90 für Mobile und Desktop (Durchschnitt aller Analysen).],
)
