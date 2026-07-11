import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import type { GalleryItem, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";
import { Carousel } from "../Carousel";

export function GalleryPreview({
  items,
  heading,
  showEnterLink = true,
  eyebrowDefault = "Gallery",
  titleDefault = "A quieter kind of storytelling.",
}: {
  items: GalleryItem[];
  heading?: HeadingConfig;
  showEnterLink?: boolean;
  eyebrowDefault?: string;
  titleDefault?: string;
}) {
  if (!items.length) return null;
  const shown = items.slice(0, 20);
  const h = mergeHeading(heading, { eyebrow: eyebrowDefault, title: titleDefault });
  const slides = shown.map((item) => (
    <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist shadow-sm">
      <img
        src={item.image_url}
        alt={item.alt || "Gallery image"}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
      />
    </div>
  ));
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

        <Carousel slidesDesktop={4} slidesTablet={2} slidesMobile={1} gapPx={20}>
          {slides}
        </Carousel>

        {showEnterLink && (
          <div className="mt-12 text-center">
            <Link
              to="/portfolio/photography"
              className="inline-flex border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.28em] text-ink"
            >
              Enter the gallery
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}