import { Instagram } from "lucide-react";
import { Reveal } from "../Reveal";
import type { InstagramFeed as Feed, SocialSettings } from "@/lib/site-types";

export function InstagramFeed({ feed, social }: { feed: Feed; social: SocialSettings }) {
  if (!feed.images?.length) return null;
  return (
    <section className="bg-background py-24">
      <div className="container-editorial">
        <Reveal className="mb-10 text-center">
          <div className="eyebrow mb-4">Instagram</div>
          <a
            href={social.instagram || "#"}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 font-serif text-2xl md:text-3xl"
          >
            <Instagram className="h-5 w-5" /> @laracinematography
          </a>
        </Reveal>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {feed.images.slice(0, 12).map((src, i) => (
            <a key={i} href={social.instagram || "#"} target="_blank" rel="noreferrer" className="group block aspect-square overflow-hidden bg-mist">
              <img src={src} loading="lazy" alt="" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}