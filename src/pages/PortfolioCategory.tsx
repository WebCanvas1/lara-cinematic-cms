import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { siteBundleQuery, portfolioQuery, galleryQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { Reveal } from "@/components/site/Reveal";
import { GalleryPreview } from "@/components/site/sections/GalleryPreview";
import { FeaturedFilms } from "@/components/site/sections/FeaturedFilms";

const LEGACY_VIDEO = new Set(["Weddings", "Engagements", "Events", "Commercial", "Reels", "Videography", "Video", ""]);
function normaliseCat(c: string): "Photography" | "Videography" {
  return c === "Photography" ? "Photography" : (LEGACY_VIDEO.has(c) ? "Videography" : "Videography");
}

export default function PortfolioCategory({ kind }: { kind: "Photography" | "Videography" }) {
  useEffect(() => {
    document.title = `${kind} — Lara Cinematography`;
  }, [kind]);
  const { data: portfolio } = useSuspenseQuery(portfolioQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const { data: bundle } = useSuspenseQuery(siteBundleQuery);
  const items = portfolio.filter((p) => normaliseCat(p.category) === kind);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">{kind}</div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            {kind === "Photography"
              ? "Frames from a life in cinema."
              : "Films that live on long after the day."}
          </h1>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No {kind.toLowerCase()} items yet.</p>
          ) : kind === "Videography" ? (
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {items.map((film, i) => (
                <Reveal key={film.id} delay={(i % 2) * 0.08}>
                  <article>
                    <VideoEmbed
                      youtube={film.youtube_url}
                      vimeo={film.vimeo_url}
                      thumbnail={film.thumbnail_url || film.cover_url}
                      title={film.title}
                    />
                    <div className="mt-5">
                      <div className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">Videography</div>
                      <h3 className="mt-2 font-serif text-2xl">{film.title}</h3>
                      {film.description && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{film.description}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.05}>
                  <article className="group overflow-hidden rounded-2xl bg-mist shadow-sm">
                    {(p.cover_url || p.thumbnail_url) && (
                      <img
                        src={p.cover_url || p.thumbnail_url || ""}
                        alt={p.title}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="font-serif text-xl text-ink">{p.title}</h3>
                      {p.description && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.description}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {kind === "Videography" ? (
        <FeaturedFilms
          films={bundle.featured_portfolio.filter((p) => normaliseCat(p.category) === "Videography")}
          showAllLink={false}
          eyebrowDefault="Featured"
          titleDefault="Featured Films"
        />
      ) : (
        <GalleryPreview
          items={gallery}
          showEnterLink={false}
          eyebrowDefault="Gallery"
          titleDefault="From the Gallery"
        />
      )}
    </SiteLayout>
  );
}