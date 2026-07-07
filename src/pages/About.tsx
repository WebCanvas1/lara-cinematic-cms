import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import portraitDefault from "@/assets/portrait.jpg";

export default function About() {
  useEffect(() => {
    document.title = "About Lara — Cinematographer & Storyteller";
  }, []);
  const { data } = useSuspenseQuery(siteBundleQuery);
  const a = data.about;
  const portrait = a.portrait_url || portraitDefault;
  return (
    <SiteLayout>
      <section className="bg-background py-24 md:py-32">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <img src={portrait} alt={a.name || "Portrait"} className="w-full object-cover" />
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-7 md:pt-12">
            <div className="eyebrow mb-4">About</div>
            <h1 className="font-serif text-5xl leading-tight md:text-6xl">
              {a.tagline || "Cinematographer & Storyteller"}
            </h1>
            <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/80">{a.story}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-editorial grid gap-12 md:grid-cols-3">
          {[
            { label: "Mission", body: a.mission },
            { label: "Approach", body: a.approach },
            { label: "Experience", body: a.experience },
          ].filter((x) => x.body).map((x, i) => (
            <Reveal key={x.label} delay={i * 0.1}>
              <div className="border-t border-gold pt-6">
                <div className="eyebrow mb-3">{x.label}</div>
                <p className="font-serif text-xl leading-relaxed text-ink">{x.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}