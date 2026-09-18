import Link from "next/link";
import { PUBLIC_NAV } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
      <nav
        aria-label="Site"
        className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
      >
        <Link href="/" className="text-ice hover:underline">
          Lobby
        </Link>
        {PUBLIC_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-ice hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <p>
        v0 uses a simulated play-money wallet only. No real payments. Skill
        contest prize matches — winners take the pot.
      </p>
    </footer>
  );
}
