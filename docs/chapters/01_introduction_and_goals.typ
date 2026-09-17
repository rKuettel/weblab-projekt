= Einführung und Ziele <section-introduction-and-goals>

== Aufgabenstellung

Track Thing ist eine Web-Applikation, mit der Benutzer eigene *Tracker*
anlegen können, für diese *Ereignisse (Events)* erfassen können und *Statistiken* zu Verlauf und Trends ansehen können. (Beispiel: Anzahl getrunkener Kaffees).

In der ersten Version wurden zwei Tracker-Typen umgesetzt:

- *Counter*:  einfacher Zähler, ein Event erhöht den Wert um ein numerisches Delta
- *Category*:  Zähler mit Kategorien, ein Event wird mit einer Menge einer Kategorie zugeordnet

Weitere Informationen zum Funktionalumfang können dem
#link("https://github.com/rKuettel/weblab-projekt/blob/main/projekt-vorschlag.md")[#text(fill: blue)[Projektvorschlag]] entnommen werden.

Von der dort beschriebenen Funktionalität wurden in der ersten Version alle Anforderungen der Kategorien Must und Should umgesetzt.



== Qualitätsziele

#table(
  columns: (auto, auto, 2.2fr),
  table.header[*Priorität*][*Qualitätsziel*][*Kurz-Szenario*],
  [1],
  [Erweiterbarkeit],
  [Ein neuer Tracker-Typ kann einfach ergänzt werden, ohne dass bestehende Typen geändert werden müssen.],

  [2],
  [Performance],
  [Lighthouse-Analyse des Prod-Bundles: Score ≥ 90 auf Mobile und Desktop (Durchschnitt aller Analysen).],

  [3],
  [Reproduzierbarkeit],
  [Der komplette Produktiv-Stack lässt sich aus einem frischen Clone mit einem Befehl starten (`docker compose up --build`).],
)
