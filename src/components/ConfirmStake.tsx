"use client";

import { Button } from "./ui";
import { formatPlayMoney } from "@/lib/money";

export function ConfirmStake({
  stakeCents,
  locked,
  disabled,
  busy,
  onConfirm,
}: {
  stakeCents: number;
  locked: boolean;
  disabled?: boolean;
  busy?: boolean;
  onConfirm: () => void;
}) {
  if (locked) {
    return (
      <p className="rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">
        Your {formatPlayMoney(stakeCents)} stake is locked.
      </p>
    );
  }
  return (
    <Button onClick={onConfirm} disabled={disabled || busy} className="w-full min-h-10">
      {busy ? "Locking…" : `Lock ${formatPlayMoney(stakeCents)} stake`}
    </Button>
  );
}
