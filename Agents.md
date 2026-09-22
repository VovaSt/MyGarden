# Fruit Tree Garden — AI Agent Instructions

## 1. Project Overview

This is a web application for managing fruit trees and grafted fruit varieties on a private garden plot.

The application allows a user to:

* create and edit a map of their garden plot;
* place fruit trees on the map;
* specify the tree species;
* record multiple grafted fruit varieties on each tree;
* store information about each fruit variety;
* see grafted varieties when clicking a tree on the map;
* see approximate harvest periods;
* see recommended harvest timing;
* see expected storage duration;
* see a harvest calendar for the entire garden;
* understand which tree and which variety should be harvested during a particular period.

The application is primarily intended for a single private user, but the architecture should not prevent adding authentication and multiple gardens/users in the future.

The project is also a learning project for AI-assisted software engineering and multi-agent development.

AI agents will be used for:

* implementation;
* testing;
* code review;
* security review;
* documentation;
* CI/CD;
* DevOps tasks.

The codebase must therefore remain highly structured, predictable and easy for AI agents to understand.

---

# 2. Core Technology Stack

## Frontend

Use:

* Angular
* TypeScript
* Angular Router
* RxJS
* Angular Material where appropriate
* SCSS

Do not introduce another frontend framework.

Do not introduce React, Vue, Svelte or similar technologies.

Prefer Angular's current recommended patterns where they are compatible with the existing project version.

---

# 3. Backend

Use:

* Node.js
* TypeScript
* NestJS
* REST API

Backend responsibilities:

* business logic;
* validation;
* persistence;
* authentication when introduced;
* garden/tree/variety/harvest APIs.

Controllers should remain thin.

Business logic belongs in services.

Database access must not be scattered throughout controllers.

---

# 4. Database

Use:

* PostgreSQL
* Prisma ORM

Database schema must be version-controlled through Prisma migrations.

Never modify the production database schema manually.

Every schema change must have an appropriate Prisma migration.

Never delete existing production data as part of a normal development migration unless explicitly requested.

---

# 5. Deployment

## Frontend

The Angular frontend is deployed to:

GitHub Pages

The frontend must therefore be a static production build.

Do not introduce server-side rendering unless explicitly requested.

The Angular application must work correctly when served from a GitHub Pages subpath.

Avoid assumptions that the application is hosted at `/`.

Routing configuration must take the GitHub Pages deployment path into account.

## Backend

The Node.js backend is NOT hosted on GitHub Pages.

It will be deployed separately.

The backend must expose an HTTP/HTTPS API consumed by the Angular frontend.

Do not place backend-specific code in the Angular application.

## Database

PostgreSQL is hosted separately from GitHub Pages.

Local development should support PostgreSQL through Docker.

---

# 6. Repository Structure

Prefer a monorepo structure similar to:

```
fruit-tree-garden/
│
├── apps/
│   ├── frontend/
│   └── backend/
│
├── packages/
│   └── shared/
│
├── prisma/
│
├── e2e/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── AGENTS.md
├── README.md
├── docker-compose.yml
└── package.json
```

The exact structure may evolve, but maintain a clear separation between frontend, backend and shared code.

---

# 7. Domain Model

The application revolves around the following concepts.

## Garden

A garden represents a user's plot.

Possible properties:

* id
* name
* description
* width
* height
* unit
* createdAt
* updatedAt

The initial version may support one garden per user, but the domain model should not make multiple gardens impossible.

---

# 8. Garden Map

The garden map represents the physical layout of the user's plot.

The user should be able to:

* define the plot dimensions;
* view the plot as a 2D map;
* place trees;
* move trees;
* select trees;
* inspect trees;
* edit trees;
* delete trees.

Initially use a simple 2D coordinate system.

A tree should have coordinates relative to the garden:

```
x
y
```

Do not use geographic latitude/longitude unless a future feature explicitly requires GPS mapping.

The garden map is a schematic representation of the user's property, not a geographic map.

---

# 9. Tree

A Tree represents a physical tree planted in the garden.

A tree may contain:

* id
* gardenId
* speciesId
* name/label
* x
* y
* plantingDate
* notes
* createdAt
* updatedAt

Example:

```
Tree #12
Species: Apple
Position: x=4.2m, y=8.7m
```

A tree can contain multiple grafted fruit varieties.

---

# 10. Fruit Species

Fruit species should be represented separately from varieties.

Examples:

* Apple
* Pear
* Plum
* Cherry
* Peach
* Apricot
* Nectarine
* Quince

Do not duplicate species information for every tree.

Prefer:

```
Species
   │
   └── Tree
```

The system should be extensible to other fruit-bearing plants.

---

# 11. Fruit Variety

A Fruit Variety represents a specific cultivar.

Examples:

* Sлава переможцям
* Antonovka
* Golden Delicious
* Idared

A variety may have:

* id
* speciesId
* name
* aliases
* description
* harvestPeriod
* storageInformation
* notes
* source/reference information

A variety is not the same thing as a tree.

One variety can be grafted onto multiple trees.

---

# 12. Graft

A Graft represents a specific variety grafted onto a specific physical tree.

This is an important domain concept.

Example:

```
Tree #5
   ├── graft: Слава переможцям
   ├── graft: Golden Delicious
   └── graft: Idared
```

A graft may contain:

* id
* treeId
* varietyId
* graftingDate
* notes
* harvest adjustments
* status

Do not store grafted variety information directly as a JSON blob on the Tree entity unless there is a strong architectural reason.

Prefer a relational model.

---

# 13. Harvest Information

Harvest information belongs primarily to the variety, but may be adjusted for a specific graft/tree.

A variety can have an approximate harvest window:

```
harvestStart
harvestEnd
```

However, harvest timing is NOT an exact universal date.

Actual harvest time depends on factors such as:

* climate;
* weather;
* local growing conditions;
* tree age;
* crop load;
* rootstock;
* fruit maturity;
* season;
* region.

Therefore the UI must avoid presenting harvest dates as guaranteed facts.

Prefer wording such as:

"Approximate harvest period"

rather than:

"Harvest on September 18."

---

# 14. Storage Information

Fruit varieties may have storage information such as:

* recommended storage duration;
* storage conditions;
* approximate storage end;
* recommended temperature;
* notes.

Do not present storage duration as a guaranteed result.

Example:

```
Typical storage:
3–4 months under suitable conditions
```

not:

```
This fruit will always last exactly 120 days.
```

Storage depends on:

* maturity at harvest;
* temperature;
* humidity;
* fruit condition;
* storage method;
* disease/injury;
* ventilation.

---

# 15. Harvest Calendar

The application must provide a harvest calendar.

The calendar should answer:

* Which varieties are ready approximately now?
* Which tree contains those varieties?
* What is the approximate harvest window?
* What should be harvested next?
* Which trees will need attention during a selected period?

Example:

```
September

Sep 1–10
  Tree #3
  Apple — Variety A

Sep 10–20
  Tree #5
  Apple — Variety B

Sep 20–30
  Tree #2
  Pear — Variety C
```

The calendar should support:

* month view;
* list/timeline view;
* filtering by species;
* filtering by tree;
* filtering by variety.

---

# 16. Harvest Events

Do not initially treat the harvest calendar as a static manually-entered calendar.

Harvest events should be derived from:

```
Tree
  +
Graft
  +
Variety
  +
Harvest information
```

A future version may allow the user to override the calculated harvest period for a specific tree.

For example:

```
Variety:
harvest period = September 10–25

Specific tree:
adjusted period = September 15–30
```

This adjustment must not modify the global variety information.

---

# 17. Domain Rules

Important rules:

1. A garden can contain many trees.
2. A tree belongs to exactly one garden.
3. A tree has exactly one primary species.
4. A tree can contain zero or more grafts.
5. A graft belongs to exactly one tree.
6. A graft references exactly one fruit variety.
7. A variety belongs to exactly one fruit species.
8. The same variety may be grafted onto many trees.
9. A tree may contain multiple varieties of the same species if needed.
10. A variety may exist in the database without currently being grafted onto a tree.
11. Deleting a tree must not delete the global variety definition.
12. Deleting a variety must not silently remove historical harvest information.
13. Use foreign keys and appropriate deletion rules.

---

# 18. Map Interaction

The map is a central part of the application.

When a user clicks a tree:

```
Tree selected
     ↓
Tree details
     ↓
Species
     ↓
Grafted varieties
     ↓
Harvest information
     ↓
Storage information
```

The tree should have a visually distinct representation.

Initially use simple SVG or HTML/CSS rendering rather than introducing a heavy GIS library.

The map does not need satellite imagery.

---

# 19. Frontend Architecture

Prefer feature-oriented Angular architecture.

Example:

```
apps/frontend/src/app/

core/
shared/
features/
    garden/
    trees/
    varieties/
    harvest-calendar/
```

Avoid putting all components into one large directory.

A feature should encapsulate:

* components;
* services;
* models;
* state;
* routes;
* tests.

---

# 20. Backend Architecture

Prefer:

```
modules/
    gardens/
    trees/
    species/
    varieties/
    grafts/
    harvest/
```

Each module should have clear separation between:

* controller
* service
* DTO
* persistence/repository layer where appropriate
* tests

Do not put business logic in controllers.

---

# 21. API Design

Use REST.

Example endpoints:

```
GET    /gardens
POST   /gardens
GET    /gardens/:id
PATCH  /gardens/:id
DELETE /gardens/:id

GET    /gardens/:id/trees
POST   /gardens/:id/trees

GET    /trees/:id
PATCH  /trees/:id
DELETE /trees/:id

GET    /trees/:id/grafts
POST   /trees/:id/grafts

GET    /varieties
GET    /varieties/:id

GET    /harvest-calendar
```

The exact API can evolve.

Do not introduce GraphQL unless explicitly requested.

---

# 22. Validation

Validate all external input.

Frontend validation improves UX but is NOT a substitute for backend validation.

Backend must validate:

* coordinates;
* dimensions;
* IDs;
* dates;
* strings;
* enums;
* pagination;
* filters.

Never trust frontend input.

---

# 23. Units

The application should use metric units.

Use:

* meters for garden dimensions and coordinates;
* centimeters/millimeters where appropriate;
* kilograms where relevant;
* Celsius for temperature.

Avoid storing formatted strings such as:

```
"6 meters"
```

Prefer:

```
width: 6
unit: "m"
```

Data should be stored in normalized machine-readable form.

Formatting belongs to the UI.

---

# 24. Dates

Store dates in a consistent format.

Use ISO 8601 / UTC for timestamps.

Be careful with date-only agricultural concepts.

A harvest period such as:

```
September 10–25
```

is not necessarily a timestamp.

Do not introduce timezone conversions where they are not meaningful.

The user's local timezone should be used for calendar presentation.

---

# 25. Agricultural Data Quality

Agricultural information is inherently approximate.

Never invent:

* variety characteristics;
* harvest dates;
* storage durations;
* disease resistance;
* frost resistance;
* pollination requirements.

When the project needs real agricultural data, either:

1. use a trusted source;
2. mark the value as user-provided;
3. mark the value as approximate;
4. leave the value unknown.

Do not silently convert assumptions into authoritative facts.

---

# 26. Sources for Variety Information

The data model should eventually support source attribution.

For agricultural facts, consider storing:

* sourceName
* sourceUrl
* retrievedAt
* notes

A variety description may have multiple sources in the future.

Do not claim that information is scientifically verified unless an appropriate source supports that claim.

---

# 27. AI-Assisted Development Rules

This repository is specifically designed for AI-assisted software engineering.

Every agent must:

1. Inspect the existing code before changing it.
2. Understand the relevant architecture.
3. Make the smallest reasonable change.
4. Avoid unrelated refactoring.
5. Reuse existing abstractions.
6. Add or update tests.
7. Run relevant tests.
8. Report what was changed.
9. Report tests that were run.
10. Report known limitations.

Do not rewrite large parts of the project merely because a different architecture might be theoretically better.

---

# 28. Developer Agent

The Developer Agent is responsible for implementing features.

Before implementation:

1. inspect the repository;
2. inspect relevant domain models;
3. inspect existing tests;
4. identify affected modules;
5. formulate an implementation plan.

Then implement the smallest complete solution.

After implementation:

* run lint;
* run unit tests;
* run relevant integration tests;
* build affected applications.

Do not mark a task complete if tests fail unless the failure is explicitly documented.

---

# 29. Testing Agent

The Testing Agent focuses on finding missing coverage.

For every feature, consider:

* happy path;
* invalid input;
* boundary values;
* empty data;
* multiple grafts;
* duplicate varieties;
* deleted entities;
* invalid relationships;
* date boundaries;
* harvest periods crossing month/year boundaries.

For the garden map, test:

* placing a tree;
* moving a tree;
* selecting a tree;
* editing a tree;
* deleting a tree;
* coordinate persistence.

For harvest calendar, test:

* overlapping harvest periods;
* multiple varieties on one tree;
* one variety on multiple trees;
* filtering;
* date boundaries.

---

# 30. Code Review Agent

Review changes for:

* correctness;
* maintainability;
* architecture;
* security;
* data integrity;
* API compatibility;
* database correctness;
* test coverage;
* Angular performance;
* accessibility.

Do not waste review comments on stylistic issues already enforced by automated linting.

Focus on actionable issues.

---

# 31. Security Agent

Check for:

* exposed secrets;
* insecure authentication;
* authorization problems;
* injection vulnerabilities;
* unsafe input handling;
* insecure API endpoints;
* dependency vulnerabilities;
* CORS configuration;
* accidental exposure of database information;
* unsafe file handling.

Never place secrets in Git.

Never put production credentials in frontend code.

Remember:

Anything shipped to Angular/browser code must be considered public.

---

# 32. DevOps Agent

The DevOps Agent manages:

* Docker;
* Docker Compose;
* GitHub Actions;
* GitHub Pages deployment;
* backend deployment;
* environment variables;
* migrations;
* health checks;
* CI/CD.

Frontend deployment must produce a static Angular build suitable for GitHub Pages.

Never store secrets in GitHub Pages artifacts.

---

# 33. CI Requirements

Every pull request should run:

```
install dependencies
lint
unit tests
backend build
frontend build
```

Where practical, also run:

```
integration tests
E2E tests
security/dependency checks
```

The CI pipeline should fail if required checks fail.

---

# 34. GitHub Pages Requirements

The Angular application must:

* build successfully in CI;
* deploy automatically from the appropriate branch/workflow;
* support the repository's GitHub Pages base path;
* load static assets correctly;
* handle Angular routing appropriately.

Do not assume the site is hosted at the root domain.

The repository name may form part of the URL.

Example:

```
https://username.github.io/fruit-tree-garden/
```

The implementation must account for this.

---

# 35. Environment Configuration

Never hard-code:

* database credentials;
* API secrets;
* JWT secrets;
* production passwords;
* private tokens.

Frontend configuration may contain the public API base URL.

Remember that frontend environment variables are NOT secrets.

Use:

```
.env.example
```

to document required backend variables.

---

# 36. Testing Strategy

Use:

* Jest for unit/backend tests;
* Angular testing tools for frontend unit tests;
* Playwright for E2E tests.

Critical E2E scenarios should include:

1. Create garden.
2. Create tree.
3. Place tree on map.
4. Add grafted variety.
5. Open tree details.
6. View harvest information.
7. Open harvest calendar.
8. Find the tree associated with a harvest event.

---

# 37. Accessibility

The UI should follow basic accessibility practices.

Important requirements:

* keyboard-accessible controls;
* meaningful labels;
* adequate contrast;
* semantic HTML;
* accessible dialogs;
* accessible buttons;
* meaningful error messages.

The map must not be completely dependent on mouse interaction.

There should be an alternative way to select/edit trees.

---

# 38. Performance

Do not prematurely optimize.

However:

* avoid unnecessary API requests;
* avoid rendering thousands of DOM elements unnecessarily;
* use Angular's appropriate change detection/rendering mechanisms;
* paginate large lists;
* index database fields used for frequent filtering;
* avoid N+1 database queries.

The garden map should remain responsive.

---

# 39. Error Handling

Backend errors should have predictable structures.

Frontend should:

* show useful user-facing messages;
* not expose stack traces;
* handle network failures;
* handle unavailable backend;
* handle validation errors.

Never silently ignore important errors.

---

# 40. Logging

Backend logs should contain enough information to diagnose failures.

Do not log:

* passwords;
* tokens;
* secrets;
* sensitive personal information.

Use structured logging where practical.

---

# 41. Database Migrations

Whenever the Prisma schema changes:

1. update schema;
2. create migration;
3. run migration locally;
4. update tests;
5. verify affected API behavior.

Do not manually edit migration history after it has been applied to shared environments.

---

# 42. Documentation

Maintain:

```
README.md
```

It should explain:

* project purpose;
* architecture;
* local setup;
* environment variables;
* database setup;
* running frontend;
* running backend;
* running tests;
* deployment.

Maintain additional documentation in:

```
docs/
```

for:

* architecture;
* database;
* API;
* AI agents;
* deployment.

---

# 43. AI Agent Communication

When completing a task, provide a concise summary:

```
Summary:
- ...
- ...

Tests:
- ...
- ...

Notes:
- ...
```

If something could not be verified, explicitly say so.

Never claim a test passed if it was not actually run.

Never claim deployment succeeded unless it was actually verified.

---

# 44. Important Development Principle

The project should be simple enough that a human developer can understand the entire system.

AI agents must not introduce unnecessary abstraction simply because it is possible.

Prefer:

```
simple
explicit
testable
maintainable
```

over:

```
clever
generic
over-engineered
```

---

# 45. Initial Product Scope

The first version should contain only:

1. Garden creation.
2. Garden map.
3. Tree placement.
4. Tree editing.
5. Fruit species.
6. Fruit varieties.
7. Multiple grafts per tree.
8. Tree details.
9. Harvest information.
10. Harvest calendar.
11. Basic persistence.
12. Tests.
13. CI.
14. GitHub Pages deployment.

Do NOT implement initially:

* AI chatbot;
* weather integration;
* satellite maps;
* IoT sensors;
* automatic disease detection;
* image recognition;
* mobile application;
* complex GIS;
* notifications;
* social features.

These may be future extensions.

---

# 46. Future AI Features

Possible future features include:

* AI-assisted identification of fruit varieties;
* AI-assisted disease identification from photos;
* AI-generated gardening recommendations;
* weather-aware harvest recommendations;
* personalized gardening task planning;
* natural-language queries such as:
  "Which apples should I harvest this week?"
* automatic generation of seasonal garden tasks.

These features must not be implemented until the core application is stable.

---

# 47. Agent Safety Rule

AI agents must not perform destructive operations without explicit confirmation.

Examples:

* deleting production data;
* dropping database tables;
* destroying infrastructure;
* changing production credentials;
* force-pushing Git history;
* deleting GitHub repositories;
* deploying breaking database migrations.

When an operation is potentially destructive, stop and request confirmation.

---

# 48. Definition of Done

A feature is considered complete only when:

* implementation is complete;
* relevant tests exist;
* tests pass;
* lint passes;
* affected applications build;
* database migrations are included when necessary;
* documentation is updated when necessary;
* no unrelated files were changed;
* the final change is understandable to another developer.

---

# 49. Agent Mindset

Do not think of this repository as a collection of isolated coding tasks.

Think in terms of:

```
Domain
    ↓
Architecture
    ↓
Implementation
    ↓
Tests
    ↓
Review
    ↓
CI
    ↓
Deployment
```

Every change should fit into this lifecycle.

The goal is not merely to generate code.

The goal is to build a maintainable software system using AI-assisted engineering.

---

# 50. Code Review Rules

## Backend and persistence

* Flag controller business logic, missing DTO validation, and invalid foreign-key relationships.
* Flag Prisma schema changes without a committed migration.
* Flag migrations that can delete or silently rewrite existing data.
* Flag API changes that expose internal errors, secrets, or database details.

## Domain correctness

* Flag grafts whose tree and variety species are not guaranteed to match.
* Flag harvest calendar changes that persist derived events or present approximate dates as guarantees.
* Flag map reference objects that affect harvest calculations or tree domain rules.

## Review scope

* Focus on material correctness, security, data integrity, and accessibility issues.
* Leave formatting, linting, and other deterministic checks to CI.
