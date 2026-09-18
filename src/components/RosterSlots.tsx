"use client";

import type { MatchDTO } from "@/lib/types";

export function RosterSlots({ match }: { match: MatchDTO }) {
  const teamA = match.slots.filter((slot) => slot.team === "A");
  const teamB = match.slots.filter((slot) => slot.team === "B");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TeamColumn label="Side A" accent="team-a" slots={teamA} youId={match.you.userId} />
      <TeamColumn label="Side B" accent="team-b" slots={teamB} youId={match.you.userId} />
    </div>
  );
}

function TeamColumn({
  label,
  accent,
  slots,
  youId,
}: {
  label: string;
  accent: "team-a" | "team-b";
  slots: MatchDTO["slots"];
  youId: string;
}) {
  return (
    <div>
      <h3
        className={`mb-2 font-display text-lg uppercase tracking-wide ${
          accent === "team-a" ? "text-team-a" : "text-team-b"
        }`}
      >
        {label}
      </h3>
      <ul className="space-y-2">
        {slots.map((slot) => (
          <li
            key={`${slot.team}-${slot.slot}`}
            className="flex items-center justify-between rounded-xl border border-line bg-ink-2 px-3 py-3"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-muted">
                {slot.team}
                {slot.slot}
              </div>
              <div className="text-sm font-semibold">
                {slot.player
                  ? `${slot.player.displayName}${slot.player.userId === youId ? " · you" : ""}`
                  : "Open slot"}
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                !slot.player
                  ? "bg-white/5 text-muted"
                  : slot.player.stakeLocked
                    ? "bg-mint/15 text-mint"
                    : slot.player.isReady
                      ? "bg-ice/15 text-ice"
                      : "bg-white/5 text-muted"
              }`}
            >
              {!slot.player
                ? "Empty"
                : slot.player.stakeLocked
                  ? "Funded"
                  : slot.player.isReady
                    ? "Ready"
                    : "In"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
