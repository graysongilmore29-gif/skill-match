"use client";

import { useRouter } from "next/navigation";
import { pathForStatus } from "@/lib/match-rules";
import { matchAction } from "./useMatch";
import { MatchStatusGuard, MatchViewFrame } from "./MatchStatusGuard";
import { Scoreboard } from "./Scoreboard";
import { PotResidual } from "./PotResidual";
import { Forfeit } from "./Forfeit";
import { ErrorNote, StatusSteps, useBusy } from "./ui";
import type { MatchDTO } from "@/lib/types";

export function PlayView({ matchId }: { matchId: string }) {
  return (
    <MatchViewFrame kicker="Match live">
      <MatchStatusGuard matchId={matchId} expect="in_match">
        {({ match, setMatch }) => <PlayBody match={match} setMatch={setMatch} />}
      </MatchStatusGuard>
    </MatchViewFrame>
  );
}

function PlayBody({
  match,
  setMatch,
}: {
  match: MatchDTO;
  setMatch: (match: MatchDTO) => void;
}) {
  const router = useRouter();
  const { busy, error, run } = useBusy();

  function go(next: MatchDTO) {
    setMatch(next);
    if (next.status !== "in_match") {
      router.push(pathForStatus(next.id, next.status));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl uppercase tracking-wide">
            Match live
          </h1>
          <p className="mt-2 text-sm text-muted">
            {match.mode} skill contest. Enter a result or declare the winning
            side — no live game engine in v0.
          </p>
        </div>
        <Forfeit
          busy={busy}
          onForfeit={() =>
            run(async () => {
              go(await matchAction(match.id, { action: "forfeit" }));
            })
          }
        />
      </div>
      <StatusSteps current={match.status} />
      <PotResidual potCents={match.potCents} />
      <Scoreboard
        match={match}
        busy={busy}
        onScore={(teamAScore, teamBScore) =>
          run(async () => {
            go(
              await matchAction(match.id, {
                action: "score",
                teamAScore,
                teamBScore,
              }),
            );
          })
        }
        onDeclare={(team) =>
          run(async () => {
            go(await matchAction(match.id, { action: "declare", team }));
          })
        }
      />
      <ErrorNote message={error} />
    </div>
  );
}
