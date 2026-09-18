# Skill Match

US-first skill-contest prize matches. Team up, stake the match, winners take the pot.

v0 uses a **simulated play-money wallet only**. There are no real payments, processors, or crypto rails. The UI is a skill-contest lobby — not a casino.

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
| `/match/[id]/wager` | Lock your stake | Stake, pot total, play-money balance, confirm, start |
| `/match/[id]/play` | Match live | Scoreboard, remaining pot, forfeit |
| `/match/[id]/payout` | Pot settled | Result, pot split, rematch |

## Run locally

You need Node.js 22+ (this repo was built with Node 22).

```bash
npm install
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run setup` writes a local `.env`, generates the Prisma client, pushes a SQLite schema (`prisma/dev.db`), and seeds two demo players:

- `alex@demo.local` / `demo1234`
- `jordan@demo.local` / `demo1234`

Each new account (including guest demo) starts with **$250.00 play money**.

### Fastest click-through (one browser)

1. Continue as guest
2. Leave mode on **1v1** and create a match
3. **Fill randoms** (empty-friends state)
4. **Ready**
5. Confirm the stake, then **Start match**
6. Record a score or tap a side to take the pot
7. See the split, then **Rematch 1v1**

### Two real players

Open two browsers (or a private window). Sign in as Alex and Jordan, create a match on one side, join with the invite code on the other.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run setup` | `.env` + SQLite + seed |
| `npm run dev` | Next.js dev server |
| `npm run test` | Pure match-rule tests |
| `npm run e2e:api` | API happy-path against a running server |
| `npm run build` / `npm start` | Production build |

## Stack

Next.js App Router (TypeScript) + Prisma + SQLite. That is the first-run default so you do not need Docker.

To point at Postgres later, change `DATABASE_URL` and the Prisma `provider`, then run `npm run db:setup` again.

## Out of scope (v0)

Real money, KYC, live game clients, voice, and admin tools.
