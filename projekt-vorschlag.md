# Projekt-Vorschlag: Tracking-/Statistik-Applikation

Die Idee ist eine Tracking-/Statistik-Applikation zu entwickelt, mit der Benutzer eigene Tracker erstellen und damit wiederkehrende Ereignisse erfassen können.
Ein Beispiel für einen möglichen Tracker wäre z.B. die Anzahl der getrunkenen Kaffees.
Dabei sollen verschiedene Arten von Trackern unterstützt werden, beispielsweise einfache Zähler oder Zähler mit unterschiedlichen Kategorien.
Neben dem Erstellen von Trackern und dem Erfassen von Ereignissen soll die Applikation dem Benutzer auch unterschiedliche Statistiken zu den einzelnen Trackern darstellen können.

## User Stories

### Must Have

- Als Benutzer möchte ich einen eigenen Tracker erstellen können, damit ich für etwas Bestimmtes Ereignisse erfassen kann.
- Als Benutzer möchte ich meine Tracker bearbeiten und löschen können.
- Als Benutzer möchte ich bei einem Tracker ein Ereignis erfassen können, um den Tracker hochzuzählen.
- Als Benutzer möchte ich verschiedene Tracker-Typen auswählen können, damit ich unterschiedliche Arten von Informationen erfassen kann.
- Als Benutzer möchte ich einfache Zähler-Tracker erstellen können, damit ich beispielsweise die Anzahl von etwas hochzählen kann.
- Als Benutzer möchte ich erfasste Ereignisse abrufen können, damit ich nachvollziehen kann, welche Ereignisse ich wann erfasst habe.
- Als Benutzer möchte ich meine erfassten Ereignisse nachträglich bearbeiten oder löschen können, damit ich Fehleingaben korrigieren kann.
- Als Benutzer möchte ich Statistiken zu meinen Trackern anzeigen können, damit ich Entwicklungen und Trends erkennen kann.

### Should Have

- Als Benutzer möchte ich Tracker mit Kategorien erstellen können, damit ich Ereignisse zusätzlich unterscheiden und gruppieren kann.
- Als Benutzer möchte ich meine Daten nach Zeiträumen filtern können, damit ich beispielsweise einen Tag, eine Woche oder einen Monat analysieren kann.

### Could Have

- Als Benutzer möchte ich meine Tracker auch ohne Internetverbindung verwenden können, damit ich Ereignisse jederzeit erfassen kann.
- Als Benutzer möchte ich Push-Benachrichtigungen als Erinnerungen einrichten können, damit ich nicht vergesse, meine Tracker zu aktualisieren.
- Als Benutzer möchte ich weitere Tracker-Typen neben einfachen Zählern und Kategorie-Trackern zur Verfügung haben, damit ich auch andere Arten von Daten erfassen kann.

### Won't Have

- Ein Multi-User-System ist für die erste Version nicht vorgesehen. Die Daten einer Instanz sind global und werden nicht einzelnen Benutzern zugeordnet.

## Angedachter Technologie-Stack

- **Frontend**: Angular
- **Backend**: Express.js oder NestJS
- **Datenbank**: postgresql evt. aber auch mongodb
