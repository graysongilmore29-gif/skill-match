"use client";

import { Button } from "./ui";
import type { Mode } from "@/lib/match-rules";

export function CreateMatch({
  mode,
  onCreate,
  disabled,
  busy,
}: {
  mode: Mode;
  onCreate: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Button onClick={onCreate} disabled={disabled || busy} className="w-full sm:w-auto">
      {busy ? "Creating…" : `Create ${mode} match`}
    </Button>
  );
}
