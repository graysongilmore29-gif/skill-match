"use client";

import type { Mode } from "@/lib/match-rules";

const OPTIONS: { id: Mode; label: string; detail: string }[] = [
  { id: "1v1", label: "1v1", detail: "Two sides, one player each" },
  { id: "2v2", label: "2v2", detail: "Two sides of two" },
  { id: "3v3", label: "3v3", detail: "Two sides of three" },
];

export function ModeToggle({
  value,
  onChange,
  disabled,
}: {
  value: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Match mode">
      {OPTIONS.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              active
                ? "border-mint bg-mint/10 shadow-[inset_0_0_0_1px_rgba(62,224,183,0.35)]"
                : "border-line bg-ink-2 hover:border-ice/30"
            } disabled:opacity-40`}
          >
            <div className="font-display text-2xl uppercase tracking-wide">
              {option.label}
            </div>
            <p className="mt-1 text-xs text-muted">{option.detail}</p>
          </button>
        );
      })}
    </div>
  );
}
