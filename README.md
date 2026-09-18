# Skill Match

US-first **skill-contest prize matches**. Team up, stake the match, winners take the pot.

**v0 is simulated play money only.** There are no real payments, processors, cash-out, or crypto rails. This is a skill-contest lobby — **not a casino** and **not a slot site**.

Each new account (including Continue as guest) starts with **$250.00 play money**.

## Live preview

**URL:** _pending — Grayson’s Vercel login is required once._

Paste the `https://*.vercel.app` URL on the line above after the first successful deploy. This checkout has no `VERCEL_TOKEN`; `npx vercel whoami` returns `login_required`, so the URL cannot be minted from here.

SQLite is local-only. Hosted preview uses a free **Prisma Postgres** store (play money still; no payment provider). `vercel.json` pins install/build/dev to the npm scripts below and deploys Next.js from `iad1` (US-first).

### One command (from this repo)

```bash
npm run preview:deploy
```

That is `scripts/preview-deploy.mjs`: link or create the Vercel project, attach Prisma Postgres (`DATABASE_URL` on Production + Preview), connect this GitHub repo so later PRs get preview URLs, deploy, and print the `*.vercel.app` link.

If the script stops for login, finish these clicks **once**, then re-run the same command:

1. Open [vercel.com/login](https://vercel.com/login) and sign in with **GitHub** as the owner of `graysongilmore29-gif/skill-match`.
2. In the project terminal run `npx vercel login` and complete the GitHub / email browser prompt.
3. Re-run `npm run preview:deploy`.
4. If the site itself asks for a Vercel password: project **Settings → Deployment Protection → Standard Protection → Off** (guest click-through must be public).
5. Paste the printed `https://*.vercel.app` URL into this section and push.

**Dashboard equivalent (still once):** [vercel.com/new](https://vercel.com/new) → Import **skill-match** (this GitHub repo, not a second clone) → Deploy (the first build may fail without Postgres — expected) → **Storage → Create Database → Prisma Postgres** (hobby) → Connect Production and Preview → **Deployments → Redeploy** → paste the URL here.

Forks / other GitHub accounts can use the Deploy button (offers Prisma Postgres during setup):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/graysongilmore29-gif/skill-match&project-name=skill-match&repository-name=skill-match&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22prisma%22%2C%22productSlug%22%3A%22prisma-postgres%22%2C%22protocol%22%3A%22storage%22%2C%22allowConnectExistingProduct%22%3Atrue%7D%5D)

Accept the Prisma Postgres store when Vercel asks. Wait for the build, then open the preview URL.

Once GitHub is connected, every push and every PR gets its own preview URL.

### Secrets (only if you skip the Storage / integration step)

There are **no payment keys**. v0 has no Stripe, no cash-out, no processors.

| Variable | Local | Vercel preview / production |
| --- | --- | --- |
| `DATABASE_URL` | `file:./dev.db` via `.env.example` | **Required.** Prisma Postgres sets this when you connect Storage. A `postgres://…` URL from Neon or another host also works. |
| `AUTH_SECRET` | Copied from `.env.example` | Optional for a private demo (the app has a fallback). Set any long random string if the URL is public. |

Do not point preview at the SQLite file URL. The build will stop and tell you to attach Postgres.

## Walk the demo as a guest (one browser)

This is the lobby → wager → play → payout click-through. Use the Live preview URL, or [http://localhost:3000](http://localhost:3000) after local setup.

1. Open the preview URL (or localhost).
2. Leave **guest** selected and click **Continue as guest** (name optional).
3. Leave mode on **1v1** and click **Create 1v1 match**.
4. Click **Fill randoms** (empty-friends state — randoms auto-ready and lock play-money stakes).
5. Click **Ready**. You land on **Lock your stake**.
6. Click **Lock $10.00 stake**, then **Start match**.
7. On **Match live**, click **Side A takes the pot** (or enter scores and **Record result**).
8. On **Pot settled**, see the split. **Rematch 1v1** sends you back to the lobby roster.

### Two real players

Open two browsers (or a private window). Sign in as Alex and Jordan, create a match on one side, join with the invite code on the other.

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
| `/how-it-works` | How skill prize matches work | Mode, equal stake, play, rematch, FAQ |
| `/vs-casino` | Skill matches vs slot sites | Skill + teammates vs slot sites; three-row contrast; create-match CTA |
| `/match/[id]/wager` | Lock your stake | Stake, pot total, play-money balance, confirm, start |
| `/match/[id]/play` | Match live | Score left, pot remaining right (stacked on mobile), declare/score stub, forfeit |
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
| `npm run preview:deploy` | One-command Vercel preview (login + Prisma Postgres once) |
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
