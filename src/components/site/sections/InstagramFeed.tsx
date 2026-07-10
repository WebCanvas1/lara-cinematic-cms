import { Instagram } from "lucide-react";
import { Reveal } from "../Reveal";
import type { InstagramFeed as Feed, SocialSettings, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

export function InstagramFeed({ feed, social, heading }: { feed: Feed; social: SocialSettings; heading?: HeadingConfig }) {
  if (!feed.images?.length) return null;
  const h = mergeHeading(heading, { eyebrow: "Instagram" });
  return (
    <section className="bg-background py-24">
      <div className="container-editorial">
        <Reveal className="mb-10">
          <div className={`${h.wrapperCls}`} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && h.title && (
              <h2 className="mb-4 font-serif text-3xl md:text-4xl" style={h.titleStyle}>{h.title}</h2>
            )}
            {h.showSubtitle && h.subtitle && (
              <p className="mb-4 text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          <a
            href={social.instagram || "#"}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 font-serif text-2xl md:text-3xl"
          >
            <Instagram className="h-5 w-5" /> @laracinematography
          </a>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {feed.images.slice(0, 12).map((src, i) => (
            <a key={i} href={social.instagram || "#"} target="_blank" rel="noreferrer" className="group block aspect-square overflow-hidden rounded-2xl bg-mist">
              <img src={src} loading="lazy" alt="" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}