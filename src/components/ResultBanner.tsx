"use client";

import type { MatchDTO } from "@/lib/types";

export function ResultBanner({ match }: { match: MatchDTO }) {
  if (match.status === "void") {
    return (
      <div className="rounded-2xl border border-line bg-ink-2 p-5">
        <p className="font-display text-3xl uppercase tracking-wide">Match voided</p>
        <p className="mt-1 text-sm text-muted">
          {match.voidReason || "This match did not settle a pot."}
        </p>
      </div>
    );
  }
  const youWon = match.you.team && match.you.team === match.winningTeam;
  return (
    <div
      className={`rounded-2xl border p-5 ${
        youWon
          ? "border-mint/50 bg-mint/10"
          : "border-line bg-ink-2"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {match.mode} · pot settled
      </p>
      <p className="mt-2 font-display text-4xl uppercase tracking-wide">
        Side {match.winningTeam} takes the pot
      </p>
      <p className="mt-1 text-sm text-muted">
        {youWon
          ? "Your side won. Play-money winnings are in your wallet."
          : "Your side did not take the pot this time."}
        {match.forfeitedById ? " Settled by forfeit." : ""}
        {match.teamAScore != null && match.teamBScore != null
          ? ` Final ${match.teamAScore}–${match.teamBScore}.`
          : ""}
      </p>
    </div>
  );
}
