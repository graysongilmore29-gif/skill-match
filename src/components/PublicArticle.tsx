import Link from "next/link";

export function PublicArticle({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mint">
        {kicker}
      </p>
      <h1 className="mt-3 font-display text-5xl uppercase leading-[0.95] tracking-wide text-text sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted">{lede}</p>
      <div className="mt-10 space-y-10">{children}</div>
      <p className="mt-12 text-sm">
        <Link href="/" className="text-ice hover:underline">
          Back to lobby
        </Link>
      </p>
    </article>
  );
}

export function ArticleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl uppercase tracking-wide text-text">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-6 text-muted">{children}</div>
    </section>
  );
}
