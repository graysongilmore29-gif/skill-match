"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatPlayMoney } from "@/lib/money";
import { pathForStatus } from "@/lib/match-rules";
import type { MatchStatus, Mode } from "@/lib/match-rules";
import { useSession } from "./SessionProvider";
import { PUBLIC_NAV } from "./site-nav";
import { Button } from "./ui";

export function AppHeader() {
  const { me, refresh } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    await api("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
  }

  return (
    <header className="border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
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
          <nav aria-label="About" className="flex flex-wrap gap-3 text-sm">
            {PUBLIC_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active ? "text-mint" : "text-ice hover:underline"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {me?.user ? (
          <SignedInTools
            displayName={me.user.displayName}
            balanceCents={me.wallet?.balanceCents ?? 0}
            activeMatch={me.activeMatch}
            onSignOut={signOut}
          />
        ) : null}
      </div>
    </header>
  );
}

function SignedInTools({
  displayName,
  balanceCents,
  activeMatch,
  onSignOut,
}: {
  displayName: string;
  balanceCents: number;
  activeMatch: { id: string; status: MatchStatus; mode: Mode } | null;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="rounded-full border border-line bg-ink-2 px-3 py-1">
        Play money{" "}
        <strong className="text-mint">{formatPlayMoney(balanceCents)}</strong>
      </span>
      {activeMatch ? (
        <Link
          href={pathForStatus(activeMatch.id, activeMatch.status)}
          className="text-ice hover:underline"
        >
          Open {activeMatch.mode}
        </Link>
      ) : null}
      <span className="text-muted">{displayName}</span>
      <Button variant="ghost" onClick={onSignOut}>
        Sign out
      </Button>
    </div>
  );
}
