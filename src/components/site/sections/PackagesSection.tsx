import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Reveal } from "../Reveal";
import type { PackageItem, HeadingConfig } from "@/lib/site-types";
import { PACKAGE_CATEGORIES } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

function packageDetailHref(p: PackageItem): string {
  const cat = (p.category === "Events" ? "events" : "weddings");
  return `/packages/${cat}#pkg-${p.id}`;
}

export function PackagesSection({
  packages,
  heading,
  variant = "full",
  categoryFilter,
}: {
  packages: PackageItem[];
  heading?: HeadingConfig;
  variant?: "full" | "preview";
  categoryFilter?: "Wedding" | "Events";
}) {
  if (!packages.length) return null;
  const h = mergeHeading(heading, {
    eyebrow: "Investment",
    title: "Curated packages, crafted for every love story.",
    subtitle: "Considered collections designed to preserve your day with intention, elegance, and cinematic craft.",
  });

  if (variant === "preview") {
    return <PackagesPreview packages={packages} h={h} />;
  }

  const list = categoryFilter
    ? packages.filter((p) => (p.category === "Events" ? "Events" : "Wedding") === categoryFilter)
    : packages;
  if (!list.length) return null;
  return (
    <section id="packages" className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16">
          <div className={`mx-auto max-w-2xl ${h.wrapperCls}`} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && <h2 className="font-serif text-4xl md:text-5xl" style={h.titleStyle}>{h.title}</h2>}
            {h.showSubtitle && (
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <article id={`pkg-${p.id}`}
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
                  {p.long_description && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground/60">{p.long_description}</p>
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

                  {p.addons && p.addons.length > 0 && (
                    <div className="mb-6 rounded-2xl border border-border bg-cream/50 p-4">
                      <div className="mb-2 text-[0.6rem] uppercase tracking-[0.28em] text-gold">Add-ons</div>
                      <ul className="space-y-1 text-sm text-foreground/80">
                        {p.addons.map((a, idx) => (
                          <li key={idx} className="flex justify-between gap-3">
                            <span>{a.title}</span>
                            {a.price && <span className="text-foreground/60">{a.price}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
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

function PackagesPreview({
  packages,
  h,
}: {
  packages: PackageItem[];
  h: ReturnType<typeof mergeHeading>;
}) {
  const cats = PACKAGE_CATEGORIES;
  const [cat, setCat] = useState<(typeof cats)[number]>("Wedding");
  const list = packages.filter((p) => (p.category === "Events" ? "Events" : "Wedding") === cat);
  return (
    <section id="packages" className="bg-cream py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-10">
          <div className={`mx-auto max-w-2xl ${h.wrapperCls}`} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && <h2 className="font-serif text-4xl md:text-5xl" style={h.titleStyle}>{h.title}</h2>}
            {h.showSubtitle && (
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
        </Reveal>
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-7 py-2.5 text-[0.7rem] uppercase tracking-[0.24em] transition-all ${
                cat === c ? "border-ink bg-ink text-cream" : "border-border text-foreground/70 hover:border-ink"
              }`}
            >
              {c === "Wedding" ? "Wedding Packages" : "Events"}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No packages in this category yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {list.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.06}>
                <article className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_20px_60px_-30px_rgba(31,23,19,0.22)] transition-transform duration-500 hover:-translate-y-1 ${p.featured ? "border-gold" : "border-border"}`}>
                  {p.featured && (
                    <div className="absolute right-4 top-6 z-10 rounded-full bg-gold px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-cream shadow-md">
                      {p.badge || "Most Popular"}
                    </div>
                  )}
                  {p.image ? (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-mist">
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-mist via-cream to-background" />
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-serif text-2xl text-ink">{p.name}</h3>
                    {p.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70">{p.description}</p>
                    )}
                    <div className="mt-6">
                      <PkgButton href={packageDetailHref(p)} featured={p.featured}>
                        View Package Details
                      </PkgButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
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