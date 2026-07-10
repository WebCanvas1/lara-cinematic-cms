import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { AddOnItem, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

function Icon({ name }: { name: string }) {
  const Cmp =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ??
    Icons.Sparkles;

  return <Cmp className="h-5 w-5 text-gold" />;
}

export function AddOnsSection({ addons, heading }: { addons: AddOnItem[]; heading?: HeadingConfig }) {
  if (!addons.length) return null;
  const h = mergeHeading(heading, {
    eyebrow: "Enhancements",
    title: "Thoughtful add-ons, tailored to your day.",
    subtitle: "Elevate any collection with these refined additions.",
  });
  return (
    <section id="addons" className="bg-background py-24 md:py-32">
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

        <div className="flex flex-wrap justify-center gap-4">
          {addons.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 0.06} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]">
              <div className="group flex min-h-[240px] h-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:bg-cream md:p-10">
  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-cream">
    <Icon name={a.icon} />
  </div>

  <div className="flex items-start justify-between gap-4">
    <h3 className="font-serif text-xl leading-tight text-ink">{a.title}</h3>
    <span className="whitespace-nowrap font-serif text-lg text-gold">
      {a.price}
    </span>
  </div>

  {a.description && (
    <p className="mt-4 text-sm leading-relaxed text-foreground/70">
      {a.description}
    </p>
  )}
</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
