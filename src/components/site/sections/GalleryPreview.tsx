import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import type { GalleryItem, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function GalleryPreview({ items, heading }: { items: GalleryItem[]; heading?: HeadingConfig }) {
  if (!items.length) return null;
  const shown = items.slice(0, 6);
  const h = mergeHeading(heading, { eyebrow: "Gallery", title: "A quieter kind of storytelling." });
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-14">
          <div className={`mx-auto max-w-2xl ${h.wrapperCls}`} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && <h2 className="font-serif text-4xl md:text-5xl" style={h.titleStyle}>{h.title}</h2>}
            {h.showSubtitle && (
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
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