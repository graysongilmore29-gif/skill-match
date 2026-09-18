"use client";

import { formatPlayMoney } from "@/lib/money";

export function PotResidual({ potCents }: { potCents: number }) {
  return (
    <div className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">
        Pot remaining
      </div>
      <div className="mt-1 font-display text-3xl uppercase tracking-wide text-text">
        {formatPlayMoney(potCents)}
      </div>
      <p className="mt-1 text-sm text-muted">
        Locked play money. It moves to the winning side when the match settles.
      </p>
    </div>
  );
}
