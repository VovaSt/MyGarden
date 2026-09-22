# AI agents and automation

## What is configured

The repository has three distinct automation layers:

1. **CI** (`.github/workflows/ci.yml`) runs deterministic checks: dependency
   installation, Prisma validation/generation, unit tests, and backend build.
2. **CodeQL** (`.github/workflows/codeql.yml`) performs static security analysis
   for JavaScript and TypeScript on pull requests, pushes to `main`, and weekly.
3. **Codex review** (`.github/workflows/codex-review.yml`) can read a same-
   repository pull request and publish an AI review comment. It is disabled by
   default and cannot change repository files.

## Enable Codex review

1. In GitHub, open **MyGarden -> Settings -> Secrets and variables -> Actions**.
2. Add the repository secret `OPENAI_API_KEY`; paste an OpenAI API key. Never
   add this key to `.env.example`, source code, or a commit.
3. Add the repository variable `ENABLE_CODEX_REVIEW` with value `true`.
4. Open a pull request from a branch in this repository. The workflow posts a
   review comment after the normal CI checks.

The workflow deliberately ignores pull requests from forks. Fork code is
untrusted, and passing a secret to a workflow that checks out untrusted code is
unsafe.

## Learning workflow

Use a short-lived branch for every small feature:

1. Ask an AI agent to inspect and implement one bounded change.
2. Read the diff before committing it.
3. Run the relevant tests locally.
4. Open a pull request and read CI, CodeQL, and Codex feedback.
5. Treat AI feedback as a review hypothesis: verify it against the code and
   tests before making a change.

Useful next exercises are adding an API integration test, asking Codex to
review a Prisma migration, and deliberately introducing a validation bug in a
throwaway branch to see which automated layer catches it.
