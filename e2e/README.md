# E2E Test für Track Thing

End-to-end Tests für Track thing. Für den test wird ein temporäres Docker Environment `docker-compose.yaml` hochgefahren.
Das environment erstellt neue Container Images für Front- und Backend und started diese.
Zudem wird auch eine MongoDB gestartet.
Sobald das Environment ready ist werden mit Cypress tests auf dem UI durchgeführt.

## Ausführen

Um die tests auszuführen wird port 8080 verwendet um das UI zu exposen. Dieser MUSS frei sein.
Wenn dies der Fall ist können die Tests folgendermassen ausgeführt werden

```sh
cd e2e
pnpm e2e
```

## Test Cases

Es gibt zwei Test Cases in sind in Form einer User Journey. Diese sind in `cypress/e2e/user-journey.cy.ts` zu finden.

Die beiden tests cases sind an sich relativ ähnlich.
Sie erstellen einen Trackern, fügen ein Event hinzu, navigieren zur Detailseite und überprüfen dort die Angaben und zum schluss wird der Tracker gelöscht.

Sie unterscheiden sich indem, dass beim ersten ein Counter Tracker und beim Zweiten ein Category Tracker verwedet wird.

Ausserdem wird beim ersten Tests auch noch überprüft, dass auf der Detailseite nur events in der Date Range betrachtet werden.
