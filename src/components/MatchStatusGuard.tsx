"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { pathForStatus, type MatchStatus } from "@/lib/match-rules";
import type { MatchDTO } from "@/lib/types";
import { useMatch } from "./useMatch";
import { ErrorNote } from "./ui";

export function MatchStatusGuard({
  matchId,
  expect,
  children,
}: {
  matchId: string;
  expect: MatchStatus | MatchStatus[];
  children: (state: {
    match: MatchDTO;
    setMatch: (match: MatchDTO) => void;
  }) => React.ReactNode;
}) {
  const router = useRouter();
  const { match, error, loading, setMatch } = useMatch(matchId);
  const allowed = useMemo(
    () => (Array.isArray(expect) ? expect : [expect]),
    [expect],
  );

  useEffect(() => {
    if (!match) return;
    if (!allowed.includes(match.status)) {
      router.replace(pathForStatus(match.id, match.status));
    }
  }, [allowed, match, router]);

  if (loading) {
    return <p className="text-sm text-muted">Loading match…</p>;
  }
  if (error) return <ErrorNote message={error} />;
  if (!match || !allowed.includes(match.status)) return null;
  return <>{children({ match, setMatch })}</>;
}

export function MatchViewFrame({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">
        {kicker}
      </p>
      {children}
    </div>
  );
}
