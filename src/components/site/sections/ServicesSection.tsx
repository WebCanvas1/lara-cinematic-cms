import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { Service, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

function Icon({ name }: { name: string }) {
  const Cmp =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ??
    Icons.Film;

  return <Cmp className="h-5 w-5 text-gold" />;
}

export function ServicesSection({ services, heading }: { services: Service[]; heading?: HeadingConfig }) {
  if (!services.length) return null;
  const h = mergeHeading(heading, {
    eyebrow: "Services",
    title: "Every commission, crafted like an heirloom.",
  });
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16">
          <div className={`mx-auto max-w-2xl ${h.wrapperCls}`} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && (
              <h2 className="font-serif text-4xl md:text-5xl" style={h.titleStyle}>{h.title}</h2>
            )}
            {h.showSubtitle && (
              <p className="mt-5 text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.06} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]">
              <div className="group flex min-h-[260px] h-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:bg-cream md:p-10">
  <Icon name={s.icon} />
  <h3 className="mt-8 font-serif text-2xl leading-tight">{s.title}</h3>
  <p className="mt-4 text-sm leading-relaxed text-foreground/70">
    {s.description}
  </p>
</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
