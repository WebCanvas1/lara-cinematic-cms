import { Reveal } from "../Reveal";
import { VideoEmbed } from "../VideoEmbed";
import { Link } from "@tanstack/react-router";
import type { PortfolioItem, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function FeaturedFilms({ films, heading }: { films: PortfolioItem[]; heading?: HeadingConfig }) {
  if (!films.length) return null;
  const h = mergeHeading(heading, {
    eyebrow: "Featured Films",
    title: "Stories told frame by frame.",
    align: "left",
  });
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className={h.wrapperCls} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && (
              <h2 className="max-w-2xl font-serif text-4xl leading-tight md:text-5xl" style={h.titleStyle}>{h.title}</h2>
            )}
            {h.showSubtitle && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
          <Link
            to="/portfolio"
            className="text-[0.72rem] uppercase tracking-[0.28em] text-ink underline-offset-8 hover:underline"
          >
            View all films →
          </Link>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {films.slice(0, 4).map((film, i) => (
            <Reveal key={film.id} delay={i * 0.08}>
              <article className="group">
                <VideoEmbed
                  youtube={film.youtube_url}
                  vimeo={film.vimeo_url}
                  thumbnail={film.thumbnail_url || film.cover_url}
                  title={film.title}
                />
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">{film.category}</div>
                    <h3 className="mt-2 font-serif text-2xl">{film.title}</h3>
                    {film.description && (
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/70">
                        {film.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}