"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatPlayMoney } from "@/lib/money";
import { pathForStatus } from "@/lib/match-rules";
import { useSession } from "./SessionProvider";
import { Button } from "./ui";

export function AppHeader() {
  const { me, refresh } = useSession();
  const router = useRouter();
  if (!me?.user) return null;

  async function signOut() {
    await api("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
  }

  return (
    <header className="border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint font-display text-lg text-ink">
            SM
          </span>
          <span>
            <span className="block font-display text-lg uppercase leading-none tracking-wide">
              Skill Match
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
              US skill-contest
            </span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-line bg-ink-2 px-3 py-1">
            Play money{" "}
            <strong className="text-mint">
              {formatPlayMoney(me.wallet?.balanceCents ?? 0)}
            </strong>
          </span>
          {me.activeMatch ? (
            <Link
              href={pathForStatus(me.activeMatch.id, me.activeMatch.status)}
              className="text-ice hover:underline"
            >
              Open {me.activeMatch.mode}
            </Link>
          ) : null}
          <span className="text-muted">{me.user.displayName}</span>
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
