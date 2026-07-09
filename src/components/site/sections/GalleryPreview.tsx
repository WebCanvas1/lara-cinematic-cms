import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import type { GalleryItem } from "@/lib/site-types";

export function GalleryPreview({ items }: { items: GalleryItem[] }) {
  if (!items.length) return null;
  const shown = items.slice(0, 6);
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-14 text-center">
          <div className="eyebrow mb-4">Gallery</div>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">
            A quieter kind of storytelling.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {shown.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.05}
              className={i % 5 === 0 ? "md:row-span-2" : ""}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl bg-mist shadow-sm">
                <img
                  src={item.image_url}
                  alt={item.alt || "Gallery image"}
                  loading="lazy"
                  className={`w-full ${i % 5 === 0 ? "h-full min-h-[420px]" : "aspect-[4/5]"} object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105`}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.28em] text-ink"
          >
            Enter the gallery
          </Link>
        </div>
      </div>
    </section>
  );
}