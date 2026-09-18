"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { pathForStatus } from "@/lib/match-rules";
import { useSession } from "./SessionProvider";
import { matchAction } from "./useMatch";
import { MatchStatusGuard, MatchViewFrame } from "./MatchStatusGuard";
import { StakeInput } from "./StakeInput";
import { PotTotal } from "./PotTotal";
import { Balance } from "./Balance";
import { ConfirmStake } from "./ConfirmStake";
import { StartMatch } from "./StartMatch";
import { TopUpStub } from "./TopUpStub";
import { RosterSlots } from "./RosterSlots";
import { ErrorNote, StatusSteps, useBusy } from "./ui";
import type { MeDTO } from "@/lib/types";

export function WagerView({ matchId }: { matchId: string }) {
  const { me, refresh } = useSession();
  return (
    <MatchViewFrame kicker="Lock your stake">
      <MatchStatusGuard matchId={matchId} expect="ready">
        {({ match, setMatch }) => (
          <WagerBody
            match={match}
            setMatch={setMatch}
            me={me}
            refresh={refresh}
          />
        )}
      </MatchStatusGuard>
    </MatchViewFrame>
  );
}

function WagerBody({
  match,
  setMatch,
  me,
  refresh,
}: {
  match: import("@/lib/types").MatchDTO;
  setMatch: (match: import("@/lib/types").MatchDTO) => void;
  me: MeDTO | null;
  refresh: () => Promise<void>;
}) {
  const router = useRouter();
  const { busy, error, run } = useBusy();
  const balance = me?.wallet?.balanceCents ?? 0;
  const insufficient = !match.you.stakeLocked && balance < match.stakeCents;
  const frozen = match.players.some((player) => player.stakeLocked);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
          Lock your stake
        </h1>
        <p className="mt-2 text-sm text-muted">
          Same stake for every player. Winning side takes the pot.
        </p>
      </div>
      <StatusSteps current={match.status} />
      <div className="grid gap-4 md:grid-cols-2">
        <PotTotal potCents={match.potCents} />
        <Balance balanceCents={balance} insufficient={insufficient} />
      </div>
      <StakeInput
        stakeCents={match.stakeCents}
        frozen={frozen}
        onCommit={(cents) =>
          run(async () => {
            setMatch(
              await matchAction(match.id, { action: "set_stake", stakeCents: cents }),
            );
          })
        }
      />
      {insufficient ? (
        <TopUpStub
          busy={busy}
          onTopUp={() =>
            run(async () => {
              await api("/api/wallet/topup", { method: "POST" });
              await refresh();
            })
          }
        />
      ) : (
        <ConfirmStake
          stakeCents={match.stakeCents}
          locked={match.you.stakeLocked}
          busy={busy}
          onConfirm={() =>
            run(async () => {
              setMatch(await matchAction(match.id, { action: "confirm_stake" }));
              await refresh();
            })
          }
        />
      )}
      {match.you.stakeLocked ? (
        <StartMatch
          allFunded={match.allFunded}
          busy={busy}
          onStart={() =>
            run(async () => {
              const next = await matchAction(match.id, { action: "start" });
              setMatch(next);
              router.push(pathForStatus(next.id, next.status));
            })
          }
        />
      ) : null}
      <RosterSlots match={match} />
      <ErrorNote message={error} />
    </div>
  );
}
