"use client";

import { useCallback, useState } from "react";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "teamA" | "teamB";
}) {
  const styles: Record<string, string> = {
    primary:
      "bg-mint text-ink hover:bg-mint/90 shadow-[0_0_0_1px_rgba(62,224,183,0.3)]",
    secondary:
      "bg-panel text-text border border-line hover:border-ice/40 hover:bg-ink-2",
    danger: "bg-coral/15 text-coral border border-coral/40 hover:bg-coral/25",
    ghost: "bg-transparent text-muted hover:text-text hover:bg-white/5",
    teamA: "bg-team-a text-ink hover:bg-team-a/90",
    teamB: "bg-team-b text-ink hover:bg-team-b/90",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-panel/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-text outline-none ring-mint/40 placeholder:text-muted/70 focus:border-mint focus:ring-2 ${props.className ?? ""}`}
    />
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral"
    >
      {message}
    </p>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <h2 className="font-display text-2xl uppercase tracking-wide text-text">
          {title}
        </h2>
        <div className="mt-4 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function StatusSteps({ current }: { current: string }) {
  const steps = [
    { id: "waiting", label: "Roster" },
    { id: "ready", label: "Stake" },
    { id: "in_match", label: "Live" },
    { id: "settled", label: "Settled" },
  ];
  const activeIndex =
    current === "void"
      ? steps.length - 1
      : Math.max(
          0,
          steps.findIndex((step) => step.id === current),
        );
  return (
    <ol className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={`rounded-full px-3 py-1 ${
            index <= activeIndex
              ? "bg-mint/15 text-mint"
              : "bg-ink-2 text-muted"
          }`}
        >
          {step.label}
        </li>
      ))}
    </ol>
  );
}

export function useBusy() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, error, setError, run };
}
