import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dest = resolve(process.cwd(), ".env");
if (existsSync(dest)) {
  console.log(".env already exists");
  process.exit(0);
}

writeFileSync(
  dest,
  `DATABASE_URL="file:./dev.db"
AUTH_SECRET="dev-skill-match-secret-change-me"
`,
);
console.log("Wrote .env for local SQLite");
