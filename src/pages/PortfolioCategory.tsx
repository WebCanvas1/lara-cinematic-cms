import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  siteBundleQuery,
  portfolioQuery,
  galleryQuery,
} from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { Reveal } from "@/components/site/Reveal";

export default function PortfolioCategory({
  kind,
}: {
  kind: "Photography" | "Videography";
}) {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { data: portfolio } = useSuspenseQuery(portfolioQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const { data: bundle } = useSuspenseQuery(siteBundleQuery);

  const selectedCategory = (bundle.portfolio_categories ?? []).find(
    (category) =>
      category.media_type === kind &&
      category.slug === categorySlug &&
      category.active !== false,
  );

  useEffect(() => {
    document.title = selectedCategory
      ? `${selectedCategory.name} ${kind} — Lara Cinematography`
      : `${kind} — Lara Cinematography`;
  }, [kind, selectedCategory]);

  const categoryBasePath =
    kind === "Photography"
      ? "/portfolio/photography"
      : "/portfolio/videography";

  const photographyItems = selectedCategory
    ? gallery
        .filter((item) => item.category_id === selectedCategory.id)
        .sort(
          (a, b) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
    : [];

  const videographyItems = selectedCategory
    ? portfolio
        .filter(
          (item) =>
            item.category === "Videography" &&
            item.category_id === selectedCategory.id,
        )
        .sort(
          (a, b) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
    : [];

  const hasItems =
    kind === "Photography"
      ? photographyItems.length > 0
      : videographyItems.length > 0;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">{kind}</div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            {selectedCategory?.name ?? "Collection not found"}
          </h1>

          {selectedCategory?.description && (
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
              {selectedCategory.description}
            </p>
          )}

          <div className="mt-8">
            <Link
              to={categoryBasePath}
              className="inline-flex rounded-full border border-ink px-6 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Back to {kind} categories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          {!selectedCategory ? (
            <div className="rounded-3xl border border-border bg-cream/40 px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-ink">
                Category not found
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                This category may have been removed or hidden.
              </p>

              <Link
                to={categoryBasePath}
                className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-[0.7rem] uppercase tracking-[0.22em] text-cream transition-colors hover:bg-gold"
              >
                View all categories
              </Link>
            </div>
          ) : !hasItems ? (
            <div className="rounded-3xl border border-border bg-cream/40 px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-ink">
                No media added yet
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                Photos or videos assigned to this category will appear here.
              </p>
            </div>
          ) : kind === "Videography" ? (
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {videographyItems.map((film, index) => (
                <Reveal
                  key={film.id}
                  delay={(index % 2) * 0.08}
                >
                  <article>
                    <VideoEmbed
                      youtube={film.youtube_url}
                      vimeo={film.vimeo_url}
                      videoUrl={film.video_url}
                      thumbnail={film.thumbnail_url || film.cover_url}
                      title={film.title}
                    />

                    <div className="mt-5">
                      <div className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">
                        {selectedCategory.name}
                      </div>

                      <h2 className="mt-2 font-serif text-2xl text-ink">
                        {film.title}
                      </h2>

                      {film.description && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                          {film.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {photographyItems.map((photo, index) => (
                <Reveal
                  key={photo.id}
                  delay={(index % 3) * 0.05}
                >
                  <article className="group overflow-hidden rounded-3xl bg-mist shadow-sm">
                    <img
                      src={photo.image_url}
                      alt={photo.alt || selectedCategory.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
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
