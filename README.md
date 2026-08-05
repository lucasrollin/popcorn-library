# Popcorn Library

![CI](https://github.com/lucasrollin/popcorn-library/actions/workflows/ci.yml/badge.svg)

Film discovery platform. Search movies through the TMDB API, build personal lists, and rate films.

**Stack:** React · TypeScript · Express · PostgreSQL · Prisma · Docker

## Tech stack

**Frontend** — React 19, TypeScript, React Router v7, Zustand, React Hook Form + Zod, SCSS Modules, Vite

**Backend** — Node.js, Express 5, TypeScript, Prisma, PostgreSQL

**Infra** — Docker, Nginx (reverse proxy), GitHub Actions

## Architecture

The backend uses a layered architecture, each layer with a single responsibility:

```
routes → controllers → services → repositories  (internal database)
                                 └→ clients      (external APIs, e.g. TMDB)
```

- **Controllers** orchestrate the request/response; they contain no business logic.
- **Services** hold the business logic.
- **Repositories** are the only layer allowed to use Prisma.
- **Clients** are the only layer allowed to call third-party APIs.

### Runtime topology

Four containers on a private Docker network. Nginx is the only one that
publishes a port, so it is the single entry point to the whole stack.

```mermaid
flowchart LR
    Browser["Browser"]
    TMDB["TMDB API<br/>(third party)"]

    subgraph net["Docker Compose network - private"]
        Nginx["nginx<br/>reverse proxy"]
        Frontend["frontend<br/>static SPA build"]
        Backend["backend<br/>Express, :3000"]
        DB[("db<br/>PostgreSQL, :5432")]
    end

    Browser -->|"port 80, the only published one"| Nginx
    Nginx -->|"/api/*"| Backend
    Nginx -->|"everything else"| Frontend
    Backend -->|"Prisma"| DB
    Backend -->|"Bearer token, never reaches the browser"| TMDB
```

Three consequences worth naming:

- **PostgreSQL is unreachable from the host.** No port mapping in
  `docker-compose.yml`; only containers on the network can dial `db:5432`.
  Local development needs `localhost:5433` for Prisma, so that mapping lives in
  a gitignored `docker-compose.override.yml` (see the committed `.example`).
- **The browser never talks to TMDB.** Every call is proxied by the backend,
  which holds the Bearer token server-side.
- **The frontend is built, not served by Node.** Vite compiles it at image build
  time and a second nginx serves the static files, so no JavaScript runtime ships
  to production for the frontend.

### Key decisions

- **Opaque session tokens, not JWT.** A random token is stored raw in an httpOnly cookie and SHA-256 hashed in the database. Every request validates the session against the DB (which also enforces soft-deleted accounts), so the stateless advantage of a JWT would be lost anyway.
- **Password hashing with argon2id** (OWASP recommendation).
- **GDPR-friendly account deletion.** Deleting an account anonymizes the record (email, username, password, avatar) and sets `deletedAt`, instead of removing the row.
- **Lazy film persistence.** Films from TMDB are written to the database only the first time a user rates or adds one to a list.
- **Validation and errors.** Zod validates every request body; a custom error hierarchy is serialized by a single global error handler into a consistent `{ error, message }` response.

## Data model

Six tables. `ListFilm` is an explicit join table rather than an implicit
many-to-many relation, because a film's membership in a list carries data of its
own (`addedAt`).

```mermaid
erDiagram
    User ||--o{ Session  : "opens"
    User ||--o{ List     : "owns"
    User ||--o{ Rating   : "writes"
    List ||--o{ ListFilm : "contains"
    Film ||--o{ ListFilm : "appears in"
    Film ||--o{ Rating   : "receives"

    User {
        string   id        PK
        string   email     UK "anonymized on account deletion"
        string   username  UK "anonymized on account deletion"
        string   password     "argon2id hash"
        string   avatar       "nullable"
        datetime createdAt
        datetime updatedAt
        datetime deletedAt    "nullable - GDPR soft delete"
    }

    Session {
        string   id        PK
        string   tokenHash UK "SHA-256 of the cookie value"
        string   userId    FK
        datetime expiresAt
        datetime createdAt
    }

    Film {
        string id             PK
        int    tmdbId         UK "TMDB identity, the one the API uses"
        string imdbId            "nullable"
        string title
        string overview          "nullable"
        string posterUrl         "nullable"
        int    releaseYear       "nullable"
        float  tmdbRating        "nullable"
        int    tmdbVotesCount    "nullable"
    }

    List {
        string   id          PK
        string   userId      FK
        string   name
        string   description    "nullable"
        boolean  isPublic       "defaults to false"
        datetime createdAt
        datetime updatedAt
    }

    ListFilm {
        string   id      PK
        string   listId  FK
        string   filmId  FK
        datetime addedAt
    }

    Rating {
        string   id        PK
        string   userId    FK
        string   filmId    FK
        int      score        "1 to 5"
        datetime createdAt
        datetime updatedAt
    }
```

Three constraints carry the modelling decisions, and none of them are expressible
in the diagram above:

- **`@@unique([userId, filmId])` on `Rating`** — a user rates a given film once.
  Re-rating updates the existing row; rating the same score again deletes it.
- **`@@unique([listId, filmId])` on `ListFilm`** — the same film cannot be added
  twice to one list. The database enforces it, so the API returns `409` instead
  of relying on a check-then-insert race.
- **`Film` rows are created lazily** — a film is only persisted the first time
  someone rates it or adds it to a list. Everything else is served straight from
  TMDB, so the table stays a cache of what users actually engaged with.

Every foreign key is indexed (`@@index`), and all relations use Prisma's default
`RESTRICT` delete behaviour: cleanup order is explicit in the service layer,
inside a transaction, rather than delegated to cascading deletes.

## API

All routes are mounted under `/api`. **Auth** is the session cookie: _required_
rejects with `401` when it is missing or expired, _optional_ changes the response
instead of rejecting it.

| Method   | Path                                | Auth     | Description                                              |
| -------- | ----------------------------------- | -------- | -------------------------------------------------------- |
| `GET`    | `/api/health`                       | —        | Liveness probe, excluded from rate limiting               |
| `POST`   | `/api/auth/register`                | —        | Create an account, `409` if email or username is taken    |
| `POST`   | `/api/auth/login`                   | —        | Open a session, sets the httpOnly cookie                  |
| `POST`   | `/api/auth/logout`                  | required | Close the current session                                 |
| `GET`    | `/api/auth/me`                      | required | The signed-in user                                        |
| `GET`    | `/api/films/search?q=`              | —        | Search TMDB, first page only                              |
| `GET`    | `/api/films/:tmdbId`                | —        | Film details, credits included                            |
| `GET`    | `/api/films/:tmdbId/ratings`        | —        | Every rating for a film                                   |
| `GET`    | `/api/lists`                        | —        | All public lists                                          |
| `GET`    | `/api/lists/me`                     | required | The signed-in user's lists                                |
| `GET`    | `/api/lists/:id`                    | optional | One list — private lists resolve only for their owner     |
| `POST`   | `/api/lists`                        | required | Create a list                                             |
| `PATCH`  | `/api/lists/:id`                    | required | Rename, re-describe, or publish a list                    |
| `DELETE` | `/api/lists/:id`                    | required | Delete a list and its entries                             |
| `POST`   | `/api/lists/:id/films`              | required | Add a film, `409` if already in the list                  |
| `DELETE` | `/api/lists/:id/films/:tmdbId`      | required | Remove a film from the list                               |
| `POST`   | `/api/ratings`                      | required | Rate a film, `409` if already rated                       |
| `PATCH`  | `/api/ratings/:id`                  | required | Change a score                                            |
| `DELETE` | `/api/ratings/:id`                  | required | Remove a rating                                           |
| `PATCH`  | `/api/users/me`                     | required | Update username or avatar, `409` if the username is taken |
| `DELETE` | `/api/users/me`                     | required | Anonymize the account (GDPR), keeps no personal data      |
| `GET`    | `/api/users/:username`              | —        | Public profile                                            |

Every request body and URL parameter is validated by Zod before reaching a
controller. Failures short-circuit to the global error handler, which serializes
every error — expected or not — into the same shape:

```json
{ "error": "FILM_NOT_FOUND", "message": "Film not found" }
```

Two rate limiters sit in front: a strict one on `/api/auth/login` and
`/api/auth/register` to blunt credential stuffing, and a permissive global one on
everything else under `/api`.

## Known limitations

Deliberate MVP trade-offs — shipping a deployed product first, at a scale where these are harmless:

- **No pagination.** Three endpoints return a single batch of results:
  - film search only surfaces the first page from TMDB (20 results);
  - `GET /api/lists` returns every public list in the database;
  - `GET /api/films/:tmdbId/ratings` returns every rating for a film.

  The planned fix is a validated `?page=` query param, `take`/`skip` at the repository layer, a `totalCount` in the responses, and pagination controls in the UI.

## Getting started

Requirements: Node 24+, Docker.

### Run everything in Docker

The whole stack (PostgreSQL, backend, frontend, Nginx reverse proxy) is containerized:

```bash
cp .env.example .env                   # PostgreSQL credentials used by Docker Compose
cp backend/.env.example backend/.env   # fill in the values, including your TMDB access token
docker compose up -d                   # http://localhost
```

Migrations run automatically when the backend container starts.

### Local development

Only the database runs in Docker; both apps run with hot reload:

```bash
# 1. Start PostgreSQL
cp .env.example .env        # PostgreSQL credentials used by Docker Compose
cp docker-compose.override.yml.example docker-compose.override.yml  # exposes Postgres on localhost:5433 (dev only)
docker compose up -d db

# 2. Backend
cd backend
cp .env.example .env        # fill in the values, including your TMDB access token
npm install
npx prisma migrate dev
npm run dev                 # http://localhost:3000

# 3. Frontend (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

In development the frontend proxies `/api` requests to the backend, so both run side by side.

## Road to MVP

- ✅ Project setup (folder structure, Prisma schema, Dockerized PostgreSQL)
- ✅ Auth API (register, login, logout, session middleware)
- ✅ Films API (TMDB search + film detail)
- ✅ Lists API (full CRUD + add/remove films)
- ✅ Ratings API (create, update, delete, ratings per film)
- ✅ Frontend (search, film detail, lists, ratings, public profiles, settings)
- ✅ CI (GitHub Actions — lint, build and unit tests for both apps)
- ✅ Full containerization + Nginx reverse proxy
- ⬜ Deployment (VPS)
