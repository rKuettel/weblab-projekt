#import "@preview/merman:0.3.0": mermaid
= Kontextabgrenzung <section-context-and-scope>


Track Thing kommuniziert ausschliesslich mit dem Benutzer. Es existieren keine anderen Nachbarsysteme.

#align(
  center,
)[
  #mermaid(
    "
flowchart LR
  U([\"Benutzer\"])
  TS[\"Track Thing\"]
  U -- \"Tracker anlegen \\n bearbeiten \\n löschen\" --> TS
  TS -- \"Dashboard aller \\n Tracker\" --> U
  U -- \"Ereignisse erfassen \\n löschen\" --> TS
  TS -- \"Event-Liste \\n Statistiken\" --> U
",
    width: 60%,
  )
]

== Technischer Kontext

Der Benutzer interagiert über den Browser mit Track Thing. Der Browser lädt die statischen
Assets (Angular-SPA) von nginx und ruft die REST-API über den gleichen
Entry Point (`/api/*`) auf. nginx leitet API-Requests an das NestJS-Backend
weiter, welches per Mongoose-Driver mit MongoDB kommuniziert.

#mermaid(
  "
flowchart LR
  U([\"Benutzer\"])
  B[\"Browser\"]
  NG[\"nginx\\nstatische Assets + Reverse-Proxy\"]
  API[\"NestJS REST API\\nNode.js\"]
  MG[(\"MongoDB\")]
  U --> B
  NG -- \"HTTP: HTML/JS/CSS\" --> B
  B <-- \"HTTP/JSON: /api/*\" --> NG
  NG <-- \"HTTP/JSON\" --> API
  API <--> MG
",
  width: 100%,
)
