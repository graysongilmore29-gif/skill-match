"use client";

import { Button } from "./ui";
import type { Mode } from "@/lib/match-rules";

export function RematchSameMode({
  mode,
  onRematch,
  busy,
}: {
  mode: Mode;
  onRematch: () => void;
  busy?: boolean;
}) {
  return (
    <Button onClick={onRematch} disabled={busy} className="w-full">
      {busy ? "Opening rematch…" : `Rematch ${mode}`}
    </Button>
  );
}
