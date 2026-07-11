import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  children: ReactNode[];
  slidesDesktop?: number;
  slidesTablet?: number;
  slidesMobile?: number;
  autoplayMs?: number;
  gapClass?: string;
  showArrows?: boolean;
};

export function Carousel({
  children,
  slidesDesktop = 2,
  slidesTablet = 2,
  slidesMobile = 1,
  autoplayMs = 4500,
  gapClass = "gap-6 md:gap-8",
  showArrows = true,
}: Props) {
  const autoplay = useRef(
    Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start", dragFree: false }, [autoplay.current]);
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

  const mobileBasis = 100 / slidesMobile;
  const tabletBasis = 100 / slidesTablet;
  const desktopBasis = 100 / slidesDesktop;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={`flex ${gapClass}`}>
          {children.map((child, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 grow-0"
              style={{
                flexBasis: `calc(${mobileBasis}% - 0px)`,
              }}
            >
              <div
                className="w-full"
                style={{
                  ["--md-basis" as string]: `${tabletBasis}%`,
                  ["--lg-basis" as string]: `${desktopBasis}%`,
                }}
              >
                <ResponsiveSlide desktop={desktopBasis} tablet={tabletBasis}>
                  {child}
                </ResponsiveSlide>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && children.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 md:px-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev && !embla}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/85 text-ink shadow-md backdrop-blur-sm transition hover:bg-ink hover:text-cream md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext && !embla}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/85 text-ink shadow-md backdrop-blur-sm transition hover:bg-ink hover:text-cream md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Wrapper that uses inline styles + tailwind arbitrary breakpoints via classes.
function ResponsiveSlide({ children }: { children: ReactNode; desktop: number; tablet: number }) {
  return <>{children}</>;
}