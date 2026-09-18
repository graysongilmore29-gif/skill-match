/**
 * One-command Vercel preview (simulated play money only).
 * Needs Grayson’s Vercel login once — this repo has no VERCEL_TOKEN.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vercel = ["--yes", "vercel@latest"];

const ONCE = `No Vercel session in this environment (login_required / no VERCEL_TOKEN).
This script cannot print a live *.vercel.app URL until Grayson (or the owning agent) logs in once.

Finish these clicks once, then re-run: npm run preview:deploy

1. Open https://vercel.com/login and sign in with GitHub as the owner of graysongilmore29-gif/skill-match.
2. In this repo: npx vercel login — complete the GitHub / email browser prompt.
3. Re-run npm run preview:deploy (attaches Prisma Postgres, deploys, prints the URL).
4. If the site asks for a Vercel password: project Settings → Deployment Protection → Standard Protection → Off.
5. Paste the https://*.vercel.app URL into README.md under Live preview and push.

Dashboard equivalent (still once):
  https://vercel.com/new → Import **skill-match** (this GitHub repo, not a second clone)
  → Deploy (first build may fail without Postgres — expected)
  → Storage → Create Database → Prisma Postgres (hobby) → Connect Production and Preview
  → Deployments → Redeploy
  → paste the URL into README Live preview.

Play money only. No Stripe, cash-out, or processors.`;

function capture(args) {
  const result = spawnSync("npx", [...vercel, ...args], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    shell: process.platform === "win32",
  });
  return {
    status: result.status ?? 1,
    out: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
  };
}

function run(args, { allowFail = false } = {}) {
  const result = spawnSync("npx", [...vercel, ...args], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  const status = result.status ?? 1;
  if (!allowFail && status !== 0) process.exit(status);
  return status;
}

function loggedIn(who) {
  if (/login_required|not authenticated|please log in/i.test(who.out)) return false;
  if (/"loggedIn"\s*:\s*false/i.test(who.out)) return false;
  return who.status === 0;
}

const who = capture(["whoami"]);
if (!loggedIn(who)) {
  console.error(who.out.trim());
  console.error(`\n${ONCE}`);
  process.exit(1);
}

console.log("Vercel session found. Creating/linking the project (first build may fail until Postgres is attached)…");
run(["--yes"], { allowFail: true });

console.log("Attaching Prisma Postgres to Production + Preview (sets DATABASE_URL)…");
run(
  [
    "integration",
    "add",
    "prisma",
    "--name",
    "skill-match-play-money",
    "-m",
    "region=iad1",
    "-e",
    "production",
    "-e",
    "preview",
    "--non-interactive",
  ],
  { allowFail: true },
);

console.log("Connecting this GitHub repo so later pushes get preview URLs…");
run(["git", "connect"], { allowFail: true });

console.log("Redeploying with the hosted database…");
const deploy = capture(["--yes"]);
process.stdout.write(deploy.out);
if (deploy.status !== 0) {
  console.error(`\nDeploy failed. If the log mentions SQLite, attach Prisma Postgres (README Live preview) and re-run.
${ONCE}`);
  process.exit(deploy.status);
}

const urls = [...deploy.out.matchAll(/https:\/\/[a-z0-9.-]+\.vercel\.app/gi)].map((m) => m[0]);
const unique = [...new Set(urls)];
if (unique.length) {
  console.log(`\nLive preview: ${unique[0]}`);
  console.log("Paste that URL into README.md → Live preview, then commit.");
} else {
  console.log("\nDeploy finished. Copy the *.vercel.app URL from the output above into README.md → Live preview.");
}
