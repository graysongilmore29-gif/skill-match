import type { Metadata } from "next";
import { ArticleSection, PublicArticle } from "@/components/PublicArticle";

export const metadata: Metadata = {
  title: "How skill prize matches work",
  description:
    "Pick a mode, lock the same stake, play, winners take the pot. US-first skill-contest prize matches with simulated play money in v0.",
};

export default function HowItWorksPage() {
  return (
    <PublicArticle
      kicker="US skill-contest"
      title="How skill prize matches work"
      lede="Equal stakes, pot to the winning side. Friends or fill randoms. v0 is simulated play money until a real-money product is legal to offer."
    >
      <ArticleSection title="Pick a mode">
        <p>
          Open a 1v1, 2v2, or 3v3 match. Invite friends with a code, or fill
          empty roster slots with randoms so the match can still start.
        </p>
      </ArticleSection>

      <ArticleSection title="Lock the same stake">
        <p>
          Every player locks the same stake. The pot is stake × players. The
          match starts when everyone is funded and ready.
        </p>
      </ArticleSection>

      <ArticleSection title="Play">
        <p>
          The winning side takes the pot, split evenly among that side. Forfeit
          loses your stake — the other side takes the pot. In v0 you enter a
          result; there is no live game engine yet.
        </p>
      </ArticleSection>

      <ArticleSection title="Rematch one tap">
        <p>
          After the pot settles, rematch in the same mode with one tap. Same
          friends, same format, new pot.
        </p>
      </ArticleSection>

      <ArticleSection title="FAQ">
        <dl className="space-y-5">
          <div>
            <dt className="font-semibold text-text">Is this gambling?</dt>
            <dd className="mt-1">
              US-first skill-contest prize matches: equal stakes, no house
              games, no slots. v0 is simulated play money only; real money
              later after legal.
            </dd>
          </div>
        </dl>
      </ArticleSection>
    </PublicArticle>
  );
}
