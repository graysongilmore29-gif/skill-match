"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PUBLIC_NAV } from "./site-nav";
import { api } from "@/lib/api";
import { pathForStatus, type Mode } from "@/lib/match-rules";
import type { MatchDTO } from "@/lib/types";
import { useSession } from "./SessionProvider";
import { matchAction, useMatch } from "./useMatch";
import { AuthPanel } from "./AuthPanel";
import { ModeToggle } from "./ModeToggle";
import { CreateMatch } from "./CreateMatch";
import { JoinByCode } from "./JoinByCode";
import { RosterSlots } from "./RosterSlots";
import { InviteLink } from "./InviteLink";
import { FillRandoms } from "./FillRandoms";
import { ReadyButton } from "./ReadyButton";
import { ErrorNote, Panel, StatusSteps, useBusy } from "./ui";

export function Lobby() {
  const { me, loading, refresh } = useSession();
  const search = useSearchParams();
  const joinCode = search.get("join") ?? "";

  if (loading) {
    return <p className="px-4 py-16 text-center text-muted">Loading lobby…</p>;
  }
  if (!me?.user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Hero />
        <div className="mt-8">
          <AuthPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Hero />
      <LobbyDesk
        activeMatchId={me.activeMatch?.id ?? null}
        activeStatus={me.activeMatch?.status ?? null}
        joinCode={joinCode}
        onAuthRefresh={refresh}
      />
    </div>
  );
}

function Hero() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mint">
        Skill cash matches with friends
      </p>
      <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-wide text-text sm:text-6xl">
        Team up.
        <br />
        Stake the match.
        <br />
        Winners take the pot.
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted">
        US-first skill-contest prize matches. 1v1, 2v2, or 3v3 — friends or
        random fill. v0 uses a simulated play-money wallet only.
      </p>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {PUBLIC_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-ice hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LobbyDesk({
  activeMatchId,
  activeStatus,
  joinCode,
  onAuthRefresh,
}: {
  activeMatchId: string | null;
  activeStatus: string | null;
  joinCode: string;
  onAuthRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("1v1");
  const { busy, error, setError, run } = useBusy();
  const waitingId =
    activeMatchId && activeStatus === "waiting" ? activeMatchId : null;
  const { match, setMatch } = useMatch(waitingId);

  useEffect(() => {
    if (!joinCode || waitingId) return;
    void run(async () => {
      const data = await api<{ match: MatchDTO }>("/api/matches/join", {
        method: "POST",
        body: JSON.stringify({ code: joinCode }),
      });
      setMatch(data.match);
      await onAuthRefresh();
      router.replace("/");
    });
  }, [joinCode, waitingId, onAuthRefresh, router, run, setMatch]);

  useEffect(() => {
    if (match && match.status !== "waiting") {
      router.push(pathForStatus(match.id, match.status));
    }
  }, [match, router]);

  async function create() {
    await run(async () => {
      const data = await api<{ match: MatchDTO }>("/api/matches", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      setMatch(data.match);
      await onAuthRefresh();
    });
  }

  async function join(code: string) {
    await run(async () => {
      const data = await api<{ match: MatchDTO }>("/api/matches/join", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setMatch(data.match);
      await onAuthRefresh();
    });
  }

  if (activeMatchId && activeStatus && activeStatus !== "waiting") {
    return (
      <Panel className="mt-8">
        <StatusSteps current={activeStatus} />
        <p className="mt-4 text-sm text-muted">
          You have a {activeStatus.replace("_", " ")} match in progress.
        </p>
        <button
          className="mt-4 text-ice underline"
          onClick={() =>
            router.push(pathForStatus(activeMatchId, activeStatus as never))
          }
        >
          Continue match
        </button>
      </Panel>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel>
        <h2 className="font-display text-2xl uppercase tracking-wide">
          Open a match
        </h2>
        <div className="mt-4 space-y-4">
          <ModeToggle value={mode} onChange={setMode} disabled={Boolean(match)} />
          <CreateMatch
            mode={mode}
            onCreate={create}
            disabled={Boolean(match)}
            busy={busy}
          />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Or join by code
            </p>
            <JoinByCode onJoin={join} busy={busy} initialCode={joinCode} />
          </div>
          <ErrorNote message={error} />
        </div>
      </Panel>

      <Panel>
        {match ? (
          <div className="space-y-4">
            <StatusSteps current={match.status} />
            <h2 className="font-display text-2xl uppercase tracking-wide">
              {match.mode} roster
            </h2>
            <RosterSlots match={match} />
            <InviteLink code={match.inviteCode} />
            {!match.rosterFull ? (
              <FillRandoms
                onFill={() =>
                  run(async () => {
                    setMatch(await matchAction(match.id, { action: "fill_randoms" }));
                    setError(null);
                  })
                }
                busy={busy}
              />
            ) : (
              <p className="text-sm text-muted">
                Roster is full. Ready up to lock stakes.
              </p>
            )}
            <ReadyButton
              rosterFull={match.rosterFull}
              isReady={match.you.isReady}
              busy={busy}
              onReady={() =>
                run(async () => {
                  const next = await matchAction(match.id, { action: "ready" });
                  setMatch(next);
                  if (next.status !== "waiting") {
                    router.push(pathForStatus(next.id, next.status));
                  }
                })
              }
            />
          </div>
        ) : (
          <div>
            <h2 className="font-display text-2xl uppercase tracking-wide">
              Roster
            </h2>
            <p className="mt-2 text-sm text-muted">
              Create a match or join with a code. Empty slots can be filled by
              friends or randoms.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}
