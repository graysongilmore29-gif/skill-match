"use client";

import { useState } from "react";
import type { MatchDTO } from "@/lib/types";
import { Button, Field, TextInput } from "./ui";

export function Scoreboard({
  match,
  onScore,
  onDeclare,
  busy,
}: {
  match: MatchDTO;
  onScore: (teamAScore: number, teamBScore: number) => void;
  onDeclare: (team: "A" | "B") => void;
  busy?: boolean;
}) {
  const [teamA, setTeamA] = useState(String(match.teamAScore ?? 0));
  const [teamB, setTeamB] = useState(String(match.teamBScore ?? 0));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-team-a/40 bg-team-a/10 p-4 text-center">
          <div className="text-xs uppercase tracking-[0.16em] text-team-a">Side A</div>
          <div className="font-display text-5xl">{match.teamAScore ?? "–"}</div>
          <p className="mt-2 text-xs text-muted">
            {match.players
              .filter((player) => player.team === "A")
              .map((player) => player.displayName)
              .join(", ")}
          </p>
        </div>
        <div className="rounded-2xl border border-team-b/40 bg-team-b/10 p-4 text-center">
          <div className="text-xs uppercase tracking-[0.16em] text-team-b">Side B</div>
          <div className="font-display text-5xl">{match.teamBScore ?? "–"}</div>
          <p className="mt-2 text-xs text-muted">
            {match.players
              .filter((player) => player.team === "B")
              .map((player) => player.displayName)
              .join(", ")}
          </p>
        </div>
      </div>

      <form
        className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onScore(Number.parseInt(teamA, 10), Number.parseInt(teamB, 10));
        }}
      >
        <Field label="Side A score">
          <TextInput
            type="number"
            min={0}
            value={teamA}
            onChange={(event) => setTeamA(event.target.value)}
          />
        </Field>
        <Field label="Side B score">
          <TextInput
            type="number"
            min={0}
            value={teamB}
            onChange={(event) => setTeamB(event.target.value)}
          />
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={busy} className="w-full">
            Record result
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="teamA" className="flex-1" disabled={busy} onClick={() => onDeclare("A")}>
          Side A takes the pot
        </Button>
        <Button variant="teamB" className="flex-1" disabled={busy} onClick={() => onDeclare("B")}>
          Side B takes the pot
        </Button>
      </div>
    </div>
  );
}
