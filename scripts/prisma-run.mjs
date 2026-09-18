/**
 * Run Prisma CLI against SQLite (local default) or PostgreSQL (Vercel / hosted).
 * The committed schema stays sqlite; a temp copy is used when DATABASE_URL is Postgres.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(root, "prisma", "schema.prisma");
const prismaBin = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);

function loadDotEnv() {
  const envFile = join(root, ".env");
  if (!existsSync(envFile)) return;
  for (const raw of readFileSync(envFile, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const SQLITE_DEFAULT = "file:./dev.db";
const AUTH_DEFAULT = "dev-skill-match-secret-change-me";

function firstEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function resolveDatabaseUrl() {
  return (
    firstEnv(
      "DATABASE_URL",
      "POSTGRES_PRISMA_URL",
      "PRISMA_DATABASE_URL",
      "POSTGRES_URL",
    ) ?? SQLITE_DEFAULT
  );
}

function isPostgresUrl(url) {
  return /^(prisma\+)?postgres(ql)?:\/\//i.test(url);
}

function schemaFor(url) {
  if (!isPostgresUrl(url)) return schemaPath;
  const original = readFileSync(schemaPath, "utf8");
  if (!original.includes('provider = "sqlite"')) {
    throw new Error("prisma/schema.prisma is missing sqlite provider to swap");
  }
  const generated = original.replace(
    'provider = "sqlite"',
    'provider = "postgresql"',
  );
  const dest = join(root, "prisma", "schema.generated.prisma");
  writeFileSync(dest, generated);
  return dest;
}

function runPrisma(args, url) {
  const schema = schemaFor(url);
  const extra = schema === schemaPath ? [] : ["--schema", schema];
  const env = {
    ...process.env,
    DATABASE_URL: url,
    AUTH_SECRET: firstEnv("AUTH_SECRET") ?? AUTH_DEFAULT,
  };
  const fullArgs = [...args, ...extra];
  const result = existsSync(prismaBin)
    ? spawnSync(prismaBin, fullArgs, {
        cwd: root,
        stdio: "inherit",
        env,
        shell: process.platform === "win32",
      })
    : spawnSync("npx", ["prisma", ...fullArgs], {
        cwd: root,
        stdio: "inherit",
        env,
        shell: true,
      });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const command = process.argv[2];
const url = resolveDatabaseUrl();
const postgres = isPostgresUrl(url);

if (command === "print") {
  console.log(JSON.stringify({ urlKind: postgres ? "postgres" : "sqlite" }));
  process.exit(0);
}

if (!command) {
  fail("Usage: node scripts/prisma-run.mjs <generate|push|seed|setup|build>");
}

if (command === "generate") {
  runPrisma(["generate"], url);
  process.exit(0);
}

if (command === "push") {
  runPrisma(["db", "push"], url);
  process.exit(0);
}

if (command === "seed") {
  runPrisma(["db", "seed"], url);
  process.exit(0);
}

if (command === "setup") {
  runPrisma(["generate"], url);
  runPrisma(["db", "push"], url);
  runPrisma(["db", "seed"], url);
  process.exit(0);
}

if (command === "build") {
  if (process.env.VERCEL) {
    if (!postgres) {
      fail(`Vercel preview needs a hosted Postgres URL (SQLite is local-only).

From the repo (after Vercel login): npm run preview:deploy

Or in the dashboard:
  1. Open the project → Storage
  2. Create Database → Prisma Postgres (hobby is fine)
  3. Connect Production and Preview (sets DATABASE_URL)
  4. Redeploy

The README Deploy button also offers Prisma Postgres during setup.

Local SQLite: npm run setup && npm run dev`);
    }
    runPrisma(["generate"], url);
    runPrisma(["db", "push"], url);
    runPrisma(["db", "seed"], url);
    process.exit(0);
  }
  runPrisma(["generate"], url);
  process.exit(0);
}

fail(`Unknown command: ${command}`);
