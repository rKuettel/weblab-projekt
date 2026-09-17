= Risiken und technische Schulden <section-technical-risks>

#table(
  columns: (1.8fr, 2fr),
  table.header[*Risiko / technische Schulden*][*Massnahme / Status*],
  [Event-Write und Summary-Update sind zwei Operationen ohne Transaktion],
  [Self-healing durch Aggregation bei jeder Änderung. Ausbaustufe: MongoDB-Transaktion oder inkrementelle Updates],

  [Vermischung der Dokumenttypen `Tracker` und `TrackerEvent` in beiden Backend-Modulen],
  [
    Da Events direkt an Tracker gebunden sind, stellt sich die Frage, ob die Aufteilung in unterschiedliche Module wirklich sinnvoll ist, da es bereits Überschneidungen gibt. Eventuell wäre es besser, die Module nach Trackertypen aufzuteilen.
  ],

  [i18n: nur `en` ausgeliefert], [Mechanik (ngx-translate) vorhanden, weitere Sprachdateien trivial ergänzbar],
)
