# Web Programming Lab Projekt

Repo für das Abchlussprojekt des Moduls Web Programming Lab

- [Projekt-Vorschlag](./projekt-vorschlag.md)

## Running Locally

Create a `.env` file in the root of the repo, and set the following variables:

```.env
MONGODB_USER=<USER>
MONGODB_PASS=<PASSWORD>
MONGODB_URI=mongodb://localhost
```

### Development

For development first mongoDB needs to be started. Use the dedicated `docker-compose.develop.yaml` for this:

```bash
docker compose -f docker-compose.develop.yaml up -d
```

After mongoDB has been started the backend and frontend can be started in development mode by running the following command in the root of the repo:

```bash
pnpm start
```

### Docker Compose

There is `docker-compose.yaml` which builds an image for both front-/bakend and also spinns up mongodb.

```bash
docker compose up --build -d
```
