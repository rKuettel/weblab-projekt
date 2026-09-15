= Verteilungssicht <section-deployment-view>

== Produktion (Docker Compose)

`docker-compose.yaml` (Repo-Root) setzt den kompletten Stack aus drei Containern auf
einem Docker-Host auf. nginx ist der einzige nach aussen exponierte Port.

```mermaid
flowchart LR
  U(["Benutzer-Browser"])
  subgraph Host["Docker-Host (docker-compose.yaml)"]
    subgraph FE["frontend (nginx:alpine)"]
      NG["nginx, Port 80\n→ Host-Port 8080"]
    end
    subgraph BE["backend (node:alpine)"]
      ND["NestJS API, Port 3000\n(nur intern)"]
    end
    subgraph MG["mongo (mongo:7)"]
      MN["MongoDB, Port 27017\n(nur intern)"]
    end
  end
  U -- "http://localhost:8080" --> NG
  NG -- "/api/* Reverse-Proxy" --> ND
  ND -- "Mongoose" --> MN
```

nginx liefert die statischen SPA-Assets aus und proxyt `/api/*`
auf das Backend. Dadurch gibt es genau einen Entry Point und kein CORS.
MongoDB wird bewusst nicht auf den Host gemappt, das nur das Backend darf darauf zugreifen kann.

== Entwicklungsumgebung

```mermaid
flowchart LR
  BR(["Browser"])
  NGX["Frontend\n ng serve, Port 4200 \n"]
  ND["nest start --watch\n Port 3000"]
  subgraph Docker["docker-compose.develop.yaml"]
    MN[("MongoDB\n  Port 27017")]
    MK["Mongoku\n Port 3100"]
  end
  BR --> NGX
  NGX -- "/api/* Reverse-Proxy" --> ND
  ND --> MN
  BR -- "(DB-Inspektion)" --> MK
  MK --> MN
```

Für die Entwicklung läuft nur MongoDB (inkl. Mongoku als
Web-Inspektionstool) in Docker. Frontend und Backend laufen nativ im Watch-Modus
für schnelle Iteration (`pnpm start` am Workspace-Root startet beide parallel).
Der Dev-Server-Proxy (`config/proxy.conf.json`) spiegelt das nginx-Setup der
Produktion.

== E2E-Testumgebung

`e2e/docker-compose.yaml` baut dieselben Images wie die Produktion und startet sie
temporär (`pnpm e2e` in `e2e/`). Cypress (Chromium) testet gegen
`http://localhost:8080` und reist die Umgebung danach ab. Damit testen E2E-Tests
exakt das, was in der Produktion läuft.

