"use client";

import { formatPlayMoney } from "@/lib/money";

export function Balance({
  balanceCents,
  insufficient,
}: {
  balanceCents: number;
  insufficient?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Play-money balance
      </div>
      <div
        className={`mt-1 font-display text-5xl uppercase leading-none tracking-wide ${
          insufficient ? "text-coral" : "text-text"
        }`}
      >
        {formatPlayMoney(balanceCents)}
      </div>
    </div>
  );
}
