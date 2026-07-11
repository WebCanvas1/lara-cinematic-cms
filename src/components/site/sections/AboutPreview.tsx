import { Link } from "@tanstack/react-router";
import { Reveal } from "../Reveal";
import portraitDefault from "@/assets/portrait.jpg";
import type { AboutContent, AboutMainContent, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function AboutPreview({
  about,
  aboutMain,
  heading,
}: {
  about: AboutContent;
  aboutMain?: AboutMainContent;
  heading?: HeadingConfig;
}) {
  const portrait = aboutMain?.image || about.portrait_url || portraitDefault;
  const title = aboutMain?.title || "About Lara Cinematography";
  const description = aboutMain?.description || about.story;
  const h = mergeHeading(heading, {
    eyebrow: aboutMain?.eyebrow || "About",
    title,
    align: "left",
  });
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-editorial grid gap-16 md:grid-cols-12 md:gap-20">
        <Reveal className="md:col-span-5">
          <div className="relative">
            <img src={portrait} alt={title} className="w-full rounded-3xl object-cover shadow-lg shadow-ink/10" loading="lazy" />
            <div className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-3xl border border-gold md:block" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-7 md:pt-12">
          <div className={h.wrapperCls} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && (
              <h2 className="font-serif text-4xl leading-tight md:text-5xl" style={h.titleStyle}>{h.title}</h2>
            )}
            {h.showSubtitle && (
              <p className="mt-4 text-base leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
          {description && (
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/80 md:text-lg">
              {description}
            </p>
          )}
          {about.mission && (
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-serif text-lg italic text-ink">
              {about.mission}
            </blockquote>
          )}
          <Link
            to="/about"
            className="mt-10 inline-flex rounded-full border border-ink px-8 py-3 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-all hover:bg-ink hover:text-cream"
          >
            Read Full Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}