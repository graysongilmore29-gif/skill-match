import { MAX_STAKE_CENTS, MIN_STAKE_CENTS } from "./money";

export const MODES = ["1v1", "2v2", "3v3"] as const;
export type Mode = (typeof MODES)[number];

export const STATUSES = [
  "waiting",
  "ready",
  "in_match",
  "settled",
  "void",
] as const;
export type MatchStatus = (typeof STATUSES)[number];

export type TeamId = "A" | "B";

export const FILL_NAMES = [
  "Riley",
  "Quinn",
  "Sage",
  "Rowan",
  "Avery",
  "Cameron",
  "Harper",
  "Drew",
  "Eden",
  "Skyler",
] as const;

export function isMode(value: string): value is Mode {
  return (MODES as readonly string[]).includes(value);
}

export function teamSize(mode: Mode): number {
  return Number(mode[0]);
}

export function rosterSize(mode: Mode): number {
  return teamSize(mode) * 2;
}

export function potCents(stakeCents: number, playerCount: number): number {
  return stakeCents * playerCount;
}

export function splitPot(totalCents: number, winnerCount: number): number[] {
  if (winnerCount <= 0) return [];
  const share = Math.floor(totalCents / winnerCount);
  const remainder = totalCents - share * winnerCount;
  return Array.from({ length: winnerCount }, (_, index) =>
    index === 0 ? share + remainder : share,
  );
}

export function oppositeTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A";
}

export function winnerFromScores(
  teamAScore: number,
  teamBScore: number,
): TeamId | "tie" {
  if (teamAScore === teamBScore) return "tie";
  return teamAScore > teamBScore ? "A" : "B";
}

export function nextOpenSlot(
  occupied: { team: string; slot: number }[],
  mode: Mode,
): { team: TeamId; slot: number } | null {
  const size = teamSize(mode);
  const countA = occupied.filter((seat) => seat.team === "A").length;
  const countB = occupied.filter((seat) => seat.team === "B").length;
  if (countA + countB >= rosterSize(mode)) return null;
  if (countB < countA && countB < size) {
    return { team: "B", slot: countB + 1 };
  }
  if (countA < countB && countA < size) {
    return { team: "A", slot: countA + 1 };
  }
  if (countA < size) return { team: "A", slot: countA + 1 };
  if (countB < size) return { team: "B", slot: countB + 1 };
  return null;
}

export function makeInviteCode(randomBytes: Uint8Array = randomCodeBytes()): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes, (byte) => alphabet[byte % alphabet.length]).join(
    "",
  );
}

function randomCodeBytes(): Uint8Array {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return bytes;
}

export function pathForStatus(matchId: string, status: MatchStatus): string {
  switch (status) {
    case "waiting":
      return "/";
    case "ready":
      return `/match/${matchId}/wager`;
    case "in_match":
      return `/match/${matchId}/play`;
    case "settled":
    case "void":
      return `/match/${matchId}/payout`;
  }
}

export function clampStakeCents(cents: number): number {
  return Math.min(MAX_STAKE_CENTS, Math.max(MIN_STAKE_CENTS, Math.round(cents)));
}
