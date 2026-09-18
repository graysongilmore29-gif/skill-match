import { Suspense } from "react";
import type { Metadata } from "next";
import { Lobby } from "@/components/Lobby";

export const metadata: Metadata = {
  title: "Skill cash matches with friends",
};

export default function HomePage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-muted">Loading lobby…</p>}>
      <Lobby />
    </Suspense>
  );
}
