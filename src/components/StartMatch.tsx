"use client";

import { Button } from "./ui";

export function StartMatch({
  allFunded,
  onStart,
  busy,
}: {
  allFunded: boolean;
  onStart: () => void;
  busy?: boolean;
}) {
  return (
    <Button
      onClick={onStart}
      disabled={!allFunded || busy}
      variant="primary"
      className="w-full"
    >
      {!allFunded
        ? "Start match (both sides must be funded)"
        : busy
          ? "Starting…"
          : "Start match"}
    </Button>
  );
}
