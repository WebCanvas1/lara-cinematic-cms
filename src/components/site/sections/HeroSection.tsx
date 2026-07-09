import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroDefault from "@/assets/hero.jpg";
import type { HeroContent } from "@/lib/site-types";

export function HeroSection({ hero }: { hero: HeroContent }) {
  const bg = hero.background_url || heroDefault;
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-ink text-white">
      {hero.background_type === "video" && hero.background_url ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={hero.background_url}
          poster={heroDefault}
        />
      ) : (
        <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink/70" />

      <div className="container-editorial relative z-10 flex min-h-[92vh] flex-col justify-end py-24 md:justify-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="hairline" />
            <span className="text-[0.7rem] uppercase tracking-[0.32em] text-white/80">Lara Cinematography</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-white">
            {hero.heading}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {hero.subheading}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to={hero.cta_primary_href || "/portfolio"}
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.28em] text-ink shadow-lg shadow-ink/10 transition-all hover:bg-gold hover:text-cream"
            >
              {hero.cta_primary_label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to={hero.cta_secondary_href || "/contact"}
              className="inline-flex items-center gap-2 rounded-full border border-cream/70 px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.28em] text-cream transition-all hover:bg-cream hover:text-ink"
            >
              {hero.cta_secondary_label}
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 md:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-white/50" />
      </motion.div>
    </section>
  );
}