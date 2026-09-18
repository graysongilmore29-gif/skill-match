"use client";

import { centsToDollarInput } from "@/lib/money";
import { Field, TextInput } from "./ui";

export function StakeInput({
  stakeCents,
  frozen,
  onCommit,
}: {
  stakeCents: number;
  frozen: boolean;
  onCommit: (cents: number) => void;
}) {
  return (
    <Field label="Stake per player (play money)">
      <TextInput
        type="number"
        min={1}
        step="0.01"
        defaultValue={centsToDollarInput(stakeCents)}
        key={stakeCents}
        disabled={frozen}
        onBlur={(event) => {
          const cents = Math.round(Number.parseFloat(event.target.value) * 100);
          if (Number.isFinite(cents) && cents !== stakeCents) onCommit(cents);
        }}
      />
      {frozen ? (
        <p className="text-xs text-muted">Stake is frozen after the first lock.</p>
      ) : null}
    </Field>
  );
}
