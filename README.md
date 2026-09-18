# Skill Match

US-first **skill-contest prize matches**. Team up, stake the match, winners take the pot.

**v0 is simulated play money only.** There are no real payments, processors, cash-out, or crypto rails. This is a skill-contest lobby — **not a casino** and **not a slot site**.

Each new account (including Continue as guest) starts with **$250.00 play money**.

## Run locally (copy-paste)

You need [Node.js 22+](https://nodejs.org/) (this repo was built with Node 22). No Docker.

```bash
git clone https://github.com/graysongilmore29-gif/skill-match.git
cd skill-match
npm install
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run setup` copies [`.env.example`](.env.example) to `.env` (if you do not already have one), generates the Prisma client, pushes the SQLite schema (`prisma/dev.db`), and seeds two demo players:

- `alex@demo.local` / `demo1234`
- `jordan@demo.local` / `demo1234`

Env defaults (already in `.env.example`):

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="dev-skill-match-secret-change-me"
```

To reset the local database later: delete `prisma/dev.db` and run `npm run db:setup` (or `npm run setup` again).

### Walk the demo as a guest (one browser)

This is the lobby → wager → play → payout click-through:

1. Open [http://localhost:3000](http://localhost:3000).
2. Leave **guest** selected and click **Continue as guest** (name optional).
3. Leave mode on **1v1** and click **Create 1v1 match**.
4. Click **Fill randoms** (empty-friends state — randoms auto-ready and lock play-money stakes).
5. Click **Ready**. You land on **Lock your stake**.
6. Click **Lock $10.00 stake**, then **Start match**.
7. On **Match live**, click **Side A takes the pot** (or enter scores and **Record result**).
8. On **Pot settled**, see the split. **Rematch 1v1** sends you back to the lobby roster.

### Two real players

Open two browsers (or a private window). Sign in as Alex and Jordan, create a match on one side, join with the invite code on the other.

## Preview URL (Vercel, about two minutes)

Next.js on Vercel is the one-click public preview. **SQLite is local-only** — serverless hosts cannot keep a file database between clicks, so preview uses a free Prisma Postgres store (play money still; no payment provider).

### A. Already this GitHub repo (Grayson)

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **skill-match**.
3. Before or after the first deploy: project → **Storage** → **Create Database** → **Prisma Postgres** (hobby is fine) → **Connect** to Production and Preview. That sets `DATABASE_URL`.
4. **Deployments → Redeploy** if the first build ran without a database.
5. Open the `*.vercel.app` URL and walk the guest flow above.

### B. Deploy button (clones the repo into your GitHub, offers the database)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/graysongilmore29-gif/skill-match&project-name=skill-match&repository-name=skill-match&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22prisma%22%2C%22productSlug%22%3A%22prisma-postgres%22%7D%5D)

Accept the Prisma Postgres store when Vercel asks. Wait for the build, then open the preview URL.

`vercel.json` pins install/build/dev to the npm scripts below. GitHub integration: every push (and every PR) gets its own preview URL once the database is connected.

### Secrets (only if you are not using the Storage button)

There are **no payment keys**. v0 has no Stripe, no cash-out, no processors.

| Variable | Local | Vercel preview / production |
| --- | --- | --- |
| `DATABASE_URL` | `file:./dev.db` via `.env.example` | **Required.** Prisma Postgres sets this when you connect Storage. A `postgres://…` URL from Neon or another host also works. |
| `AUTH_SECRET` | Copied from `.env.example` | Optional for a private demo (the app has a fallback). Set any long random string if the URL is public. |

Do not point preview at the SQLite file URL. The build will stop and tell you to attach Postgres.

## What you can do

- Sign in as a guest, or with email/password
- Create a **1v1 / 2v2 / 3v3** match
- Invite a friend by code, or **fill randoms** when nobody is online
- Lock the same simulated stake for every player
- Start the match, enter a score (or declare a winning side), and settle the pot
- Rematch in the same mode

Match states: `waiting` → `ready` → `in_match` → `settled` | `void`.

## Routes

| Path | Title | What it is |
| --- | --- | --- |
| `/` | Skill cash matches with friends | Lobby: mode toggle, create/join, roster, invite, fill randoms, ready |
| `/how-it-works` | How skill prize matches work | Equal stakes, pot to winners, play-money until legal, FAQ |
| `/skill-vs-slots` | Skill matches vs slot sites | Skill + teammates vs slot sites; no house games, no spin |
| `/match/[id]/wager` | Lock your stake | Stake, pot total, play-money balance, confirm, start |
| `/match/[id]/play` | Match live | Score left, pot remaining right, declare/score stub, forfeit |
| `/match/[id]/payout` | Pot settled | Result, pot split, rematch |

## Scripts

These are the scripts in `package.json`:

| Script | Purpose |
| --- | --- |
| `npm run setup` | Copy `.env.example` → `.env` if missing, then `db:setup` |
| `npm run db:setup` | `db:generate` + `db:push` + `db:seed` (SQLite locally) |
| `npm run db:generate` | Prisma client |
| `npm run db:push` | Push schema (this repo uses `db push`, not `prisma migrate`) |
| `npm run db:seed` | Demo players Alex and Jordan |
| `npm run dev` | Next.js dev server at [http://localhost:3000](http://localhost:3000) |
| `npm run test` | Pure match-rule tests |
| `npm run e2e:api` | API happy-path against a running server (`npm run dev` in another terminal) |
| `npm run lint` | ESLint |
| `npm run build` / `npm start` | Production build / start. On Vercel, `build` also pushes schema and seeds |

## Stack

Next.js App Router (TypeScript) + Prisma. **SQLite is the first-run default** so local demo does not need Docker.

Hosted preview uses PostgreSQL (`DATABASE_URL=postgres://…`). Same models; `scripts/prisma-run.mjs` picks the provider from the URL.

## Out of scope (v0)

Real money, KYC, live game clients, voice, admin tools, and payment rails.
