# MyGarden

MyGarden helps a private gardener map fruit trees, record grafted varieties,
and see approximate harvest periods and typical storage information.

## Status

This repository contains an Angular frontend, NestJS backend, PostgreSQL/Prisma
schema, and automated test suites. The first frontend screen creates and lists
gardens through the REST API.

## Planned architecture

- Angular, TypeScript, Angular Material, and SCSS frontend, deployed as a
  static GitHub Pages site.
- NestJS REST API with PostgreSQL and Prisma, deployed separately.
- Feature-oriented frontend and module-oriented backend.
- A schematic, metre-based garden map with trees and visual reference objects
  such as buildings and fences.

The full model, REST API outline, ER diagram, and planned screens are in
[the architecture document](docs/architecture.md).
Database conventions, the initial migration, and local PostgreSQL setup are in
[the database document](docs/database.md).

## Repository layout

```text
apps/
  frontend/       # Angular application (planned)
  backend/        # NestJS API (planned)
packages/
  shared/         # Shared TypeScript contracts (planned)
prisma/           # Prisma schema and migrations (planned)
e2e/              # Playwright tests (planned)
docs/             # Architecture and supporting documentation
```

## Development principles

The project follows the domain rules and agent guidelines in
[Agents.md](Agents.md). Agricultural harvest and storage information is always
presented as approximate and source-attributed where possible.

## Backend and database setup

1. Install Node.js 22.x or newer and Docker Desktop.
2. Copy `.env.example` to `.env`.
3. Run `docker compose up -d postgres` to start local PostgreSQL.
4. Run `npm ci` to install the exact dependency versions from `package-lock.json`.
5. Run `npm run db:migrate:deploy` to create/update the local tables.
6. Run `npm run backend:start:dev` to start the API at
   `http://localhost:3000/api`.

`GET /api/health` is a technical health endpoint. The first domain API is
`/api/gardens`, supporting creation, listing, retrieval, editing, and deletion
of gardens.

`GET /api/harvest-calendar?gardenId=<uuid>` returns derived, approximate
harvest entries. Optional `month`, `speciesId`, `treeId`, and `varietyId`
filters narrow the result without creating or storing calendar-event records.

## Frontend setup

With the backend running, use `npm run frontend:start` and open the local URL
shown by Angular. The initial Gardens screen calls `http://localhost:3000/api`.

Run `npm run frontend:test` for Angular unit tests and `npm run frontend:build`
for the static production build. The build output is suitable for GitHub Pages;
deployment base-path configuration will be added with the deployment workflow.

## Next milestone

Build the interactive SVG garden map, then connect the harvest calendar,
variety catalogue, and tree/graft editing screens to the API.
