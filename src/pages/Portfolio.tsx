import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { portfolioQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { Reveal } from "@/components/site/Reveal";
import { PORTFOLIO_CATEGORIES } from "@/lib/site-types";

export default function Portfolio() {
  useEffect(() => {
    document.title = "Portfolio — Lara Cinematography";
  }, []);
  const { data } = useSuspenseQuery(portfolioQuery);
  const [cat, setCat] = useState<string>("All");
  const filtered = useMemo(
    () => (cat === "All" ? data : data.filter((f) => f.category === cat)),
    [data, cat],
  );
  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">Portfolio</div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Films that live on long after the day.
          </h1>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {(["All", ...PORTFOLIO_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`border px-5 py-2 text-[0.7rem] uppercase tracking-[0.24em] transition-all ${
                  cat === c ? "border-ink bg-ink text-background" : "border-border text-foreground/70 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-24 text-center text-muted-foreground">No films in this category yet.</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {filtered.map((film, i) => (
                <Reveal key={film.id} delay={(i % 2) * 0.08}>
                  <article>
                    <VideoEmbed
                      youtube={film.youtube_url}
                      vimeo={film.vimeo_url}
                      thumbnail={film.thumbnail_url || film.cover_url}
                      title={film.title}
                    />
                    <div className="mt-5">
                      <div className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">{film.category}</div>
                      <h3 className="mt-2 font-serif text-2xl">{film.title}</h3>
                      {film.description && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{film.description}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}