import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { AddOnItem } from "@/lib/site-types";

function Icon({ name }: { name: string }) {
  const Cmp =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ??
    Icons.Sparkles;

  return <Cmp className="h-5 w-5 text-gold" />;
}

export function AddOnsSection({ addons }: { addons: AddOnItem[] }) {
  if (!addons.length) return null;

  return (
    <section id="addons" className="bg-background py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-16 text-center">
          <div className="eyebrow mb-4">Enhancements</div>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">
            Thoughtful add-ons, tailored to your day.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/70">
            Elevate any collection with these refined additions.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addons.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 0.06}>
              <div className="group flex h-full flex-col border border-border bg-background p-8 transition-colors hover:bg-cream md:p-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center border border-border bg-cream">
                  <Icon name={a.icon} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl text-ink">{a.title}</h3>
                  <span className="whitespace-nowrap font-serif text-lg text-gold">
                    {a.price}
                  </span>
                </div>

                {a.description && (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">
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
