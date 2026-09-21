# MyGarden

MyGarden helps a private gardener map fruit trees, record grafted varieties,
and see approximate harvest periods and typical storage information.

## Status

This repository currently contains the approved architecture and project
bootstrap. The Angular frontend, NestJS backend, Prisma schema, and automated
test suites will be introduced in subsequent implementation milestones.

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

## Next milestone

Scaffold the Angular and NestJS applications, install current Prisma tooling,
apply the committed initial migration, then replace the bootstrap CI job with
lint, unit-test, and build jobs for both applications.
