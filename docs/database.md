# Database

## Technology and local prerequisites

The database is PostgreSQL and its schema is managed by Prisma migrations.

Use Node.js 22.x (at least 20.19.0) before installing current Prisma tooling.
This repository's current local Node.js 14.17 installation is too old for that
tooling. Docker is needed to run the provided local PostgreSQL service.

## Local setup

1. Copy `.env.example` to `.env` and replace `change-me` with a local password.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Once the backend package is scaffolded, install its dependencies and run the
   Prisma migration command from that package.

The first migration is deliberately committed in
`prisma/migrations/20260921195000_initial_schema`. Do not edit it after it has
been applied to a shared environment. Make a new migration for each later
schema change.

## Integrity rules

- PostgreSQL enforces positive garden dimensions, non-negative tree coordinates,
  valid stored geometry, complete harvest ranges, storage-range ordering, and
  foreign-key deletion rules.
- Composite foreign keys ensure a graft's tree and variety belong to the same
  fruit species.
- Garden-boundary validation for a tree or map object belongs in the backend
  service because a PostgreSQL `CHECK` constraint cannot read the dimensions of
  its parent row.
- `Garden -> Tree` and `Garden -> MapReferenceObject` use cascade deletion.
  `Tree -> Graft` also cascades. A variety or species used by another record is
  restricted from deletion.

## Approximate agricultural dates

Harvest dates are stored as month/day fields, not timestamps. A complete range
is either provided or absent. Graft override fields follow the same rule and do
not change the global variety record.
