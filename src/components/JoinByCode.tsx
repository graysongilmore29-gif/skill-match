"use client";

import { useState } from "react";
import { Button, TextInput } from "./ui";

export function JoinByCode({
  onJoin,
  busy,
  initialCode = "",
}: {
  onJoin: (code: string) => void;
  busy?: boolean;
  initialCode?: string;
}) {
  const [code, setCode] = useState(initialCode);
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onJoin(code);
      }}
    >
      <TextInput
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="Invite code"
        aria-label="Invite code"
        autoComplete="off"
      />
      <Button type="submit" variant="secondary" disabled={busy || code.trim().length < 4}>
        {busy ? "Joining…" : "Join"}
      </Button>
    </form>
  );
}
