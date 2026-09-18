"use client";

import { Button } from "./ui";

export function ReadyButton({
  rosterFull,
  isReady,
  onReady,
  busy,
}: {
  rosterFull: boolean;
  isReady: boolean;
  onReady: () => void;
  busy?: boolean;
}) {
  return (
    <Button onClick={onReady} disabled={!rosterFull || isReady || busy} className="w-full">
      {!rosterFull
        ? "Ready (full roster required)"
        : isReady
          ? "You're ready"
          : busy
            ? "Readying…"
            : "Ready"}
    </Button>
  );
}
