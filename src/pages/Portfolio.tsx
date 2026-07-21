import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { galleryQuery, portfolioQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { Reveal } from "@/components/site/Reveal";

type PortfolioTab = "All" | "Photography" | "Videography";

export default function Portfolio() {
  useEffect(() => {
    document.title = "Portfolio — Lara Cinematography";
  }, []);

  const { data: videos } = useSuspenseQuery(portfolioQuery);
  const { data: photos } = useSuspenseQuery(galleryQuery);

  const [activeTab, setActiveTab] = useState<PortfolioTab>("All");

  const showPhotography =
    activeTab === "All" || activeTab === "Photography";

  const showVideography =
    activeTab === "All" || activeTab === "Videography";

  const activePhotos = photos.filter(
    (photo) => photo.active !== false,
  );

  const activeVideos = videos.filter(
    (video) => video.active !== false,
  );

  const hasVisibleItems =
    (showPhotography && activePhotos.length > 0) ||
    (showVideography && activeVideos.length > 0);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">Portfolio</div>

          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Stories that live on long after the day.
          </h1>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          <div className="mb-14 flex flex-wrap justify-center gap-2">
            {(
              [
                "All",
                "Photography",
                "Videography",
              ] as PortfolioTab[]
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-6 py-2 text-[0.7rem] uppercase tracking-[0.24em] transition-all ${
                  activeTab === tab
                    ? "border-ink bg-ink text-cream"
                    : "border-border text-foreground/70 hover:border-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!hasVisibleItems ? (
            <p className="py-24 text-center text-muted-foreground">
              No portfolio items in this category yet.
            </p>
          ) : (
            <div className="space-y-20">
              {showPhotography && activePhotos.length > 0 && (
                <div>
                  {activeTab === "All" && (
                    <div className="mb-10 text-center">
                      <div className="eyebrow mb-3">
                        Photography
                      </div>

                      <h2 className="font-serif text-3xl text-ink md:text-4xl">
                        Moments preserved with intention.
                      </h2>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activePhotos.map((photo, index) => (
                      <Reveal
                        key={photo.id}
                        delay={(index % 3) * 0.06}
                      >
                        <article className="group overflow-hidden rounded-3xl border border-border bg-card">
                          <div className="aspect-[4/3] overflow-hidden bg-mist">
                            <img
                              src={photo.image_url}
                              alt={
                                photo.alt ||
                                "Lara Cinematography photography"
                              }
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {showVideography && activeVideos.length > 0 && (
                <div>
                  {activeTab === "All" && (
                    <div className="mb-10 text-center">
                      <div className="eyebrow mb-3">
                        Videography
                      </div>

                      <h2 className="font-serif text-3xl text-ink md:text-4xl">
                        Films crafted to be felt forever.
                      </h2>
                    </div>
                  )}

                  <div className="grid gap-10 md:grid-cols-2 md:gap-14">
                    {activeVideos.map((film, index) => (
                      <Reveal
                        key={film.id}
                        delay={(index % 2) * 0.08}
                      >
                        <article>
                          <VideoEmbed
                            youtube={film.youtube_url}
                            vimeo={film.vimeo_url}
                            video={film.video_url}
                            thumbnail={
                              film.thumbnail_url ||
                              film.cover_url
                            }
                            title={film.title}
                          />

                          <div className="mt-5">
                            <div className="text-[0.7rem] uppercase tracking-[0.24em] text-gold">
                              Videography
                            </div>

                            <h3 className="mt-2 font-serif text-2xl">
                              {film.title}
                            </h3>

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
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
