= Qualitätsanforderungen <section-quality-scenarios>

== Übersicht der Qualitätsanforderungen

Ergänzend zu den in Abschnitt 1.2 definierten Qualitätszielen werden in diesem
Kapitel weitere Qualitätsanforderungen mit geringerer Priorität definiert:

#table(
  columns: (1.2fr, 3fr),
  table.header[*Kategorie*][*Qualitätsmerkmal*],
  [Verfügbarkeit],
  [Ereignis-Erfassung auch ohne Internetverbindung möglich (z. B. PWA) – *vorgesehen, in der ersten Version nicht umgesetzt* (QS-1).],

  [Benutzbarkeit],
  [Responsives Design: alle Funktionen ohne horizontales Scrollen auf Desktop, Tablet und Smartphone nutzbar (QS-2).],

  [Einfache Nutzung],
  [Tracker anlegen und Ereignisse erfassen in wenigen Klicks; Dashboard als zentrale Übersicht (QS-3).],
)

== Qualitätsszenarien

Kurze Form (Kontext / Stimulus / Reaktion / Metrik):

#table(
  columns: (0.5fr, 1.8fr, 1.8fr, 1.7fr),
  table.header[*ID*][*Stimulus (Quelle, Anstoss)*][*Reaktion des Systems*][*Metrik / Akzeptanz*],
  [QS-1],
  [Benutzer ist offline und will ein Ereignis erfassen (Verfügbarkeit)],
  [Die Applikation erlaubt die Erfassung; Synchronisation bei Rückkehr der Verbindung],
  [Es gehen keine Daten verloren, sollte der Nutzer die Applikation ohne Internetverbindung benutzen],

  [QS-2],
  [Benutzer öffnet die Applikation auf einem Smartphone oder Tablet (Benutzbarkeit)],
  [Alle Funktionen ohne horizontales Scrollen nutzbar; Layout passt sich an das Gerät an],
  [Responsives Layout über alle Seiten; keine desktop-gebundene Funktionalität],

  [QS-3],
  [Benutzer will auf dem Dashboard einen neuen Tracker anlegen oder ein Ereignis erfassen (Einfache Nutzung)],
  [Das System erlaubt dem Nutzer, Ereignisse überall zu erfassen],
  [≤ 3 Interaktionen, bis das Ereignis erfasst und sichtbar ist],
)
