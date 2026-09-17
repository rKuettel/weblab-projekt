# Web Programming Lab Projekt

Repo für das Abschlussprojekt des Moduls Web Programming Lab

- [Projekt-Vorschlag](./projekt-vorschlag.md)
- [Architektur Dokumentation](https://github.com/rKuettel/weblab-projekt/releases/download/latest/weblab-documentation.pdf)
- [Arbeitsjournal](./arbeitsjournal.md)
- [Fazit & Reflexion](./fazit.md)

## Running Locally

### Docker Compose

Im root des Repos gibt es ein `docker-compose.yaml` mit dem der komplete Stack bestehend aus Frontend/Backend und MongoDB mit einem Befehl gestartet werden kann:

```bash
docker compose up --build -d
```

### Development

Erstelle ein `.env` file im root des repos, und setze folgende Variablen:

```.env
MONGODB_USER=<USER>
MONGODB_PASS=<PASSWORD>
MONGODB_URI=mongodb://localhost
```

Für die Entwicklung muss zuerst eine mongoDB Instanz gestartet werden.
Dafür kann das `docker-compose.develop.yaml` verwendet werden:

```bash
docker compose -f docker-compose.develop.yaml up -d
```

Nachdem mongoDB gestartet wrude kann auch das frontend und backend im Enwticklungsmodus gestartet werden.
Führe dazu foglenden Command im root des repos aus:

```bash
pnpm start
```

## End-to-End Tests

Es existieren E2E Test welche den ganzen Stack zusammen testen.

Weitere infos dazu in [e2e/README.md](/e2e/README.md)
