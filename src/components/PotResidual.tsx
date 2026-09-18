"use client";

import { formatPlayMoney } from "@/lib/money";

export function PotResidual({ potCents }: { potCents: number }) {
  return (
    <div className="rounded-2xl border border-mint/30 bg-mint/10 px-3 py-4 sm:px-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mint sm:text-xs">
        Pot remaining
      </div>
      <div className="mt-1 font-display text-2xl uppercase tracking-wide text-text sm:text-3xl">
        {formatPlayMoney(potCents)}
      </div>
      <p className="mt-1 text-xs text-muted sm:text-sm">
        Locked play money. It moves to the winning side when the match settles.
      </p>
    </div>
  );
}
