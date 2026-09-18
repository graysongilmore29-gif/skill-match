"use client";

import { formatPlayMoney } from "@/lib/money";

export function PotTotal({ potCents }: { potCents: number }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Pot total
      </div>
      <div className="mt-1 font-display text-4xl uppercase tracking-wide text-mint">
        {formatPlayMoney(potCents)}
      </div>
      <p className="mt-1 text-sm text-muted">
        Play money. Winning side takes the full pot, split evenly.
      </p>
    </div>
  );
}
