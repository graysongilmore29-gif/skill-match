const SQLITE_DEFAULT = "file:./dev.db";
const AUTH_DEFAULT = "dev-skill-match-secret-change-me";

function firstEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function resolveDatabaseUrl() {
  return (
    firstEnv(
      "DATABASE_URL",
      "POSTGRES_PRISMA_URL",
      "PRISMA_DATABASE_URL",
      "POSTGRES_URL",
    ) ?? SQLITE_DEFAULT
  );
}

export function resolveAuthSecret() {
  return firstEnv("AUTH_SECRET") ?? AUTH_DEFAULT;
}

export function applyEnvDefaults() {
  process.env.DATABASE_URL = resolveDatabaseUrl();
  process.env.AUTH_SECRET = resolveAuthSecret();
}

applyEnvDefaults();
