import type { Metadata } from "next";
import Link from "next/link";
import { PublicArticle } from "@/components/PublicArticle";

export const metadata: Metadata = {
  title: "Skill matches vs slot sites",
  description:
    "Skill prize matches with teammates versus slot sites. Skill outcome, friends, pot to winners — not random spins, not a solo house game.",
};

export default function VsCasinoPage() {
  return (
    <PublicArticle
      kicker="Skill contest, not slots"
      title="Skill and teammates — not slots"
      lede="Skill Match is a prize match with people on your side. Slot sites are a different product. This page names that contrast; the chrome stays mint and ice."
    >
      <div className="overflow-x-auto rounded-2xl border border-line bg-panel/80">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="sr-only">
            Skill prize matches compared with slot sites
          </caption>
          <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold"> </th>
              <th className="px-4 py-3 font-semibold text-mint">Skill Match</th>
              <th className="px-4 py-3 font-semibold">Slot sites</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            <tr className="border-b border-line/70">
              <th className="px-4 py-3 font-semibold text-text">Outcome</th>
              <td className="px-4 py-3">Skill match result</td>
              <td className="px-4 py-3">Random spins</td>
            </tr>
            <tr className="border-b border-line/70">
              <th className="px-4 py-3 font-semibold text-text">Who you play with</th>
              <td className="px-4 py-3">Friends and teammates</td>
              <td className="px-4 py-3">Solo casino</td>
            </tr>
            <tr>
              <th className="px-4 py-3 font-semibold text-text">The pool</th>
              <td className="px-4 py-3">Pot to winners</td>
              <td className="px-4 py-3">House edge</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-mint px-4 py-2.5 text-sm font-semibold tracking-wide text-ink shadow-[0_0_0_1px_rgba(62,224,183,0.3)] hover:bg-mint/90"
        >
          Create a match
        </Link>
      </p>
    </PublicArticle>
  );
}
