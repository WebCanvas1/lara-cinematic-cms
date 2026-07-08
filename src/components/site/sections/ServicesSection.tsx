import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { Service } from "@/lib/site-types";

function Icon({ name }: { name: string }) {
  const Cmp =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ??
    Icons.Film;

  return <Cmp className="h-5 w-5 text-gold" />;
}

export function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16 text-center">
          <div className="eyebrow mb-4">Services</div>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">
            Every commission, crafted like an heirloom.
          </h2>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.06} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]">
              <div className="group flex min-h-[260px] h-full flex-col border border-border bg-background p-8 transition-colors hover:bg-cream md:p-10">
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
