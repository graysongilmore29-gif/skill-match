"use client";

import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";
import { matchAction } from "./useMatch";
import { MatchStatusGuard, MatchViewFrame } from "./MatchStatusGuard";
import { ResultBanner } from "./ResultBanner";
import { PotSplit } from "./PotSplit";
import { RematchSameMode } from "./RematchSameMode";
import { ErrorNote, StatusSteps, useBusy } from "./ui";
import type { MatchDTO } from "@/lib/types";
import type { MatchStatus } from "@/lib/match-rules";

const SETTLED_STATUSES: MatchStatus[] = ["settled", "void"];

export function PayoutView({ matchId }: { matchId: string }) {
  return (
    <MatchViewFrame kicker="Pot settled">
      <MatchStatusGuard matchId={matchId} expect={SETTLED_STATUSES}>
        {({ match, setMatch }) => (
          <PayoutBody match={match} setMatch={setMatch} />
        )}
      </MatchStatusGuard>
    </MatchViewFrame>
  );
}

function PayoutBody({
  match,
  setMatch,
}: {
  match: MatchDTO;
  setMatch: (match: MatchDTO) => void;
}) {
  const router = useRouter();
  const { refresh } = useSession();
  const { busy, error, run } = useBusy();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl uppercase tracking-wide">
        Pot settled
      </h1>
      <StatusSteps current={match.status === "void" ? "settled" : match.status} />
      <ResultBanner match={match} />
      <PotSplit match={match} />
      <RematchSameMode
        mode={match.mode}
        busy={busy}
        onRematch={() =>
          run(async () => {
            const next = await matchAction(match.id, { action: "rematch" });
            setMatch(next);
            await refresh();
            router.push("/");
          })
        }
      />
      <ErrorNote message={error} />
    </div>
  );
}
