import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Testimonial } from "@/lib/site-types";

export function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);
  if (!items.length) return null;
  const t = items[i];
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-editorial mx-auto max-w-3xl text-center">
        <div className="eyebrow mb-8">Kind Words</div>
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