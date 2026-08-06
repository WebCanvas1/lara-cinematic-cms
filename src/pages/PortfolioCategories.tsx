import { Link } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import type { PortfolioCategory } from "@/lib/site-types";

export default function PortfolioCategories({
  kind,
}: {
  kind: PortfolioCategory;
}) {
  const { data: bundle } = useSuspenseQuery(siteBundleQuery);

  useEffect(() => {
    document.title = `${kind} — Lara Cinematography`;
  }, [kind]);

  const categories = (bundle.portfolio_categories ?? [])
    .filter(
      (category) =>
        category.media_type === kind &&
        category.active !== false,
    )
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

  const basePath =
    kind === "Photography"
      ? "/portfolio/photography"
      : "/portfolio/videography";

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">{kind}</div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            {kind === "Photography"
              ? "Explore stories captured in still frames."
              : "Explore films crafted for every kind of celebration."}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
            Choose a category to explore the full collection.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          {categories.length === 0 ? (
            <div className="rounded-3xl border border-border bg-cream/40 px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-ink">
                No categories available yet
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                Categories added through the admin panel will appear here.
              </p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Reveal
                  key={category.id}
                  delay={(index % 4) * 0.06}
                >
                  <Link
                    to={`${basePath}/${category.slug}`}
                    className="group block h-full overflow-hidden rounded-3xl border border-border bg-cream shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="overflow-hidden bg-mist">
                      {category.cover_image ? (
                        <img
                          src={category.cover_image}
                          alt={category.name}
                          loading="lazy"
                          className="block h-auto w-full transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex min-h-48 items-center justify-center bg-mist px-5 text-center">
                          <span className="font-serif text-xl text-foreground/40">
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="text-[0.64rem] uppercase tracking-[0.22em] text-gold">
                        {kind}
                      </div>

                      <h2 className="mt-2 font-serif text-xl text-ink">
                        {category.name}
                      </h2>

                      {category.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                          {category.description}
                        </p>
                      )}

                      <div className="mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-ink transition-colors group-hover:text-gold">
                        View collection
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
