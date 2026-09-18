"use client";

import { formatPlayMoney } from "@/lib/money";
import type { MatchDTO } from "@/lib/types";

export function PotSplit({ match }: { match: MatchDTO }) {
  const rows = [...match.players].sort((a, b) => {
    if (a.team !== b.team) return a.team.localeCompare(b.team);
    return a.slot - b.slot;
  });
  return (
    <div>
      <h2 className="font-display text-2xl uppercase tracking-wide">Pot split</h2>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {rows.map((player) => (
          <li
            key={player.id}
            className="flex items-center justify-between bg-ink-2 px-4 py-3"
          >
            <div>
              <div className="text-sm font-semibold">
                {player.displayName}
                {player.userId === match.you.userId ? " · you" : ""}
              </div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted">
                Side {player.team}
                {player.team === match.winningTeam ? " · winning side" : ""}
              </div>
            </div>
            <div
              className={`font-display text-xl ${
                (player.payoutCents ?? 0) > 0 ? "text-mint" : "text-muted"
              }`}
            >
              {formatPlayMoney(player.payoutCents ?? 0)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
