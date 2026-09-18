"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "./SessionProvider";
import { Button, ErrorNote, Field, Panel, TextInput, useBusy } from "./ui";

export function AuthPanel() {
  const { refresh } = useSession();
  const { busy, error, run } = useBusy();
  const [mode, setMode] = useState<"guest" | "login" | "register">("guest");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Panel className="mx-auto max-w-md">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">
        Simulated play-money lobby
      </p>
      <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
        Enter as a player
      </h2>
      <p className="mt-2 text-sm text-muted">
        Guest demo is the fastest path. Email accounts keep the same wallet on
        this machine.
      </p>
      <div className="mt-4 flex gap-2">
        {(["guest", "login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              mode === item ? "bg-mint text-ink" : "bg-ink-2 text-muted"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {mode === "guest" ? (
          <>
            <Field label="Display name (optional)">
              <TextInput
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Alex"
              />
            </Field>
            <Button
              className="w-full"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api("/api/auth/guest", {
                    method: "POST",
                    body: JSON.stringify({ displayName }),
                  });
                  await refresh();
                })
              }
            >
              Continue as guest
            </Button>
          </>
        ) : (
          <>
            {mode === "register" ? (
              <Field label="Display name">
                <TextInput
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
              </Field>
            ) : null}
            <Field label="Email">
              <TextInput
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            <Button
              className="w-full"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(
                    mode === "login" ? "/api/auth/login" : "/api/auth/register",
                    {
                      method: "POST",
                      body: JSON.stringify({ email, password, displayName }),
                    },
                  );
                  await refresh();
                })
              }
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </>
        )}
        <ErrorNote message={error} />
        <p className="text-xs text-muted">
          Demo accounts: alex@demo.local / demo1234 and jordan@demo.local /
          demo1234
        </p>
      </div>
    </Panel>
  );
}
