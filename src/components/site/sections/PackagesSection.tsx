import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Reveal } from "../Reveal";
import type { PackageItem } from "@/lib/site-types";

export function PackagesSection({ packages }: { packages: PackageItem[] }) {
  if (!packages.length) return null;
  return (
    <section id="packages" className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16 text-center">
          <div className="eyebrow mb-4">Investment</div>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">
            Curated packages, crafted for every love story.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70">
            Considered collections designed to preserve your day with intention, elegance, and cinematic craft.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_20px_60px_-30px_rgba(31,23,19,0.22)] transition-transform duration-500 hover:-translate-y-1 ${
                  p.featured ? "border-gold" : "border-border"
                }`}
              >
                {p.featured && (
                  <div className="absolute right-4 top-6 z-10 rounded-full bg-gold px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-cream shadow-md">
                    {p.badge || "Most Popular"}
                  </div>
                )}
                {!p.featured && p.badge && (
                  <div className="absolute right-4 top-6 z-10 rounded-full bg-ink px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-cream shadow-md">
                    {p.badge}
                  </div>
                )}

                {p.image ? (
                  <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-mist via-cream to-background" />
                )}

                <div className="flex flex-1 flex-col p-8">
                  {p.subtitle && (
                    <div className="text-[0.65rem] uppercase tracking-[0.28em] text-gold">{p.subtitle}</div>
                  )}
                  <h3 className="mt-3 font-serif text-2xl text-ink">{p.name}</h3>
                  {p.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.description}</p>
                  )}

                  <div className="my-6 flex items-baseline gap-1 border-y border-border py-4">
                    <span className="font-serif text-4xl text-ink">{p.price}</span>
                  </div>

                  {p.features?.length > 0 && (
                    <ul className="mb-8 space-y-2.5">
                      {p.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto">
                    <PkgButton href={p.buttonLink || "/contact"} featured={p.featured}>
                      {p.buttonText || "Enquire Now"}
                    </PkgButton>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PkgButton({ href, featured, children }: { href: string; featured: boolean; children: React.ReactNode }) {
  const base = "block w-full rounded-full py-3.5 text-center text-[0.7rem] uppercase tracking-[0.28em] transition-colors";
  const cls = featured
    ? `${base} bg-ink text-cream hover:bg-gold`
    : `${base} border border-ink text-ink hover:bg-ink hover:text-cream`;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) return <a href={href} className={cls}>{children}</a>;
  return <Link to={href} className={cls}>{children}</Link>;
}