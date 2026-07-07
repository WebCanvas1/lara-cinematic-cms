import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { GALLERY_CATEGORIES } from "@/lib/site-types";

export default function Gallery() {
  useEffect(() => {
    document.title = "Gallery — Lara Cinematography";
  }, []);
  const { data } = useSuspenseQuery(galleryQuery);
  const [cat, setCat] = useState<string>("All");
  const [idx, setIdx] = useState(-1);
  const filtered = useMemo(() => (cat === "All" ? data : data.filter((g) => g.category === cat)), [data, cat]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-cream py-24 md:py-32">
        <div className="container-editorial text-center">
          <div className="eyebrow mb-4">Gallery</div>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
            Frames from a life in cinema.
          </h1>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container-editorial">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {(["All", ...GALLERY_CATEGORIES] as const).map((c) => (
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
            <p className="py-24 text-center text-muted-foreground">No images in this category yet.</p>
          ) : (
            <div className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
              {filtered.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setIdx(i)}
                  className="group mb-3 block w-full overflow-hidden md:mb-5"
                >
                  <img
                    src={g.image_url}
                    alt={g.alt || "Gallery image"}
                    loading="lazy"
                    className="w-full transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}

          <Lightbox
            open={idx >= 0}
            close={() => setIdx(-1)}
            index={idx}
            slides={filtered.map((g) => ({ src: g.image_url, alt: g.alt }))}
          />
        </div>
      </section>
    </SiteLayout>
  );
}