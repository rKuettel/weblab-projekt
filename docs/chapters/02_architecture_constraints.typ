= Randbedingungen <section-architecture-constraints>

Die Randbedingungen ergeben sich vor allem aus den Mindestanforderungen des
Moduls (Web Programming Lab).

#table(
  columns: (1fr, 2fr),
  table.header[*Randbedingung*][*Erläuterung*],
  [Mobile/Tablet-optimiert],
  [Die Applikation soll neben der Desktop-Ansicht auch für die Mobile/Tablet-Ansicht optimiert sein],

  [Automatisierte Tests],
  [Die Funktionalitäten sollen mittels sinnvoller automatisierter Unit-/Integration-/E2E-Tests überprüft werden],

  [Lighthouse-Score ≥ 90], [Lighthouse-Score von mindestens 90 (Durchschnitt aller Analysen) für Mobile sowie Desktop],

  [Reproduzierbarer Prod-Start], [Das Prod-Bundle soll reproduzierbar gestartet werden können],
  [JavaScript/TypeScript für Frontend und Backend],
  [Das Modul schreibt JavaScript/TypeScript für Frontend und Backend vor],
)
