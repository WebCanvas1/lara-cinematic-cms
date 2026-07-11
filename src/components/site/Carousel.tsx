import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  children: ReactNode[];
  slidesDesktop?: number;
  slidesTablet?: number;
  slidesMobile?: number;
  autoplayMs?: number;
  gapPx?: number;
  showArrows?: boolean;
};

/**
 * Responsive Embla carousel with continuous autoplay, infinite loop,
 * pause on hover, arrows and touch swipe. Slide widths change at
 * md (768px) and lg (1024px) breakpoints via a scoped style tag so we
 * can vary the count per breakpoint from props.
 */
export function Carousel({
  children,
  slidesDesktop = 2,
  slidesTablet = 2,
  slidesMobile = 1,
  autoplayMs = 4500,
  gapPx = 24,
  showArrows = true,
}: Props) {
  const autoplay = useRef(
    Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps" },
    [autoplay.current],
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect]);

  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `l-car-${uid}`;

  const slideCss = `
    .${cls} > .embla__container { display: flex; gap: ${gapPx}px; }
    .${cls} > .embla__container > .embla__slide { flex: 0 0 calc(100% / ${slidesMobile} - ${((slidesMobile - 1) * gapPx) / slidesMobile}px); min-width: 0; }
    @media (min-width: 768px) {
      .${cls} > .embla__container > .embla__slide { flex-basis: calc(100% / ${slidesTablet} - ${((slidesTablet - 1) * gapPx) / slidesTablet}px); }
    }
    @media (min-width: 1024px) {
      .${cls} > .embla__container > .embla__slide { flex-basis: calc(100% / ${slidesDesktop} - ${((slidesDesktop - 1) * gapPx) / slidesDesktop}px); }
    }
  `;

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: slideCss }} />
      <div className={`overflow-hidden ${cls}`} ref={emblaRef}>
        <div className="embla__container">
          {children.map((child, i) => (
            <div key={i} className="embla__slide">
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && children.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => embla?.scrollPrev()}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/85 text-ink shadow-md backdrop-blur-sm transition hover:bg-ink hover:text-cream md:left-3 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => embla?.scrollNext()}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/85 text-ink shadow-md backdrop-blur-sm transition hover:bg-ink hover:text-cream md:right-3 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}