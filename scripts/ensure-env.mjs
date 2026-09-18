import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dest = resolve(process.cwd(), ".env");
const example = resolve(process.cwd(), ".env.example");

if (existsSync(dest)) {
  console.log(".env already exists");
  process.exit(0);
}

if (!existsSync(example)) {
  console.error("Missing .env.example");
  process.exit(1);
}

copyFileSync(example, dest);
console.log("Wrote .env from .env.example (local SQLite play-money demo)");
