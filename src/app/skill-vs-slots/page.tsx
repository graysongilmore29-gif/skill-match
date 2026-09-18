import type { Metadata } from "next";
import { ArticleSection, PublicArticle } from "@/components/PublicArticle";

export const metadata: Metadata = {
  title: "Skill matches vs slot sites",
  description:
    "Skill prize matches with teammates versus slot sites. Equal stakes, pot to winners — no house games, no spin.",
};

export default function SkillVsSlotsPage() {
  return (
    <PublicArticle
      kicker="Skill contest, not slots"
      title="Skill matches vs slot sites"
      lede="Skill Match is teammates and a match result. Slot sites are solitary reel play. This product does not run house games and does not spin."
    >
      <ArticleSection title="Skill plus teammates">
        <p>
          You pick a side, fill a roster, and play a skill contest with other
          people. Friends can join by code; empty slots can be random fill.
          The result is a match, not a machine outcome.
        </p>
      </ArticleSection>

      <ArticleSection title="What slot sites do instead">
        <p>
          Slot sites put you against a house game. Skill Match does not. There
          is no reel, no spin, and no house game sitting between players and
          the pot. Equal stakes go in; the winning side takes what was locked.
        </p>
      </ArticleSection>

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
              <th className="px-4 py-3 font-semibold text-text">Who you play with</th>
              <td className="px-4 py-3">Teammates and an opposing side</td>
              <td className="px-4 py-3">Usually you, alone</td>
            </tr>
            <tr className="border-b border-line/70">
              <th className="px-4 py-3 font-semibold text-text">What decides it</th>
              <td className="px-4 py-3">Skill match result</td>
              <td className="px-4 py-3">A house game</td>
            </tr>
            <tr className="border-b border-line/70">
              <th className="px-4 py-3 font-semibold text-text">The pool</th>
              <td className="px-4 py-3">Equal stakes; winning side takes the pot</td>
              <td className="px-4 py-3">The site runs its own game</td>
            </tr>
            <tr>
              <th className="px-4 py-3 font-semibold text-text">Spin</th>
              <td className="px-4 py-3">None</td>
              <td className="px-4 py-3">Core loop</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ArticleSection title="Still play money in v0">
        <p>
          The contrast is the product shape, not a cash-out pitch. v0 stays on
          a simulated wallet so the lobby, stake lock, and payout flow can be
          used without real payments.
        </p>
      </ArticleSection>
    </PublicArticle>
  );
}
