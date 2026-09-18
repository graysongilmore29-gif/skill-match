"use client";

import { Button } from "./ui";

export function FillRandoms({
  onFill,
  disabled,
  busy,
}: {
  onFill: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-mint/40 bg-mint/5 p-4">
      <p className="font-display text-xl uppercase tracking-wide text-text">
        No friends online
      </p>
      <p className="mt-1 text-sm text-muted">
        Fill randoms to complete the roster and keep the match moving. Random
        players auto-ready and lock simulated stakes with you.
      </p>
      <Button className="mt-4" onClick={onFill} disabled={disabled || busy}>
        {busy ? "Filling…" : "Fill randoms"}
      </Button>
    </div>
  );
}
