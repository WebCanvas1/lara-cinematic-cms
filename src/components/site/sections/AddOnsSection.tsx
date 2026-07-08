import * as Icons from "lucide-react";
import { Reveal } from "../Reveal";
import type { AddOnItem } from "@/lib/site-types";

function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Sparkles;
  return <Cmp className="h-5 w-5 text-[#c8a46d]" />;
}

export function AddOnsSection({ addons }: { addons: AddOnItem[] }) {
  if (!addons.length) return null;

  return (
    <section className="bg-white px-6 py-24">
      <Reveal>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#c8a46d]">
            Enhancements
          </p>
          <h2 className="font-serif text-4xl leading-tight text-black md:text-6xl">
            Thoughtful add-ons, tailored to your day.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-neutral-600">
            Elevate any collection with these refined additions.
          </p>
        </div>
      </Reveal>

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {addons.map((a, i) => (
          <Reveal key={a.id ?? a.title ?? i} delay={i * 0.04}>
            <div className="h-full bg-white p-10 transition duration-300 hover:bg-[#faf8f3]">
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-12 w-12 items-center justify-center border border-neutral-200">
                  <Icon name={a.icon || "Sparkles"} />
                </div>

                {a.price && (
                  <p className="font-serif text-xl text-[#c8a46d]">
                    {a.price}
                  </p>
                )}
              </div>

              <h3 className="mt-8 font-serif text-2xl leading-tight text-black">
                {a.title}
              </h3>

              {a.description && (
                <p className="mt-5 text-sm leading-7 text-neutral-600">
                  {a.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
