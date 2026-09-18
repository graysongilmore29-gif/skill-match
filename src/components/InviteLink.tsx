"use client";

import { useState } from "react";
import { Button } from "./ui";

export function InviteLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const link = `${origin}/?join=${code}`;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <code className="flex-1 truncate rounded-lg border border-line bg-ink px-3 py-2 text-sm text-ice">
        {link || `/?join=${code}`}
      </code>
      <Button type="button" variant="secondary" onClick={copy}>
        {copied ? "Copied" : "Copy invite"}
      </Button>
    </div>
  );
}
