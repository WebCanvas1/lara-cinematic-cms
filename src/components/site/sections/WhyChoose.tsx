import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { WhyChooseContent, HeadingConfig } from "@/lib/site-types";
import { mergeHeading } from "./section-heading";

function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Sparkles;
  return <Cmp className="h-6 w-6 text-gold" />;
}

export function WhyChoose({ content, heading }: { content: WhyChooseContent; heading?: HeadingConfig }) {
  if (!content.items?.length) return null;
  const h = mergeHeading(heading, {
    eyebrow: "Why Lara",
    title: "A craft-first approach to every film.",
    align: "left",
  });
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className={h.wrapperCls} style={h.wrapperStyle}>
            {h.showEyebrow && <div className="eyebrow mb-4" style={h.eyebrowStyle}>{h.eyebrow}</div>}
            {h.showTitle && (
              <h2 className="max-w-2xl font-serif text-4xl leading-tight md:text-5xl" style={h.titleStyle}>{h.title}</h2>
            )}
            {h.showSubtitle && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70" style={h.subtitleStyle}>{h.subtitle}</p>
            )}
          </div>
        </Reveal>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <div className="border-t border-border pt-6">
                <div className="mb-5"><Icon name={item.icon} /></div>
                <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}