import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Testimonial, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function TestimonialsSlider({ items, heading }: { items: Testimonial[]; heading?: HeadingConfig }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return null;
  const t = items[i];
  const h = mergeHeading(heading, { eyebrow: "Kind Words" });
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-editorial mx-auto max-w-3xl text-center">
        <div className={`mb-8 ${h.wrapperCls}`} style={h.wrapperStyle}>
          {h.showEyebrow && <div className="eyebrow" style={h.eyebrowStyle}>{h.eyebrow}</div>}
          {h.showTitle && h.title && (
            <h2 className="mt-4 font-serif text-3xl md:text-4xl" style={h.titleStyle}>{h.title}</h2>
          )}
          {h.showSubtitle && h.subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7 }}
            className="font-serif text-2xl italic leading-relaxed text-ink md:text-3xl"
          >
            “{t.quote}”
            <footer className="mt-8 text-[0.72rem] uppercase tracking-[0.28em] not-italic text-foreground/60">
              — {t.name}{t.role ? `, ${t.role}` : ""}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
        {items.length > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Testimonial ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-px transition-all ${idx === i ? "w-10 bg-gold" : "w-5 bg-border"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}