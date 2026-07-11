import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { WhyChoose } from "@/components/site/sections/WhyChoose";
import portraitDefault from "@/assets/portrait.jpg";

export default function About() {
  useEffect(() => {
    document.title = "About Lara — Cinematographer & Storyteller";
  }, []);
  const { data } = useSuspenseQuery(siteBundleQuery);
  const a = data.about;
  const main = data.about_main;
  const image = main?.image || a.portrait_url || portraitDefault;
  const title = main?.title || "About Lara Cinematography";
  const description = main?.description || a.story;
  const team = data.team || [];
  return (
    <SiteLayout>
      <section className="bg-background py-24 md:py-32">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <img src={image} alt={title} className="w-full rounded-3xl object-cover shadow-lg shadow-ink/10" />
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-6 md:pt-8">
            <div className="eyebrow mb-4">{main?.eyebrow || "About"}</div>
            <h1 className="font-serif text-5xl leading-tight md:text-6xl">{title}</h1>
            {description && (
              <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/80">{description}</p>
            )}
          </Reveal>
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container-editorial">
            <Reveal className="mb-14 text-center">
              <div className="eyebrow mb-4">The Team</div>
              <h2 className="font-serif text-4xl md:text-5xl">Meet the storytellers.</h2>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={(i % 3) * 0.06}>
                  <article className="overflow-hidden rounded-3xl bg-card shadow-sm">
                    {m.image && (
                      <img src={m.image} alt={m.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="font-serif text-2xl text-ink">{m.name}</h3>
                      <div className="mt-1 text-[0.7rem] uppercase tracking-[0.24em] text-gold">{m.role}</div>
                      {m.description && (
                        <p className="mt-3 text-sm leading-relaxed text-foreground/70">{m.description}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-20 md:py-28">
        <div className="container-editorial grid gap-12 md:grid-cols-2">
          {[
            { label: "Mission", body: a.mission },
            { label: "Approach", body: a.approach },
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

      <WhyChoose content={data.why_choose} />
    </SiteLayout>
  );
}