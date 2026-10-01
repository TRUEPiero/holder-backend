# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Safe startup and database setup

`bun run dev` and Docker Compose start the application without changing the database
schema or clearing Redis. Redis refresh sessions survive application restarts.

For a new **development** database, run `bun run prisma:generate` and then
`bun run prisma:push` explicitly. The latter no longer uses `--force-reset` and must
not be run against production as a migration strategy. Seed commands (`migrate:*`
and `gpm`) are manual development setup commands, not versioned schema migrations;
they must not be run on every restart. Back up existing databases before schema
changes. This patch does not introduce or apply a production migration baseline.

## Telegram account linking

1. Sign in to the HTTP API.
2. Call `POST /user/telegram/link` with the access cookie. The response is
   `{ "data": { "token": "...", "expiresIn": 300 } }`.
3. Open `https://t.me/<bot_username>?start=<token>` or send `/start <token>` to
   the bot in a private chat. The frontend needs to build this link using the
   returned token instead of the numeric user ID.

Tokens are random, expire after five minutes and can be used only once. Failed
link attempts after token consumption require a fresh token. Existing linked
accounts cannot be replaced by this flow; unlink/relink is not implemented.
An already linked user can use `/start` without a token. Telegram identity fields
can no longer be changed through `PATCH /user/`. Existing stored Telegram links
are preserved; links created before this fix have not been retrospectively verified.

## Authentication compatibility

New JWTs contain `token_use: access` or `token_use: refresh`. The API rejects
legacy tokens without this claim, so users must sign in again after deployment.
Refresh tokens are rejected in the access cookie, and access tokens are rejected
by refresh/logout verification. Refresh rotation also checks the session owner.

## Checks

Run `bun test` and `bun run typecheck` (TypeScript CLI must be installed).
Security tests use local fakes for persistence and never connect to the configured
PostgreSQL, Redis, or Telegram services. Database concurrency and end-to-end bot
operation still need a separate disposable integration environment.
