"use client";

import { TOP_UP_CENTS, formatPlayMoney } from "@/lib/money";
import { Button } from "./ui";

export function TopUpStub({
  onTopUp,
  busy,
}: {
  onTopUp: () => void;
  busy?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-coral/40 bg-coral/10 p-4">
      <p className="font-display text-xl uppercase tracking-wide text-coral">
        Not enough play money
      </p>
      <p className="mt-1 text-sm text-muted">
        Top up this simulated wallet to lock your stake. This is a stub — no
        real payments.
      </p>
      <Button className="mt-4" onClick={onTopUp} disabled={busy}>
        {busy ? "Adding…" : `Top up ${formatPlayMoney(TOP_UP_CENTS)} play money`}
      </Button>
    </div>
  );
}
