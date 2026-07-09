import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import portraitDefault from "@/assets/portrait.jpg";
import type { AboutContent } from "@/lib/site-types";

export function AboutPreview({ about }: { about: AboutContent }) {
  const portrait = about.portrait_url || portraitDefault;
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-editorial grid gap-16 md:grid-cols-12 md:gap-20">
        <Reveal className="md:col-span-5">
          <div className="relative">
            <img src={portrait} alt={about.name} className="w-full rounded-3xl object-cover shadow-lg shadow-ink/10" loading="lazy" />
            <div className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-3xl border border-gold md:block" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-7 md:pt-12">
          <div className="eyebrow mb-4">About</div>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            {about.tagline || "Cinematographer & Storyteller"}
          </h2>
          <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/80 md:text-lg">
            {about.story}
          </p>
          {about.mission && (
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-serif text-lg italic text-ink">
              {about.mission}
            </blockquote>
          )}
          <Link
            to="/about"
            className="mt-10 inline-flex border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.28em] text-ink"
          >
            Read the full story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}