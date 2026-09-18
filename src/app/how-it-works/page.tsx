import type { Metadata } from "next";
import { ArticleSection, PublicArticle } from "@/components/PublicArticle";

export const metadata: Metadata = {
  title: "How skill prize matches work",
  description:
    "Equal stakes, pot to the winning side. US-first skill-contest prize matches with a simulated play-money wallet in v0.",
};

export default function HowItWorksPage() {
  return (
    <PublicArticle
      kicker="US skill-contest"
      title="How skill prize matches work"
      lede="Team up, lock the same stake, play a skill match, and the winning side takes the pot. v0 is simulated play money until a real-money product is legal to offer."
    >
      <ArticleSection title="Equal stakes, pot to winners">
        <p>
          Every player in a match locks the same stake. That pool is the pot.
          When the match settles, the winning side takes it — split evenly
          among that side. Nobody plays against a house game.
        </p>
        <p>
          Modes are 1v1, 2v2, and 3v3. Fill empty roster slots with friends or
          random players so a match can still start.
        </p>
      </ArticleSection>

      <ArticleSection title="A match, start to finish">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open a roster and pick a mode.</li>
          <li>Invite a friend by code, or fill empty slots.</li>
          <li>Ready up, then lock the same play-money stake.</li>
          <li>
            Start the match. In v0 you record a score or declare a winning
            side — there is no live game engine yet.
          </li>
          <li>The pot moves to the winning side and the match is settled.</li>
        </ol>
      </ArticleSection>

      <ArticleSection title="Simulated play money until legal">
        <p>
          v0 uses a simulated play-money wallet only. There are no real
          payments, processors, or cash-out rails. Real-money prize matches
          stay off until the product can be offered that way for a US
          audience.
        </p>
      </ArticleSection>

      <ArticleSection title="US-first">
        <p>
          Skill Match is framed for a US audience: skill-contest prize
          matches among players, not a casino floor and not a slot site. Copy
          and v0 legal posture follow that line.
        </p>
      </ArticleSection>

      <ArticleSection title="FAQ">
        <dl className="space-y-5">
          <div>
            <dt className="font-semibold text-text">Is this gambling?</dt>
            <dd className="mt-1">
              This product is skill prize matches, not a casino and not a
              slot site. Players lock equal stakes, a skill match decides the
              result, and the winning side takes the pot. There is no house
              game.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-text">Is this real money?</dt>
            <dd className="mt-1">
              Not in v0. Balances are play money so you can walk the lobby,
              stake, and payout flow without real payments.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-text">
              Who decides the winner?
            </dt>
            <dd className="mt-1">
              The match result. In v0 that is a recorded score or a declared
              winning side. A forfeit gives the pot to the other side.
            </dd>
          </div>
        </dl>
      </ArticleSection>
    </PublicArticle>
  );
}
