# Fazit & Reflexion

## Was lief gut?

- **ngx-translate** für die Translation: einfacher Einbau, hat direkt funktioniert.
- **Angular mit Signals**: Bisher hatte ich wenig Kontakt mit Frontend-Entwicklung, daher hatte ich für gewisse Dinge etwas länger. Die ausführliche Angular Dokumentation war aber sehr hilfreich.
- **NestJS** als Backend-Framework: hat sehr gut funktioniert. Es besitzt ebenfalls eine gute Doku und mit guten Beispielen.
- **MongoDB**: war mir neu, hat aber Spass gemacht. Eine Dokumenten-Datenbank hat gut zum Projekt gepasst.

## Herausforderungen

- **Zeit & Umfang**: Plötzlich waren die 60 Stunden vorbei, und ich hatte noch einige Dinge, die ich machen wollte. Darum sind es schlussendlich dann doch etwas mehr geworden.
- **Charting-Libraries**: ng-charts funktionierte für den Calendar zunächst gut, scheiterte dann aber an anderen Chart-Typen (inkompatibel mit Angular 22). Der Wechsel auf ngx-echarts ermöglichte schliesslich alle Charts, bis auf ein paar Probleme mit den Tests, die ich aber lösen konnte.
  Auch das Anpassen des "Themes" der Charts an das restliche PicoCSS-Design hat sich als aufwendig herausgestellt. Grund dafür war hauptsächlich, dass es nicht allzu gut dokumentiert war, aber auch, dass keine Fehlermeldungen auftraten, wenn man Felder setzt, die gar nichts machen. Somit wurde es dann hauptsächlich zu Trial and Error, bis es dann funktioniert hat.
  Ganz am Ende fiel mir dann noch auf, dass ngx-echarts den Lighthouse-Score massiv nach unten zieht.
  Ich habe versucht, das Problem noch zu minimieren, war aber nicht sehr erfolgreich.
- **Styling mit PicoCSS**: Ich habe bewusst auf ein Component-Framework verzichtet, um die UI-Komponenten selbst zu bauen. Das war mehr Aufwand als geplant, aber eine grosse Lernerfahrung.

## Was würde ich nächstes Mal anders oder besser machen?

- **Lighthouse-Score** von Anfang an im Blick behalten und die Performance-Kosten von Dependencies frühzeitig bemerken, nicht erst auf der letzten Meile.
- **Backend-Modulstruktur**: Die Trennung von Tracker und EventTracker machte anfangs Sinn, wuchs am Ende aber wieder zusammen, weil die beiden funktional einfach zusammengehören. Nächstes Mal würde ich sie von Anfang an als ein Modul anlegen.
